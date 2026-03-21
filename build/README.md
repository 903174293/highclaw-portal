# 构建与部署脚本（仅脚本目录）

## 目录约定

| 位置 | 内容 |
|------|------|
| **`build/`** | 脚本与说明（**可提交**） |
| **`deploy/`** | `deploy/highclaw-portal/` 中间目录 + `deploy/highclaw-portal.tar.gz`（**git 忽略**） |

---

## 第一件事：本地开发（仅此脚本，与服务器无关）

**脚本：`build/local-dev.sh`**

```bash
make start          # 前台 pnpm dev
make start-bg       # 后台（nohup + .local-dev.pid）
make stop

# 或脚本 / pnpm
./build/local-dev.sh start
./build/local-dev.sh stop
pnpm run local:start
pnpm run local:stop
```

后台（脚本方式）：`BACKGROUND=1 ./build/local-dev.sh start`

与 **打包、服务器、Nginx、PM2** 无关。

---

## 第二件事：服务器上线（仅此脚本，与本地 dev 无关）

**脚本：`build/server-deploy.sh`**（在服务器上用 **root/sudo** 执行）

**说明稍多时在 [`SERVER-DEPLOY.md`](./SERVER-DEPLOY.md)。** 打包容器会带上 `package.json` 与 `pnpm-lock.yaml`，部署时如有 pnpm 会尝试 `pnpm install --prod --ignore-scripts`（失败只告警，不中断）。

上传 `highclaw-portal.tar.gz` 与仓库里的 **`build/server-deploy.sh`**。

**推荐**：先 `cd` 到 **tar.gz 所在目录** 再执行（可无参数，默认使用当前目录下的 `highclaw-portal.tar.gz`）：

```bash
cd /tmp   # 或你放包的目录
sudo bash /path/to/repo/build/server-deploy.sh
# 或显式指定文件：
sudo bash /path/to/repo/build/server-deploy.sh ./highclaw-portal.tar.gz
```

**模式（自动）**

| 模式 | 判定 | 行为概要 |
|------|------|----------|
| **首次** | 不存在 `$TARGET_DIR/server.js` | 解压、PM2、**创建** `/etc/nginx/sites-available`（若缺）、写入站点（`upstream highclaw_portal_app`，避免与站内其它 `next_app` 冲突）、`nginx -t`、启动或 reload；未装 Nginx 会 **退出并附安装说明** |
| **更新** | 已存在上述文件 | 解压、**仅 PM2 重启**；**不重写**已有 Nginx、**不 reload**（除非 `FORCE_NGINX=1`） |

**首次 Nginx：交互定制（有终端时）**

- 会依次询问：`server_name`（空格分隔域名/IP）、Nginx 监听端口、Node/PM2 端口；直接回车沿用方括号内默认值（`server_name` 默认 `_`）。
- **已 export `SERVER_NAMES`** 再执行：不再询问域名与端口，适合无人值守与同机重复部署。
- **无 TTY**（如 CI）：须 `DEPLOY_NON_INTERACTIVE=1` 且必须设置 `SERVER_NAMES`（不能仅为 `_`），可同时设 `LISTEN_PORT`、`PORT`。

**常用环境变量**

- `FORCE_NGINX=1`：更新时也重写 Nginx 并 reload  
- `SKIP_NGINX=1`：全程不碰 Nginx（仅应用）  
- `SKIP_PM2=1`：只解压  
- `DEPLOY_MODE=first|update`：手动指定模式（一般不用）  
- `DEPLOY_NON_INTERACTIVE=1`：跳过交互（须带 `SERVER_NAMES`）  
- `SERVER_NAMES`、`LISTEN_PORT`、`PORT`、`TARGET_DIR` 等见脚本头部注释  

```bash
export SERVER_NAMES="highclaw.ai www.highclaw.ai 38.92.15.241"
export LISTEN_PORT=8080
sudo -E bash /path/to/repo/build/server-deploy.sh
```

`REMOVE_DEFAULT_SITE=1`：仅在**首次**或 **`FORCE_NGINX=1` 的更新**时尝试删除 `sites-enabled/default`。

HTTPS 需自行 certbot / CDN；脚本只生成 HTTP 反代片段。

---

## 第三件事：本地打发布包（与上两件独立）

**脚本：`build/package.sh`** + **Makefile**（见 `make help`）

```bash
make ship
# 产物：deploy/highclaw-portal.tar.gz
```

---

## 检查清单（服务器）

1. `/var/www/highclaw-portal/.env.production`  
2. 防火墙放行 `LISTEN_PORT`  
3. `curl -sI http://127.0.0.1:8080/`（端口按实际）
