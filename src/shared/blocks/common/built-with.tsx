import Image from 'next/image';
import Link from 'next/link';

import { envConfigs } from '@/config';
import { Button } from '@/shared/components/ui/button';

/**
 * 页脚「技术栈 / 品牌」角标：展示 HighClaw 标识（替换原 ShipAny 模板链接）
 */
export function BuiltWith() {
  return (
    <Button asChild variant="outline" size="sm" className="hover:bg-primary/10">
      <Link
        href="https://github.com/HighClawHub/highclaw"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2"
      >
        <Image
          src="/highclaw.png"
          alt=""
          width={18}
          height={18}
          className="size-[18px] rounded-sm"
        />
        <span className="text-xs">{envConfigs.app_name}</span>
      </Link>
    </Button>
  );
}
