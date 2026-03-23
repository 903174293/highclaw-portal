import { NextResponse } from 'next/server';

import { getTutorialByPath } from '@/shared/models/tutorial';

/**
 * 公开：按路径获取单篇教程（含 Markdown 正文）。
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'en';
  const pathParam = searchParams.get('path') || '';
  if (!pathParam) {
    return NextResponse.json({ code: 1, message: 'path required' }, { status: 400 });
  }
  const doc = await getTutorialByPath(locale, pathParam);
  if (!doc) {
    return NextResponse.json({ code: 1, message: 'not found' }, { status: 404 });
  }
  return NextResponse.json({ code: 0, data: doc });
}
