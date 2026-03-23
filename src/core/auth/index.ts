import { betterAuth, BetterAuthOptions } from 'better-auth';

import { getAllConfigs } from '@/shared/models/config';

import { getAuthOptions } from './config';

/**
 * @param request 来自 `/api/auth/*` 时务必传入，使 OAuth baseURL 与浏览器 Host 一致
 */
export async function getAuth(request?: Request | null) {
  const configs = await getAllConfigs();
  const authOptions = await getAuthOptions(configs, request ?? null);
  return betterAuth(authOptions as BetterAuthOptions);
}
