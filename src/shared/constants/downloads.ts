import { readdirSync } from 'fs';
import path from 'path';

/**
 * 支持的 os-arch 组合及其在文件名中出现的标识串。
 * 实际文件可以带版本号/commit hash，只要包含 `{os}-{arch}` 即可匹配。
 */
export const PLATFORM_KEYS = [
  'darwin-arm64',
  'darwin-amd64',
  'windows-amd64',
  'windows-arm64',
  'linux-amd64',
  'linux-arm64',
] as const;

export type PlatformKey = (typeof PLATFORM_KEYS)[number];

/**
 * 在 downloads/ 及其子目录（如 release/）中，按 os-arch 模式匹配第一个命中的文件。
 * 返回相对于 downloads/ 的路径（例如 `release/highclaw-dc6ef1a-dirty-darwin-arm64.tar.gz`）。
 */
export function resolveDownloadFile(platformKey: PlatformKey): string | null {
  const root = path.resolve(process.cwd(), 'downloads');
  try {
    return findFileRecursive(root, root, platformKey);
  } catch {
    return null;
  }
}

function findFileRecursive(
  root: string,
  dir: string,
  pattern: string
): string | null {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const result = findFileRecursive(root, path.join(dir, entry.name), pattern);
      if (result) return result;
    } else if (entry.isFile() && entry.name.includes(pattern)) {
      return path.relative(root, path.join(dir, entry.name));
    }
  }
  return null;
}

/**
 * 返回所有平台的可用文件映射：{ "darwin-arm64": "release/highclaw-xxx-darwin-arm64.tar.gz", ... }
 * 找不到的平台值为 null。
 */
export function resolveAllDownloads(): Record<PlatformKey, string | null> {
  const result = {} as Record<PlatformKey, string | null>;
  for (const key of PLATFORM_KEYS) {
    result[key] = resolveDownloadFile(key);
  }
  return result;
}

/**
 * 校验请求的相对路径是否安全（不越界）。
 */
export function isSafeRelativePath(relativePath: string): boolean {
  if (!relativePath) return false;
  const normalized = path.normalize(relativePath);
  return !normalized.startsWith('..') && !path.isAbsolute(normalized);
}
