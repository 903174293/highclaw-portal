import type { ReactNode } from 'react';
import type { Translations } from 'fumadocs-ui/i18n';
import { RootProvider } from 'fumadocs-ui/provider';

import '@/config/style/docs.css';

const locales = [
  { name: 'English', locale: 'en' },
  { name: '简体中文', locale: 'zh' },
];

const zh: Partial<Translations> = {
  search: '搜索内容',
  toc: '本页目录',
  tocNoHeadings: '暂无标题',
};

interface TutorialsDocsShellProps {
  /** next-intl 当前语言 */
  locale: string;
  children: ReactNode;
}

/**
 * 为教程区提供与 /docs 相同的 fumadocs 主题变量与排版上下文（RootProvider）。
 * 不挂载 DocsLayout，避免与教程左侧自建目录重复。
 */
export function TutorialsDocsShell({ locale, children }: TutorialsDocsShellProps) {
  const lang = locale || 'en';
  return (
    <RootProvider
      /**
       * 教程区不需要 fumadocs 全局搜索；若不显式关闭，会挂载 DefaultSearchDialog
       * 且 api 为空，useDocsSearch 在部分环境下会报错导致页面 500。
       */
      search={{ enabled: false }}
      i18n={{
        locale: lang,
        locales,
        translations: lang === 'zh' ? zh : undefined,
      }}
    >
      {children}
    </RootProvider>
  );
}
