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
 * - 排版依赖外层 `prose` 类（fumadocs style.css）
 * - pre 块单独处理：加圆角/背景/边框，内部 code 重置行内样式避免冲突
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
    /*
     * pre 块：prose 类不覆盖 pre，这里手动给卡片样式，与 /docs 代码块风格接近。
     * not-prose 阻止 prose 给 pre>code 施加行内 code 的边框/背景。
     */
    pre: ({ children, ...props }) => (
      <pre
        {...props}
        className="not-prose rounded-lg border border-fd-border bg-fd-card px-4 py-4 text-sm overflow-x-auto my-5"
      >
        {children}
      </pre>
    ),
    code: ({ className, children, ...props }) => {
      const isBlock = className?.startsWith('language-');
      if (isBlock) {
        // 代码块内的 code：不加行内样式
        return (
          <code className={className} {...props}>
            {children}
          </code>
        );
      }
      // 行内 code：继承 prose 原生样式（border/bg/rounded）
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {markdown}
    </ReactMarkdown>
  );
}
