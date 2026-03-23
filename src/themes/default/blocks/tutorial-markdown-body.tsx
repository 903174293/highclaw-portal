'use client';

import type { Components } from 'react-markdown';
import { useMemo, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { extractMarkdownToc } from '@/shared/lib/markdown-toc';

interface TutorialMarkdownBodyProps {
  markdown: string;
}

/**
 * 渲染教程 Markdown，为 h1–h3 注入 id 便于目录锚点跳转。
 * 排版完全依赖外层 `prose` 类（fumadocs style.css），不再叠额外样式。
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
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {markdown}
    </ReactMarkdown>
  );
}
