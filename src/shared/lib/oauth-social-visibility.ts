/**
 * 与 `getSocialProviders`（服务端）对齐：仅当存在 clientId 时 Better Auth 才会注册对应社交登录。
 * 前端若只根据 `*_auth_enabled` 显示按钮，会在点击时报「Provider not found」。
 */

/** 非空字符串（去首尾空白） */
function hasClientId(raw: string | undefined): boolean {
  return Boolean(raw?.trim());
}

/**
 * 是否展示 Google 社交登录入口（开关开启且能拿到 client id）。
 */
export function canUseGoogleSocial(configs: Record<string, string>): boolean {
  return configs.google_auth_enabled === 'true' && hasClientId(configs.google_client_id);
}

/**
 * 是否展示 GitHub 社交登录入口（开关开启且能拿到 client id）。
 */
export function canUseGithubSocial(configs: Record<string, string>): boolean {
  return configs.github_auth_enabled === 'true' && hasClientId(configs.github_client_id);
}
