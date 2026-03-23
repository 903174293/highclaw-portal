import { NextResponse } from 'next/server';

import { PERMISSIONS } from '@/core/rbac/permission';
import {
  createTutorialDoc,
  listAllTutorialDocs,
  normalizeSlugPath,
} from '@/shared/models/tutorial';
import { getUserInfo } from '@/shared/models/user';
import { hasPermission } from '@/shared/services/rbac';

/**
 * 管理端：列出全部教程（含正文，仅管理员）。
 */
export async function GET() {
  try {
    const user = await getUserInfo();
    if (!user) {
      return NextResponse.json({ code: 401, message: 'unauthorized' }, { status: 401 });
    }
    const can =
      (await hasPermission(user.id, PERMISSIONS.TUTORIALS_READ)) ||
      (await hasPermission(user.id, PERMISSIONS.TUTORIALS_WRITE));
    if (!can) {
      return NextResponse.json({ code: 403, message: 'forbidden' }, { status: 403 });
    }
    const rows = await listAllTutorialDocs();
    return NextResponse.json({ code: 0, data: rows });
  } catch (e) {
    console.error('admin tutorials GET', e);
    return NextResponse.json({ code: 1, message: 'server error' }, { status: 500 });
  }
}

/**
 * 管理端：新建教程。
 */
export async function POST(request: Request) {
  try {
    const user = await getUserInfo();
    if (!user) {
      return NextResponse.json({ code: 401, message: 'unauthorized' }, { status: 401 });
    }
    if (!(await hasPermission(user.id, PERMISSIONS.TUTORIALS_WRITE))) {
      return NextResponse.json({ code: 403, message: 'forbidden' }, { status: 403 });
    }
    const body = await request.json();
    const {
      locale = 'en',
      slugPath,
      title,
      description = '',
      contentMd = '',
      sortOrder = 0,
    } = body;
    if (!slugPath || !title) {
      return NextResponse.json(
        { code: 1, message: 'slugPath and title required' },
        { status: 400 }
      );
    }
    normalizeSlugPath(String(slugPath));
    const row = await createTutorialDoc({
      locale: String(locale),
      slugPath: String(slugPath),
      title: String(title),
      description: String(description),
      contentMd: String(contentMd),
      sortOrder: Number(sortOrder) || 0,
    });
    return NextResponse.json({ code: 0, data: row });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'invalid body';
    return NextResponse.json({ code: 1, message: msg }, { status: 400 });
  }
}
