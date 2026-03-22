# server-deploy.sh 使用手册

用 root/sudo 在生产机执行，部署 `highclaw-portal.tar.gz`。区分**首次**与**更新**。

---

## 快速使用

```bash
# 交互首次（会问域名/端口）
cd /tmp
sudo bash /path/to/build/server-deploy.sh

# 全自动（CI/脚本）
sudo DEPLOY_NON_INTERACTIVE=1 SERVER_NAMES="highclaw.ai 38.92.15.241" \
  LISTEN_PORT=8080 PORT=3000 bash /path/to/build/server-deploy.sh
```

## 手动部署（不用脚本）

```bash
cd /var/www/highclaw-portal
tar -xzf /tmp/highclaw-portal.tar.gz --strip-components=1
export NODE_ENV=production
export HOSTNAME=0.0.0.0
export PORT=3000
pm2 start server.js --name highclaw-portal
pm2 save && pm2 startup
```

---

## 前置条件

1. `highclaw-portal.tar.gz`（`make ship` / `make release` 产物）
2. root 或 sudo
3. 首次需 **nginx**（或 `SKIP_NGINX=1` 跳过）
4. **PM2**（推荐）：`npm i -g pm2`

---

## 模式

| 模式 | 判定 | 行为 |
|------|------|------|
| **首次** | 不存在 `$TARGET_DIR/server.js` | 解压 → PM2 → 创建 Nginx 站点 → reload |
| **更新** | 已存在 | 解压 → PM2 重启；不改 Nginx（除非 `FORCE_NGINX=1`） |

---

## 环境变量

| 变量 | 默认 | 说明 |
|------|------|------|
| `TARGET_DIR` | `/var/www/highclaw-portal` | 解压目录 |
| `PM2_NAME` | `highclaw-portal` | PM2 进程名 |
| `PORT` | `3000` | Node 监听端口 |
| `LISTEN_PORT` | `8080` | Nginx 监听端口 |
| `SERVER_NAMES` | 首次交互询问 | Nginx `server_name` |
| `SKIP_NGINX` | `0` | `1` = 不碰 Nginx |
| `SKIP_PM2` | `0` | `1` = 只解压 |
| `FORCE_NGINX` | `0` | `1` = 更新时也重写 Nginx |
| `DEPLOY_NON_INTERACTIVE` | `0` | `1` = 无交互（须带 `SERVER_NAMES`） |

---

## 常见问题

| 现象 | 处理 |
|------|------|
| `Cannot find module` | `make release` 重打 tar（webpack 构建 + `rsync -a` 保留 pnpm 软链） |
| `curl 127.0.0.1:3000` 拒绝 | 看 `pm2 logs highclaw-portal --err`；确认 `export NODE_ENV/HOSTNAME/PORT` 后 `pm2 start` |
| `DATABASE_URL is not set` | 在 `.env.production` 配好后 `pm2 restart highclaw-portal --update-env` |
| 登录没有 Google/GitHub | 解压目录下需有 `.env.production`（可从包内 `.env.production.example` 复制），设 `GOOGLE_AUTH_ENABLED=true` 等并填 `GOOGLE_CLIENT_*` / `GITHUB_CLIENT_*`；**或**在后台 Auth 开启并保存。改完后 `pm2 restart highclaw-portal --update-env` |
| `duplicate upstream` | 删掉 `sites-enabled` 下重复配置，或 `FORCE_NGINX=1` 重跑 |
