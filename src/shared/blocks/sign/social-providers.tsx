'use client';

import { useLocale, useTranslations } from 'next-intl';
import { RiGithubFill, RiGoogleFill } from 'react-icons/ri';
import { toast } from 'sonner';

import { signIn } from '@/core/auth/client';
import { useRouter } from '@/core/i18n/navigation';
import { defaultLocale } from '@/config/locale';
import { Button } from '@/shared/components/ui/button';
import { useAppContext } from '@/shared/contexts/app';
import {
  canUseGithubSocial,
  canUseGoogleSocial,
} from '@/shared/lib/oauth-social-visibility';
import { cn } from '@/shared/lib/utils';
import { Button as ButtonType } from '@/shared/types/blocks/common';

export function SocialProviders({
  configs,
  callbackUrl,
  loading,
  setLoading,
}: {
  configs: Record<string, string>;
  callbackUrl: string;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}) {
  const t = useTranslations('common.sign');
  const router = useRouter();

  const { setIsShowSignModal } = useAppContext();

  if (callbackUrl) {
    const locale = useLocale();
    if (
      locale !== defaultLocale &&
      callbackUrl.startsWith('/') &&
      !callbackUrl.startsWith(`/${locale}`)
    ) {
      callbackUrl = `/${locale}${callbackUrl}`;
    }
  }

  /**
   * 发起 OAuth：成功时通常会整页跳转到 IdP，失败时恢复按钮可点并提示原因。
   */
  const handleSignIn = async ({ provider }: { provider: string }) => {
    try {
      await signIn.social(
        {
          provider: provider,
          callbackURL: callbackUrl,
        },
        {
          onRequest: () => {
            setLoading(true);
          },
          onResponse: () => {
            // 跳转进行中，勿在此处 setLoading(false)
          },
          onSuccess: () => {
            setIsShowSignModal(false);
          },
          onError: (e: any) => {
            const raw = String(e?.error?.message || e?.message || '');
            if (/provider not found/i.test(raw)) {
              toast.error(
                '该第三方登录未在服务端完整配置（需 Client ID 与 Secret）。请使用邮箱登录或检查后台 Auth 设置。'
              );
            } else {
              toast.error(raw || 'sign in failed');
            }
            setLoading(false);
          },
        }
      );
    } catch (e: any) {
      toast.error(e?.message || 'sign in failed');
      setLoading(false);
    }
  };

  const providers: ButtonType[] = [];

  if (canUseGoogleSocial(configs)) {
    providers.push({
      name: 'google',
      title: t('google_sign_in_title'),
      icon: <RiGoogleFill />,
      onClick: () => handleSignIn({ provider: 'google' }),
    });
  }

  if (canUseGithubSocial(configs)) {
    providers.push({
      name: 'github',
      title: t('github_sign_in_title'),
      icon: <RiGithubFill />,
      onClick: () => handleSignIn({ provider: 'github' }),
    });
  }

  return (
    <div
      className={cn(
        'flex w-full items-center gap-2',
        'flex-col justify-between'
      )}
    >
      {providers.map((provider) => (
        <Button
          key={provider.name}
          type="button"
          variant="outline"
          className={cn('w-full gap-2')}
          disabled={loading}
          onClick={provider.onClick}
        >
          {provider.icon}
          <h3>{provider.title}</h3>
        </Button>
      ))}
    </div>
  );
}
