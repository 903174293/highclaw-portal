import { readFile } from 'fs/promises';
import path from 'path';

import { getUserInfo } from '@/shared/models/user';
import {
  type PlatformKey,
  PLATFORM_KEYS,
  resolveDownloadFile,
  isSafeRelativePath,
} from '@/shared/constants/downloads';

/**
 * 已登录用户下载安装包。
 * 请求路径为 platformKey（如 darwin-arm64）或完整相对路径（如 release/highclaw-xxx-darwin-arm64.tar.gz）。
 * 自动在 downloads/ 目录及子目录中按 os-arch 模式匹配实际文件。
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ filename: string }> }
) {
  try {
    const user = await getUserInfo();
    if (!user) {
      return new Response(JSON.stringify({ error: '请先登录后再下载' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { filename } = await context.params;
    const decoded = decodeURIComponent(filename);
    const root = path.resolve(process.cwd(), 'downloads');

    let relativePath: string | null = null;

    if ((PLATFORM_KEYS as readonly string[]).includes(decoded)) {
      relativePath = resolveDownloadFile(decoded as PlatformKey);
    } else if (isSafeRelativePath(decoded)) {
      relativePath = decoded;
    }

    if (!relativePath) {
      return new Response(
        JSON.stringify({ error: '未找到对应平台的安装包' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const filePath = path.resolve(root, relativePath);
    const rel = path.relative(root, filePath);
    if (rel.startsWith('..') || path.isAbsolute(rel)) {
      return new Response('Bad request', { status: 400 });
    }

    const buf = await readFile(filePath);
    const basename = path.basename(filePath);

    return new Response(new Uint8Array(buf), {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${basename}"`,
      },
    });
  } catch (e: unknown) {
    const code = (e as NodeJS.ErrnoException)?.code;
    if (code === 'ENOENT') {
      return new Response(
        JSON.stringify({
          error: '文件尚未上架，请将构建产物放到 downloads/ 目录下',
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    console.error('download route error', e);
    return new Response('Internal error', { status: 500 });
  }
}
