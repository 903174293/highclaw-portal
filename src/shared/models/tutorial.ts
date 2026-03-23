import { and, asc, eq } from 'drizzle-orm';

import { db } from '@/core/db';
import { tutorialDoc } from '@/config/db/schema';
import { getUuid } from '@/shared/lib/hash';

export type TutorialDocRow = typeof tutorialDoc.$inferSelect;
export type NewTutorialDoc = typeof tutorialDoc.$inferInsert;

/**
 * 按语言列出教程（用于侧栏），按 sortOrder、路径排序。
 */
export async function listTutorialDocs(locale: string): Promise<TutorialDocRow[]> {
  if (!process.env.DATABASE_URL) return [];
  return db()
    .select()
    .from(tutorialDoc)
    .where(eq(tutorialDoc.locale, locale))
    .orderBy(asc(tutorialDoc.sortOrder), asc(tutorialDoc.slugPath));
}

/**
 * 按 locale + slugPath（如 install/macos）取一篇。
 */
export async function getTutorialByPath(
  locale: string,
  slugPath: string
): Promise<TutorialDocRow | null> {
  if (!process.env.DATABASE_URL) return null;
  const [row] = await db()
    .select()
    .from(tutorialDoc)
    .where(
      and(eq(tutorialDoc.locale, locale), eq(tutorialDoc.slugPath, slugPath))
    );
  return row ?? null;
}

export async function getTutorialById(id: string): Promise<TutorialDocRow | null> {
  if (!process.env.DATABASE_URL) return null;
  const [row] = await db()
    .select()
    .from(tutorialDoc)
    .where(eq(tutorialDoc.id, id));
  return row ?? null;
}

export async function listAllTutorialDocs(): Promise<TutorialDocRow[]> {
  if (!process.env.DATABASE_URL) return [];
  return db()
    .select()
    .from(tutorialDoc)
    .orderBy(asc(tutorialDoc.locale), asc(tutorialDoc.sortOrder), asc(tutorialDoc.slugPath));
}

/**
 * 新建教程文档。
 */
export async function createTutorialDoc(input: {
  locale: string;
  slugPath: string;
  title: string;
  description?: string;
  contentMd: string;
  sortOrder?: number;
}): Promise<TutorialDocRow> {
  const id = getUuid();
  const [row] = await db()
    .insert(tutorialDoc)
    .values({
      id,
      locale: input.locale,
      slugPath: normalizeSlugPath(input.slugPath),
      title: input.title,
      description: input.description ?? '',
      contentMd: input.contentMd,
      sortOrder: input.sortOrder ?? 0,
    })
    .returning();
  return row;
}

/**
 * 更新教程文档。
 */
export async function updateTutorialDoc(
  id: string,
  patch: Partial<{
    locale: string;
    slugPath: string;
    title: string;
    description: string;
    contentMd: string;
    sortOrder: number;
  }>
): Promise<TutorialDocRow | null> {
  const next: Record<string, unknown> = {};
  if (patch.locale !== undefined) next.locale = patch.locale;
  if (patch.title !== undefined) next.title = patch.title;
  if (patch.description !== undefined) next.description = patch.description;
  if (patch.contentMd !== undefined) next.contentMd = patch.contentMd;
  if (patch.sortOrder !== undefined) next.sortOrder = patch.sortOrder;
  if (typeof patch.slugPath === 'string') {
    next.slugPath = normalizeSlugPath(patch.slugPath);
  }
  if (Object.keys(next).length === 0) {
    return getTutorialById(id);
  }
  const [row] = await db()
    .update(tutorialDoc)
    .set(next as Record<string, never>)
    .where(eq(tutorialDoc.id, id))
    .returning();
  return row ?? null;
}

export async function deleteTutorialDoc(id: string): Promise<void> {
  await db().delete(tutorialDoc).where(eq(tutorialDoc.id, id));
}

/**
 * 规范化路径：去掉首尾 /，仅允许安全字符。
 */
export function normalizeSlugPath(raw: string): string {
  const t = raw.trim().replace(/^\/+|\/+$/g, '');
  if (!/^[a-zA-Z0-9][a-zA-Z0-9/_-]*$/.test(t) || t.includes('//')) {
    throw new Error('Invalid slug path');
  }
  return t;
}
