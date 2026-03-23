import { NextResponse } from 'next/server';

import { listTutorialDocs } from '@/shared/models/tutorial';

/**
 * 公开：当前语言下的教程列表（不含正文，供侧栏）。
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'en';
  const rows = await listTutorialDocs(locale);
  const data = rows.map(({ id, locale: loc, slugPath, title, description, sortOrder }) => ({
    id,
    locale: loc,
    slugPath,
    title,
    description,
    sortOrder,
  }));
  return NextResponse.json({ code: 0, data });
}
