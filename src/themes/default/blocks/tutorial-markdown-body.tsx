'use client';

import type { Components } from 'react-markdown';
import { useMemo, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { extractMarkdownToc } from '@/shared/lib/markdown-toc';

interface TutorialMarkdownBodyProps {
  /** Markdown 正文 */
  markdown: string;
}

/**
 * 渲染教程 Markdown，并为 h1–h3 注入与 extractMarkdownToc 一致的 id，便于右侧目录锚点跳转。
 */
export function TutorialMarkdownBody({ markdown }: TutorialMarkdownBodyProps) {
  const toc = useMemo(() => extractMarkdownToc(markdown), [markdown]);
  const idxRef = useRef(0);

  idxRef.current = 0;
  const components: Partial<Components> = {
    h1: ({ children, ...props }) => {
      const id = toc[idxRef.current]?.id ?? `h-${idxRef.current}`;
      idxRef.current++;
      return (
        <h1 className="scroll-mt-24" id={id} {...props}>
          {children}
        </h1>
      );
    },
    h2: ({ children, ...props }) => {
      const id = toc[idxRef.current]?.id ?? `h-${idxRef.current}`;
      idxRef.current++;
      return (
        <h2 className="scroll-mt-24" id={id} {...props}>
          {children}
        </h2>
      );
    },
    h3: ({ children, ...props }) => {
      const id = toc[idxRef.current]?.id ?? `h-${idxRef.current}`;
      idxRef.current++;
      return (
        <h3 className="scroll-mt-24" id={id} {...props}>
          {children}
        </h3>
      );
    },
  };

  return (
    <div className="prose prose-invert prose-lg max-w-none dark:prose-invert [&_pre]:rounded-lg [&_pre]:bg-[#0f172a] [&_pre]:p-4 [&_code]:text-sm [&_a]:text-[#3b82f6]">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
