import { resolveAllDownloads } from '@/shared/constants/downloads';

/**
 * 返回各平台可用安装包信息（公开接口，不需登录）。
 */
export async function GET() {
  const mapping = resolveAllDownloads();
  return Response.json({ data: mapping });
}
