'use client';

import { useState } from 'react';

import { envConfigs } from '@/config';
import { Brand as BrandType } from '@/shared/types/blocks/common';

/**
 * 页脚版权年份：首屏 SSR 与客户端首次渲染使用同一年，避免 hydration 文本不一致（不再用占位 2024 + effect 覆盖）。
 */
export function Copyright({ brand }: { brand: BrandType }) {
  const [currentYear] = useState(() => new Date().getFullYear());

  return (
    <div className={`text-muted-foreground text-sm`}>
      © {currentYear}{' '}
      <a
        href={brand?.url || envConfigs.app_url}
        target={brand?.target || ''}
        className="text-primary hover:text-primary/80 cursor-pointer"
      >
        {brand?.title || envConfigs.app_name}
      </a>
      , All rights reserved
    </div>
  );
}
