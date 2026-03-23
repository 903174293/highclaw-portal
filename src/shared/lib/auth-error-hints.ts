/**
 * Better Auth 在 query 里返回的 error 码（部分）及对应说明。
 * @see better-auth OAuth callback / parseState
 */
const HINTS_ZH: Record<string, string> = {
  please_restart_the_process:
    'OAuth 临时状态丢失或解密失败。请检查：① 是否用 http 访问但跑了 NODE_ENV=production（如 pnpm start）—此时若 Cookie 带 Secure 标记，浏览器不会保存 state，可设 AUTH_COOKIE_SECURE=false 或改用 https；② 不要混用 localhost 与 127.0.0.1；③ AUTH_SECRET 是否在登录中途改过；④ 清除本站 Cookie / 无痕重试。',
  state_mismatch:
    'OAuth 状态校验失败（Cookie 未带上或被拦截）。请关闭广告/隐私插件对本站 Cookie 的限制后重试。',
  invalid_callback_request: '回调请求参数无效，请从登录页重新发起第三方登录。',
  no_code: '授权方未返回授权码，请重试或更换浏览器。',
  invalid_code: '授权码无效或已过期，请重新登录。',
  oauth_provider_not_found: '服务端未注册该第三方登录（检查 Client ID/Secret 与后台开关）。',
  unable_to_get_user_info: '无法从第三方获取用户信息，请检查 OAuth 应用权限范围。',
  no_callback_url: '登录回调地址缺失，请联系管理员检查配置。',
  email_not_found: '第三方账号未返回邮箱，无法完成注册/登录。',
};

/**
 * 根据 error 查询参数返回中文说明；未知码返回 null（由页面显示通用文案）。
 */
export function getAuthErrorHintZh(code: string | undefined): string | null {
  if (!code) return null;
  return HINTS_ZH[code] ?? null;
}
