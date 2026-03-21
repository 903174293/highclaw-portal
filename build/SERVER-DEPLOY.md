# server-deploy.sh 使用手册

面向 **生产机**：用 root/sudo 执行，部署 `highclaw-portal.tar.gz`（Next.js standalone 打包产物）。脚本区分 **首次安装** 与 **更新**，避免每次重复改 Nginx。

---

## 一、你问的两条命令分别是什么意思？

### 1. 交互首次（在放 tar 的目录）

```bash
sudo bash /path/to/build/server-deploy.sh
```

| 部分 | 含义 |
|------|------|
| `sudo` | 必须以 root 权限运行（写 `/var/www`、`/etc/nginx`、启 PM2 等）。 |
| `bash /path/to/build/server-deploy.sh` | 执行仓库里的部署脚本；`/path/to` 换成你机器上 **本仓库 `build/server-deploy.sh` 的真实路径**。 |
| **在放 tar 的目录** | 先 `cd` 到 `highclaw-portal.tar.gz` 所在目录再执行；**不传参数** 时，脚本默认使用 **当前目录下的 `./highclaw-portal.tar.gz`**。 |

**首次部署**且本机有交互终端（TTY）时：在解压、起 PM2、写 Nginx 之前，脚本会 **提问**（可回车用默认值）：

- `server_name`：空格分隔的域名和/或公网 IP（如 `highclaw.ai www.highclaw.ai 38.92.15.241`）；空则相当于 `_`（匹配任意 Host）。
- Nginx 对外监听端口（默认 `8080`）。
- Node/PM2 监听端口（默认 `3000`，与 Nginx `upstream highclaw_portal_app` 指向的后端一致）。

---

### 2. 全自动首次（不提问）

```bash
sudo DEPLOY_NON_INTERACTIVE=1 SERVER_NAMES="highclaw.ai www.highclaw.ai 38.92.15.241" \
  LISTEN_PORT=8080 PORT=3000 bash /path/to/build/server-deploy.sh
```

| 环境变量 | 含义 |
|----------|------|
| `DEPLOY_NON_INTERACTIVE=1` | **禁止交互**：不再从终端读域名/端口；适合 SSH 脚本、CI、或没有 TTY 的场景。 |
| `SERVER_NAMES="..."` | 写入 Nginx `server_name` 的值，**空格分隔**多个主机名/IP。**必填**（且不能仅为 `_`），否则脚本退出报错。 |
| `LISTEN_PORT=8080` | Nginx 监听的 HTTP 端口（浏览器/防火墙通常访问这个端口）。 |
| `PORT=3000` | 本机 Node（PM2）里 Next standalone 监听的端口；Nginx `upstream highclaw_portal_app` 会反代到 `127.0.0.1:该端口`。 |
| 行尾 `\` | Shell 换行续写，把多条「同一行前的赋值」和最后的 `bash ...` 当成一条命令执行。 |

**注意**：`sudo` 默认 **不继承** 你当前 shell 里 `export` 的变量。上面写法把变量写在 **`sudo` 同一行的前面**，会传给 `sudo` 启动的子进程；若你习惯先 `export`，请用：

```bash
export DEPLOY_NON_INTERACTIVE=1
export SERVER_NAMES="highclaw.ai www.highclaw.ai 38.92.15.241"
export LISTEN_PORT=8080
export PORT=3000
sudo -E bash /path/to/build/server-deploy.sh
```

`-E` 表示保留当前用户已 export 的环境变量。

---

## 二、前置条件

1. **压缩包**：`highclaw-portal.tar.gz`，且解压后存在 **`highclaw-portal/server.js`**（与 `package.sh` / `make ship` 产物一致）。
2. **权限**：`root` 或 `sudo`。
3. **首次 + 要写 Nginx**：本机需已安装 **nginx**；未安装时脚本会打印 apt/dnf 安装提示并退出（可用 `SKIP_NGINX=1` 仅部署应用）。
4. **PM2**（可选但推荐）：`npm i -g pm2`；没有 PM2 时脚本只解压并提示用手动 `node server.js` 启动。

---

## 三、包路径怎么指定？

1. **推荐**：`cd` 到 tar 所在目录，执行  
   `sudo bash .../build/server-deploy.sh`  
   → 自动使用 `./highclaw-portal.tar.gz`。
2. **显式路径**：  
   `sudo bash .../build/server-deploy.sh /opt/dist/highclaw-portal.tar.gz`  
   相对路径相对于 **当前工作目录**。

---

## 四、模式：首次 vs 更新（自动）

| 模式 | 判定 |
|------|------|
| **首次** | 部署前不存在 `$TARGET_DIR/server.js`（默认 `TARGET_DIR=/var/www/highclaw-portal`）。 |
| **更新** | 已存在该 `server.js`。 |

| 模式 | 脚本主要行为 |
|------|----------------|
| **首次** | 备份旧目录（若有）→ 解压 → PM2 启/重启 → **创建/写入** Nginx 站点 → `nginx -t` → `reload` 或 `start`。 |
| **更新** | 备份 → 解压 → **仅 PM2 重启**；若已有站点文件与 `sites-enabled` 链接，**默认不重写 Nginx、不 reload**。 |

可用 `DEPLOY_MODE=first` 或 `DEPLOY_MODE=update` **强制**模式（一般不必）。

---

## 五、环境变量一览

| 变量 | 默认 | 说明 |
|------|------|------|
| `TARGET_DIR` | `/var/www/highclaw-portal` | 应用解压目录。 |
| `PM2_NAME` | `highclaw-portal` | PM2 进程名。 |
| `PORT` | `3000` | Node 监听端口（`upstream highclaw_portal_app` 指向 `127.0.0.1:PORT`）。 |
| `LISTEN_PORT` | `8080` | Nginx 监听端口。 |
| `SERVER_NAMES` | 未设则首次交互询问；空则 `_` | Nginx `server_name`，空格分隔。 |
| `NGINX_SITE` | `/etc/nginx/sites-available/highclaw-portal` | 站点配置文件路径。 |
| `NGINX_ENABLED` | `/etc/nginx/sites-enabled/highclaw-portal` | `sites-enabled` 下软链路径。 |
| `SKIP_NGINX` | `0` | `1` = 完全不写 Nginx。 |
| `SKIP_PM2` | `0` | `1` = 只解压，不启 PM2。 |
| `FORCE_NGINX` | `0` | `1` = **更新** 时也重写 Nginx 并 reload。 |
| `REMOVE_DEFAULT_SITE` | `0` | `1` = 在 **首次** 或 **`FORCE_NGINX=1` 的更新** 时尝试删除 `sites-enabled/default`。 |
| `DEPLOY_NON_INTERACTIVE` | `0` | `1` = 非交互；**须**设置合法 `SERVER_NAMES`（见第二节）。 |
| `DEPLOY_MODE` | 空（自动） | `first` / `update` 强制模式。 |

**跳过域名提问的两种方式**（首次）：

- 交互前执行：`export SERVER_NAMES='a.com b.com 1.2.3.4'` 再 `sudo -E bash ...`；
- 或：`DEPLOY_NON_INTERACTIVE=1` 且带上 `SERVER_NAMES=...`。

---

## 六、Nginx 生成的片段（示意）

写入 `NGINX_SITE` 的内容形如：

- `upstream highclaw_portal_app { server 127.0.0.1:$PORT; ... }`（名称刻意区别于站内其它站点的 `next_app`）
- `server { ... location / { proxy_pass http://highclaw_portal_app; ... } }`

HTTPS 需自行 certbot 或 CDN；本脚本只生成 **HTTP 反代**。

---

## 七、解压与备份

- 若 `TARGET_DIR` 已存在：先 **`mv` 到** `TARGET_DIR.bak.时间戳` 再解压，避免覆盖失败。
- 若存在 `SUDO_USER`，会对新目录 `chown` 给该用户（便于非 root 编辑 `.env` 等）。

---

## 八、常见问题

| 现象 | 处理 |
|------|------|
| 无 TTY 报错 | 设置 `DEPLOY_NON_INTERACTIVE=1` 和 `SERVER_NAMES`，或 `export` + `sudo -E`。 |
| 首次未装 nginx | 按脚本打印的 apt/dnf 安装后重跑，或 `SKIP_NGINX=1` 仅部署应用。 |
| 更新后想改域名/端口 | `FORCE_NGINX=1` 再跑一次，或手改 conf 后 `nginx -t && systemctl reload nginx`。 |
| `duplicate upstream "…"` | 两个 `sites-enabled` 文件里定义了同名 `upstream`。解决：① 使用本仓库**新版** `server-deploy.sh`（upstream 名为 `highclaw_portal_app`）；② 或删掉/合并重复站点配置，保证全机 `upstream` 名称唯一。 |
| `Cannot find module` | 用 **`build/package.sh` / `make ship`** 重打 tar（standalone 为 **`rsync -aL`**）；若仍缺，检查 **`next.config.mjs`** 的 `outputFileTracingIncludes` 或本地依赖是否完整后重建。 |
| `DATABASE_URL is not set`（日志里 blog 相关） | 访问 **博客/依赖数据库的页面** 需要数据库。在 **`/var/www/highclaw-portal/.env.production`** 中配置 `DATABASE_URL=`（及项目要求的其它变量），然后 `pm2 restart highclaw-portal --update-env`。纯落地页可不配库，但不要访问 `/blog` 等需库的路由。 |
| **`curl 127.0.0.1:3000` 拒绝连接** | 看 `~/.pm2/logs/*error.log`。PM2：`cd` 应用目录 → `export NODE_ENV=production HOSTNAME=0.0.0.0 PORT=3000` → `pm2 start server.js --name highclaw-portal` → `pm2 save`；开机自启自行执行一次 **`pm2 startup`**。 |
| `sudo` 后找不到变量 | 用第二节「同一行前缀变量」或 `sudo -E`。 |

---

## 九、部署后自检

1. 服务器仅需 **Node.js**（跑 `server.js`）与可选 **PM2**；**不必**装 pnpm（standalone 已带依赖）。  
2. **`/var/www/highclaw-portal/.env.production`**：按需配置 `DATABASE_URL`、`AUTH_SECRET`、`NEXT_PUBLIC_*` 等。  
3. 防火墙放行 **`LISTEN_PORT`**。  
4. `curl -sI "http://127.0.0.1:${PORT}/"`（默认 3000）、`curl -sI "http://127.0.0.1:${LISTEN_PORT}/"`。  
5. `pm2 status`、`pm2 logs highclaw-portal`

---

## 十、与本地打包的关系

本地执行 `make ship`（或 `build/package.sh`）生成 **`deploy/highclaw-portal.tar.gz`**，上传到服务器后配合本脚本使用。详见仓库根目录或 `build/README.md`。
