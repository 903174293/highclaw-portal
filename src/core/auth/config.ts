import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { oneTap } from 'better-auth/plugins';
import { getLocale } from 'next-intl/server';

import { db } from '@/core/db';
import { envConfigs, getTrustedOrigins, normalizeOriginUrl } from '@/config';
import * as schema from '@/config/db/schema';
import { VerifyEmail } from '@/shared/blocks/email/verify-email';
import {
  getCookieFromCtx,
  getHeaderValue,
  guessLocaleFromAcceptLanguage,
} from '@/shared/lib/cookie';
import { getUuid } from '@/shared/lib/hash';
import { getClientIp } from '@/shared/lib/ip';
import { grantCreditsForNewUser } from '@/shared/models/credit';
import { getEmailService } from '@/shared/services/email';
import { autoGrantSuperAdmin, grantRoleForNewUser } from '@/shared/services/rbac';

// Best-effort dedupe to prevent sending verification emails too frequently.
// This is especially helpful in dev/hot reload, transient network conditions,
// and to add a server-side throttle beyond any client-side cooldown.
const recentVerificationEmailSentAt = new Map<string, number>();
const VERIFICATION_EMAIL_MIN_INTERVAL_MS = 60_000;

/**
 * 从当前 HTTP 请求解析站点 Origin（与浏览器地址栏 Host 一致）。
 * 用于 OAuth：redirect_uri 与 Set-Cookie 的 Host 必须一致，否则 state Cookie 在回调时带不上 → please_restart_the_process。
 *
 * Host 优先级：X-Forwarded-Host > Host header > request.url（fallback）
 * 协议优先级：X-Forwarded-Proto > 配置推断（AUTH_URL/APP_URL 同域名则跟随其协议）> http
 *
 * 典型生产链路：CDN 终止 SSL → Nginx (HTTP) → Node.js (HTTP)
 * 此时 Nginx 的 $scheme=http，X-Forwarded-Proto=http，但用户实际通过 https 访问。
 * 通过比对配置的 AUTH_URL 域名来修正协议。
 */
function resolveAuthBaseURLFromRequest(request: Request | null | undefined): string {
  if (!request) {
    return '';
  }
  try {
    const forwarded = request.headers.get('x-forwarded-host');
    const host = forwarded || request.headers.get('host');
    if (!host) {
      return normalizeOriginUrl(new URL(request.url).origin);
    }

    const cleanHost = host.split(',')[0].trim();
    const forwardedProto = request.headers.get('x-forwarded-proto');
    let scheme = forwardedProto ? forwardedProto.split(',')[0].trim() : 'http';

    if (scheme === 'http') {
      const hostWithoutPort = cleanHost.split(':')[0];
      const configuredUrl = envConfigs.auth_url || envConfigs.app_url || '';
      try {
        const u = new URL(configuredUrl);
        if (u.hostname === hostWithoutPort && u.protocol === 'https:') {
          scheme = 'https';
        }
      } catch { /* 配置为空或不合法时忽略 */ }
    }

    return normalizeOriginUrl(`${scheme}://${cleanHost}`);
  } catch {
    return '';
  }
}

// Static auth options - NO database connection
// This ensures zero database calls during build time
const authOptions = {
  appName: envConfigs.app_name,
  baseURL: envConfigs.auth_url,
  secret: envConfigs.auth_secret,
  trustedOrigins: getTrustedOrigins(),
  user: {
    // Allow persisting custom columns on user table.
    // Without this, better-auth may ignore extra properties during create/update.
    additionalFields: {
      utmSource: {
        type: 'string',
        // Not user-editable input; we set it internally.
        input: false,
        required: false,
        defaultValue: '',
      },
      ip: {
        type: 'string',
        input: false,
        required: false,
        defaultValue: '',
      },
      locale: {
        type: 'string',
        input: false,
        required: false,
        defaultValue: '',
      },
    },
  },
  advanced: {
    database: {
      generateId: () => getUuid(),
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  logger: {
    verboseLogging: false,
    // Disable all logs during build and production
    disabled: true,
  },
};

// get auth options with configs
export async function getAuthOptions(
  configs: Record<string, string>,
  /** 传入 /api/auth 收到的 Request 时，优先用其 Origin 作为 baseURL，避免 .env 里 AUTH_URL 与浏览器 Host 不一致 */
  request?: Request | null
) {
  const emailVerificationEnabled =
    configs.email_verification_enabled === 'true' && !!configs.resend_api_key;

  const fromRequest = resolveAuthBaseURLFromRequest(request ?? null);

  /** 不能为空；API 路由优先跟随实际请求的 Host（localhost vs 127.0.0.1） */
  const baseURL = normalizeOriginUrl(
    fromRequest ||
      envConfigs.auth_url ||
      envConfigs.app_url ||
      'http://localhost:3000'
  );

  /** 当前访问 Origin 一并加入，避免 trustedOrigins 只配了另一套 Host 时 OAuth 回调被拒 */
  const trustedOrigins = [
    ...new Set([...getTrustedOrigins(), baseURL].filter(Boolean)),
  ];

  const isDev = process.env.NODE_ENV === 'development';

  /**
   * 生产模式 + HTTP（如本地 pnpm start）时，若默认 Secure Cookie，浏览器在 http 下不会保存/携带 OAuth state → please_restart_the_process。
   * AUTH_COOKIE_SECURE: 显式 true/false 覆盖自动推断（staging 常用）。
   */
  const useSecureCookies =
    process.env.AUTH_COOKIE_SECURE === 'true'
      ? true
      : process.env.AUTH_COOKIE_SECURE === 'false'
        ? false
        : baseURL.startsWith('https://');

  return {
    ...authOptions,
    baseURL,
    trustedOrigins,
    advanced: {
      ...(authOptions.advanced ?? {}),
      useSecureCookies,
    },
    // Add database connection only when actually needed (runtime)
    database: envConfigs.database_url
      ? drizzleAdapter(db(), {
          provider: getDatabaseProvider(envConfigs.database_provider),
          schema: schema,
        })
      : null,
    databaseHooks: {
      user: {
        create: {
          before: async (user: any, ctx: any) => {
            try {
              const ip = await getClientIp();
              if (ip) {
                user.ip = ip;
              }

              // Prefer NEXT_LOCALE cookie (next-intl). Fallback to accept-language.
              const localeFromCookie = getCookieFromCtx(ctx, 'NEXT_LOCALE');

              const localeFromHeader = guessLocaleFromAcceptLanguage(
                getHeaderValue(ctx, 'accept-language')
              );

              const locale =
                (localeFromCookie || localeFromHeader || (await getLocale())) ??
                '';

              if (locale && typeof locale === 'string') {
                user.locale = locale.slice(0, 20);
              }

              // Only set on first creation; never overwrite later.
              if (user?.utmSource) return user;

              const raw = getCookieFromCtx(ctx, 'utm_source');
              if (!raw || typeof raw !== 'string') return user;

              // Keep it small & safe.
              const decoded = decodeURIComponent(raw).trim();
              const sanitized = decoded
                .replace(/[^\w\-.:]/g, '') // allow a-zA-Z0-9_ - . :
                .slice(0, 100);

              if (sanitized) {
                user.utmSource = sanitized;
              }
            } catch {
              // best-effort only
            }
            return user;
          },
          after: async (user: any) => {
            try {
              if (!user.id) {
                throw new Error('user id is required');
              }

              // grant credits for new user
              await grantCreditsForNewUser(user);

              // grant role for new user
              await grantRoleForNewUser(user);
            } catch (e) {
              console.log('grant credits or role for new user failed', e);
            }
          },
        },
      },
      session: {
        create: {
          after: async (session: any) => {
            try {
              if (session?.userId) {
                const { user: userTable } = await import('@/config/db/schema');
                const { eq } = await import('drizzle-orm');
                const [u] = await db().select().from(userTable).where(eq(userTable.id, session.userId));
                if (u) {
                  await autoGrantSuperAdmin(u);
                }
              }
            } catch { /* best-effort */ }
          },
        },
      },
    },
    emailAndPassword: {
      enabled: configs.email_auth_enabled !== 'false',
      requireEmailVerification: emailVerificationEnabled,
      // Avoid creating a session immediately after sign up when verification is required.
      autoSignIn: emailVerificationEnabled ? false : true,
    },
    ...(emailVerificationEnabled
      ? {
          emailVerification: {
            // We explicitly send verification emails from the UI with a callbackURL
            // (redirecting to /verify-email). Disabling automatic sends avoids duplicates.
            sendOnSignUp: false,
            sendOnSignIn: false,
            // After user clicks the verification link, create session automatically.
            autoSignInAfterVerification: true,
            // 24 hours
            expiresIn: 60 * 60 * 24,
            sendVerificationEmail: async (
              { user, url }: { user: any; url: string; token: string },
              _request: Request
            ) => {
              try {
                const key = String(user?.email || '').toLowerCase();
                const now = Date.now();
                const last = recentVerificationEmailSentAt.get(key) || 0;
                if (key && now - last < VERIFICATION_EMAIL_MIN_INTERVAL_MS) {
                  return;
                }
                if (key) {
                  recentVerificationEmailSentAt.set(key, now);
                }

                const emailService = await getEmailService(configs as any);
                const logoUrl = envConfigs.app_logo?.startsWith('http')
                  ? envConfigs.app_logo
                  : `${envConfigs.app_url}${envConfigs.app_logo?.startsWith('/') ? '' : '/'}${envConfigs.app_logo || ''}`;
                // Avoid blocking auth response on email sending.
                await emailService.sendEmail({
                  to: user.email,
                  subject: `Verify your email - ${envConfigs.app_name}`,
                  react: VerifyEmail({
                    appName: envConfigs.app_name,
                    logoUrl,
                    url,
                  }),
                });
              } catch (e) {
                console.log('send verification email failed:', e);
              }
            },
          },
        }
      : {}),
    socialProviders: await getSocialProviders(configs),
    plugins:
      configs.google_client_id && configs.google_one_tap_enabled === 'true'
        ? [oneTap()]
        : [],
    /** 替代内置 /api/auth/error 空白页，并把 error 参数带到可读页面 */
    onAPIError: {
      throw: false,
      errorURL: `${baseURL}/auth-error`,
      onError: (err: unknown) => {
        if (isDev) {
          console.error('[better-auth] onAPIError:', err);
        }
      },
    },
    logger: {
      verboseLogging: isDev,
      disabled: !isDev,
    },
  };
}

// get social providers with configs
export async function getSocialProviders(configs: Record<string, string>) {
  const providers: any = {};

  // google auth
  if (configs.google_client_id && configs.google_client_secret) {
    providers.google = {
      clientId: configs.google_client_id,
      clientSecret: configs.google_client_secret,
    };
  }

  // github auth
  if (configs.github_client_id && configs.github_client_secret) {
    providers.github = {
      clientId: configs.github_client_id,
      clientSecret: configs.github_client_secret,
    };
  }

  return providers;
}

// convert database provider to better-auth database provider
export function getDatabaseProvider(
  provider: string
): 'sqlite' | 'pg' | 'mysql' {
  switch (provider) {
    case 'sqlite':
      return 'sqlite';
    case 'turso':
      return 'sqlite';
    case 'postgresql':
      return 'pg';
    case 'mysql':
      return 'mysql';
    default:
      throw new Error(
        `Unsupported database provider for auth: ${envConfigs.database_provider}`
      );
  }
}
