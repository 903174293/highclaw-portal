import { getTranslations } from 'next-intl/server';

import { envConfigs } from '@/config';
import { defaultLocale } from '@/config/locale';
import { Link } from '@/core/i18n/navigation';
import { getAuthErrorHintZh } from '@/shared/lib/auth-error-hints';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';

type Search = { error?: string; error_description?: string };

/**
 * Better Auth 出错时的落地页（通过 onAPIError.errorURL 跳转），展示错误码与处理建议。
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('common.auth_error');

  return {
    title: `${t('page_title')} - ${envConfigs.app_name}`,
    alternates: {
      canonical:
        locale !== defaultLocale
          ? `${envConfigs.app_url}/${locale}/auth-error`
          : `${envConfigs.app_url}/auth-error`,
    },
  };
}

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const { error, error_description } = await searchParams;
  const codeRaw = (error || '').trim();
  const displayCode = codeRaw || 'unknown';
  const t = await getTranslations('common.auth_error');
  const hintZh = codeRaw ? getAuthErrorHintZh(codeRaw) : null;

  return (
    <div className="mx-auto w-full max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>{t('page_title')}</CardTitle>
          <CardDescription>{t('page_description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <p className="text-muted-foreground mb-1 font-medium">
              {t('code_label')}
            </p>
            <code className="rounded bg-muted px-2 py-1 text-xs break-all">
              {displayCode}
            </code>
          </div>
          {error_description ? (
            <div>
              <p className="text-muted-foreground mb-1 font-medium">
                {t('detail_label')}
              </p>
              <p className="text-xs break-all text-foreground/80">
                {error_description}
              </p>
            </div>
          ) : null}
          <div>
            <p className="text-muted-foreground mb-1 font-medium">
              {t('hint_title')}
            </p>
            <p className="text-foreground/90 leading-relaxed">
              {hintZh ?? t('hint_default')}
            </p>
          </div>
          {process.env.NODE_ENV === 'development' ? (
            <p className="text-xs text-amber-600 dark:text-amber-500 border border-amber-500/30 rounded-md p-2">
              {t('dev_tip')}
            </p>
          ) : null}
        </CardContent>
        <CardFooter className="flex flex-col gap-2 sm:flex-row">
          <Button asChild className="w-full sm:w-auto">
            <Link href="/sign-in">{t('back_sign_in')}</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
