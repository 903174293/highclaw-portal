'use client';

import { useTranslations } from 'next-intl';

import { cn } from '@/shared/lib/utils';

/**
 * 社交登录与邮箱表单之间的分隔线（文案 i18n）
 * @param labelBgClass 与父容器背景一致，避免横线「穿过」文字（Card 内用 bg-card，弹层内可省略）
 */
export function SignMethodDivider({
  labelBgClassName,
}: {
  labelBgClassName?: string;
}) {
  const t = useTranslations('common.sign');

  return (
    <div className="relative my-4">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center text-xs">
        <span
          className={cn(
            'px-3 text-muted-foreground',
            labelBgClassName ?? 'bg-background'
          )}
        >
          {t('or_continue_email')}
        </span>
      </div>
    </div>
  );
}
