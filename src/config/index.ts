import packageJson from '../../package.json';

// Note: Environment variables are loaded via dotenv-cli in package.json scripts.
// Next.js automatically loads .env files in the runtime, so no manual loading is needed here.

export type ConfigMap = Record<string, string>;

/**
 * 去掉尾部斜杠，便于与浏览器 Origin 字符串一致（Better Auth trustedOrigins 需精确匹配）
 */
export function normalizeOriginUrl(raw: string): string {
  const t = raw.trim();
  if (!t) return '';
  return t.replace(/\/+$/, '');
}

/**
 * Better Auth 的 trustedOrigins：默认含 NEXT_PUBLIC_APP_URL，另可通过 AUTH_TRUSTED_ORIGINS 追加多个（逗号分隔）。
 * Sign up 报 Invalid origin 时，检查浏览器地址是否与其中任一条完全一致（含 http/https、www、端口）。
 */
export function getTrustedOrigins(): string[] {
  const primary = normalizeOriginUrl(
    process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  );
  const extra = (process.env.AUTH_TRUSTED_ORIGINS ?? '')
    .split(',')
    .map((s) => normalizeOriginUrl(s))
    .filter(Boolean);
  return [...new Set([primary, ...extra].filter(Boolean))];
}

export const envConfigs: ConfigMap = {
  app_url: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  app_name: process.env.NEXT_PUBLIC_APP_NAME ?? 'HighClaw',
  app_description: process.env.NEXT_PUBLIC_APP_DESCRIPTION ?? '',
  app_logo: process.env.NEXT_PUBLIC_APP_LOGO ?? '/highclaw.png',
  // 默认使用 HighClaw PNG，避免沿用模板 favicon.ico
  app_favicon: process.env.NEXT_PUBLIC_APP_FAVICON ?? '/highclaw.png',
  app_preview_image:
    process.env.NEXT_PUBLIC_APP_PREVIEW_IMAGE ?? '/preview.png',
  theme: process.env.NEXT_PUBLIC_THEME ?? 'default',
  appearance: process.env.NEXT_PUBLIC_APPEARANCE ?? 'dark',
  locale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE ?? 'en',
  database_url: process.env.DATABASE_URL ?? '',
  database_auth_token: process.env.DATABASE_AUTH_TOKEN ?? '',
  database_provider: process.env.DATABASE_PROVIDER ?? 'postgresql',
  db_schema_file: process.env.DB_SCHEMA_FILE ?? './src/config/db/schema.ts',
  // PostgreSQL schema name (e.g. 'web'). Default: 'public'
  db_schema: process.env.DB_SCHEMA ?? 'public',
  // Drizzle migrations journal table name (avoid conflicts across projects)
  db_migrations_table:
    process.env.DB_MIGRATIONS_TABLE ?? '__drizzle_migrations',
  // Drizzle migrations journal schema (default in drizzle-kit is 'drizzle')
  // We keep 'public' as template default for stability on fresh Supabase DBs.
  db_migrations_schema: process.env.DB_MIGRATIONS_SCHEMA ?? 'drizzle',
  // Output folder for drizzle-kit generated migrations
  db_migrations_out:
    process.env.DB_MIGRATIONS_OUT ?? './src/config/db/migrations',
  db_singleton_enabled: process.env.DB_SINGLETON_ENABLED || 'false',
  db_max_connections: process.env.DB_MAX_CONNECTIONS || '1',
  auth_url: process.env.AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || '',
  auth_secret: process.env.AUTH_SECRET ?? '', // openssl rand -base64 32
  /**
   * 与后台「认证」设置中的开关同名；写入 env 后会被 getAllConfigs 合并进公开配置，
   * 登录弹窗 /api/config/get-configs 才能显示 Google、GitHub 按钮（仍需配置 client id/secret 且服务端启用对应 Provider）。
   */
  google_auth_enabled: process.env.GOOGLE_AUTH_ENABLED ?? '',
  github_auth_enabled: process.env.GITHUB_AUTH_ENABLED ?? '',
  version: packageJson.version,
  locale_detect_enabled:
    process.env.NEXT_PUBLIC_LOCALE_DETECT_ENABLED ?? 'false',
};
