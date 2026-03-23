'use client';

import { usePathname } from '@/core/i18n/navigation';

import { SignModal } from './sign-modal';

/**
 * 全局挂载登录弹窗，避免仅依赖 Header 内 SignUser 时（会话检测中未渲染 SignModal）
 * 导致其它页面「点登录/下载」无法弹出对话框。
 */
export function GlobalSignModal() {
  const pathname = usePathname() || '/';
  return <SignModal callbackUrl={pathname} />;
}
