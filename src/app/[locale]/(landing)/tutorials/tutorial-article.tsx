import type { TutorialDocRow } from '@/shared/models/tutorial';
import { extractMarkdownToc } from '@/shared/lib/markdown-toc';
import { TutorialMarkdownBody } from '@/themes/default/blocks/tutorial-markdown-body';

interface TutorialArticleProps {
  doc: TutorialDocRow;
}

/**
 * 单篇教程：标题 + 描述 + 正文 + 桌面端右侧本页目录。
 */
export function TutorialArticle({ doc }: TutorialArticleProps) {
  const toc = extractMarkdownToc(doc.contentMd);

  return (
    <article className="flex-1 grid gap-8 lg:grid-cols-[1fr_minmax(0,220px)] xl:grid-cols-[1fr_minmax(0,260px)]">
      <div className="min-w-0">
        <h1 className="text-3xl font-bold tracking-tight text-[#f8fafc] mb-2">{doc.title}</h1>
        {doc.description ? (
          <p className="text-[#94a3b8] mb-8 text-lg">{doc.description}</p>
        ) : null}
        <TutorialMarkdownBody markdown={doc.contentMd} />
      </div>
      {toc.length > 0 ? (
        <nav
          aria-label="本页目录"
          className="hidden lg:block text-sm text-[#94a3b8] sticky top-24 self-start max-h-[calc(100vh-8rem)] overflow-y-auto"
        >
          <p className="font-semibold text-[#f8fafc] mb-3">On this page</p>
          <ul className="space-y-2 border-l border-[#334155] pl-3">
            {toc.map((t) => (
              <li
                key={`${t.id}-${t.text}`}
                style={{ paddingLeft: Math.max(0, t.level - 1) * 10 }}
              >
                <a href={`#${t.id}`} className="hover:text-[#3b82f6] transition-colors">
                  {t.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </article>
  );
}
