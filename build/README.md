# 构建与部署脚本

## 目录约定

| 位置 | 内容 |
|------|------|
| **`build/`** | 脚本与说明 |
| **`deploy/`** | 打包产物（git 忽略） |

---

## 本地开发

```bash
make start          # 前台 pnpm dev
make start-bg       # 后台
make stop
```

与打包、服务器无关。

---

## 打发布包

```bash
make release        # pnpm install + build:server(webpack) + 打包
make ship           # build:server + 打包（已有 node_modules 时）
make pack           # 仅打包（已有 .next 时）
```

产物：`deploy/highclaw-portal.tar.gz`

打包逻辑（`build/package.sh`）：
- 构建：`pnpm run build:server`（webpack，`outputFileTracingIncludes` 仅 webpack 生效）
- 复制：`rsync -a`（保留 pnpm 软链，Node.js require 靠它定位 peer deps）
- 服务器**不需要** `pnpm install`，standalone 已含所有运行依赖

---

## 服务器部署

### 方式一：手动（最简单）

```bash
cd /var/www/highclaw-portal
tar -xzf /tmp/highclaw-portal.tar.gz --strip-components=1
export NODE_ENV=production
export HOSTNAME=0.0.0.0
export PORT=3000
pm2 start server.js --name highclaw-portal
pm2 save && pm2 startup
```

### 方式二：脚本（含 Nginx 配置）

```bash
cd /tmp
sudo bash /path/to/build/server-deploy.sh
```

详见 [`SERVER-DEPLOY.md`](./SERVER-DEPLOY.md)。

---

## 检查清单

1. `/var/www/highclaw-portal/.env.production` 按需配置
2. 防火墙放行端口
3. `curl -sI http://127.0.0.1:3000/`
4. `pm2 status` / `pm2 logs highclaw-portal`
