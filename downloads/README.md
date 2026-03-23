# 安装包目录

将已构建的安装包**按文件名**放在此目录下（与 `src/shared/constants/downloads.ts` 中列表一致），例如：

- `highclaw-darwin-arm64.tar.gz`
- `highclaw-linux-amd64.tar.gz`
- …

登录用户通过 `/download` 页面点击下载时，会请求 `/api/downloads/<filename>`，服务端校验登录后从此目录读取文件。

大文件勿提交 Git（见根目录 `.gitignore`）。
