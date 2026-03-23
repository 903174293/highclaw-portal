import { NextResponse } from 'next/server';

import { PERMISSIONS } from '@/core/rbac/permission';
import {
  deleteTutorialDoc,
  getTutorialById,
  updateTutorialDoc,
} from '@/shared/models/tutorial';
import { getUserInfo } from '@/shared/models/user';
import { hasPermission } from '@/shared/services/rbac';

/**
 * 管理端：单篇查询 / 更新 / 删除。
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const user = await getUserInfo();
  if (!user) {
    return NextResponse.json({ code: 401, message: 'unauthorized' }, { status: 401 });
  }
  if (!(await hasPermission(user.id, PERMISSIONS.TUTORIALS_READ))) {
    return NextResponse.json({ code: 403, message: 'forbidden' }, { status: 403 });
  }
  const { id } = await context.params;
  const row = await getTutorialById(id);
  if (!row) {
    return NextResponse.json({ code: 1, message: 'not found' }, { status: 404 });
  }
  return NextResponse.json({ code: 0, data: row });
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const user = await getUserInfo();
  if (!user) {
    return NextResponse.json({ code: 401, message: 'unauthorized' }, { status: 401 });
  }
  if (!(await hasPermission(user.id, PERMISSIONS.TUTORIALS_WRITE))) {
    return NextResponse.json({ code: 403, message: 'forbidden' }, { status: 403 });
  }
  const { id } = await context.params;
  const body = await request.json();
  try {
    const row = await updateTutorialDoc(id, body);
    if (!row) {
      return NextResponse.json({ code: 1, message: 'not found' }, { status: 404 });
    }
    return NextResponse.json({ code: 0, data: row });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'update failed';
    return NextResponse.json({ code: 1, message: msg }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const user = await getUserInfo();
  if (!user) {
    return NextResponse.json({ code: 401, message: 'unauthorized' }, { status: 401 });
  }
  if (!(await hasPermission(user.id, PERMISSIONS.TUTORIALS_DELETE))) {
    return NextResponse.json({ code: 403, message: 'forbidden' }, { status: 403 });
  }
  const { id } = await context.params;
  const existing = await getTutorialById(id);
  if (!existing) {
    return NextResponse.json({ code: 1, message: 'not found' }, { status: 404 });
  }
  await deleteTutorialDoc(id);
  return NextResponse.json({ code: 0, data: true });
}
