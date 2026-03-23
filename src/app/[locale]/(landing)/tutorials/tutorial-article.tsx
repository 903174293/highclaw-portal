'use client';

import type { TutorialDocRow } from '@/shared/models/tutorial';
import { extractMarkdownToc } from '@/shared/lib/markdown-toc';
import { TutorialMarkdownBody } from '@/themes/default/blocks/tutorial-markdown-body';

interface TutorialArticleProps {
  doc: TutorialDocRow;
}

/**
 * 单篇教程：排版样式与 /docs 完全一致（fumadocs prose 类）。
 */
export function TutorialArticle({ doc }: TutorialArticleProps) {
  const toc = extractMarkdownToc(doc.contentMd);

  return (
    <div className="flex w-full gap-8">
      {/* 正文区 — 与 DocsBody 一致使用 prose flex-1 */}
      <article className="flex min-w-0 flex-1 flex-col">
        <h1 className="text-3xl font-semibold">{doc.title}</h1>
        {doc.description ? (
          <p className="mb-8 mt-2 text-lg text-fd-muted-foreground">{doc.description}</p>
        ) : null}
        <div className="prose flex-1">
          <TutorialMarkdownBody markdown={doc.contentMd} />
        </div>
      </article>

      {/* 右侧目录 — 与 DocsPage tableOfContent clerk 风格对齐 */}
      {toc.length > 0 ? (
        <div className="hidden xl:block w-[220px] shrink-0">
          <nav
            aria-label="On this page"
            className="sticky top-24 text-sm max-h-[calc(100vh-8rem)] overflow-y-auto"
          >
            <h3 className="mb-2 text-sm font-medium text-fd-foreground">
              On this page
            </h3>
            <div className="flex flex-col border-s border-fd-foreground/10">
              {toc.map((t) => (
                <a
                  key={`${t.id}-${t.text}`}
                  href={`#${t.id}`}
                  className="py-1.5 text-sm text-fd-muted-foreground transition-colors hover:text-fd-primary [overflow-wrap:anywhere]"
                  style={{
                    paddingLeft: t.level <= 2 ? 12 : t.level === 3 ? 24 : 32,
                  }}
                >
                  {t.text}
                </a>
              ))}
            </div>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
