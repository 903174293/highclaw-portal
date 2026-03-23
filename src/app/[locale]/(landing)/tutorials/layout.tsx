import { getLocale, getTranslations } from 'next-intl/server';

import { Link } from '@/core/i18n/navigation';
import { listTutorialDocs } from '@/shared/models/tutorial';

import { TutorialsDocsShell } from './tutorials-docs-shell';

/**
 * 教程区：左侧为文档目录，右侧为子页面内容（正文使用与 /docs 一致的 fumadocs 排版）。
 */
export default async function TutorialsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const t = await getTranslations('landing');
  const items = await listTutorialDocs(locale);

  return (
    <TutorialsDocsShell locale={locale}>
    <div className="container mx-auto px-4 md:px-8 pt-24 pb-10 md:pt-28 flex flex-col lg:flex-row gap-8 lg:gap-10 min-h-[70vh]">
      <aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-20 lg:self-start space-y-2 border-b lg:border-b-0 lg:border-r border-fd-border pb-6 lg:pb-0 lg:pr-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-fd-muted-foreground mb-2">
          {t('tutorials_layout.nav_title')}
        </p>
        {items.length === 0 ? (
          <p className="text-sm text-fd-muted-foreground">{t('tutorials_layout.empty')}</p>
        ) : (
          <nav className="flex flex-row lg:flex-col gap-2 lg:gap-0.5 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
            {items.map((item) => {
              const hrefPath = item.slugPath
                .split('/')
                .map((s) => encodeURIComponent(s))
                .join('/');
              return (
                <Link
                  key={item.id}
                  href={`/tutorials/${hrefPath}`}
                  className="text-sm whitespace-nowrap lg:whitespace-normal rounded-md px-2 py-2 text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground transition-colors"
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>
        )}
      </aside>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
    </TutorialsDocsShell>
  );
}
