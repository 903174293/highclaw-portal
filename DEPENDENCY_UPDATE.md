# 依赖持续更新方案（pnpm）

面向本仓库（Next.js + pnpm + standalone 部署）。目标：**可重复、可回滚、少踩生产坑**。

---

## 一、节奏建议

| 频率 | 内容 |
|------|------|
| **每周或每两周** | 安全补丁：`pnpm audit`，仅升级有 CVE 且风险可评估的包 |
| **每月** | 小版本（patch/minor）：在独立分支跑完整检查后再合并 |
| **按需/每季度** | 大版本（major）：Next/React 等，预留专门窗口 + 读官方升级文档 |

---

## 二、更新前（本地）

1. **干净工作区**  
   ```bash
   git status   # 无未提交改动，或已单独分支
   ```

2. **锁定 Node 版本**  
   与生产一致（建议 `.nvmrc` / 文档写明 Node 20 LTS 或 22.x）。

3. **查看过期包**  
   ```bash
   pnpm outdated
   ```

---

## 三、推荐更新策略（由易到难）

### 1. 仅补丁与小版本（默认）

```bash
pnpm update --interactive
# 或按包：
pnpm update <package-name>
```

改完后：

```bash
pnpm install
pnpm run build:webpack   # 或你团队约定的 build 命令
```

### 2. 对齐上游范围（谨慎）

在 `package.json` 里放宽版本号后再：

```bash
pnpm update --latest
```

**风险高**：易引入 major，务必在分支上完整构建 + 冒烟。

### 3. 单一依赖大升级（例如 Next）

1. 建分支 `chore/bump-next-17`  
2. 只改该依赖及 peer 要求  
3. 阅读官方 **Upgrading** 文档  
4. `pnpm install` → `pnpm run build:webpack` → 本地 `pnpm dev` 点关键路径  
5. 再合并

---

## 四、更新后必做检查清单

- [ ] `pnpm install` 无报错  
- [ ] `pnpm run build:webpack`（服务器若曾卡 Turbopack，与生产一致）  
- [ ] `pnpm dev`：首页、登录、带 `[locale]` 的路由、管理后台（若用）  
- [ ] 若改了 `next.config` / Tailwind / MDX：对照 **standalone** 是否仍缺模块（历史问题：`ws`、`styled-jsx` 等，见 `next.config.mjs` 的 `outputFileTracingIncludes`）  
- [ ] 提交 **`pnpm-lock.yaml`**，勿只改 `package.json` 不提交锁文件  

可选：

```bash
pnpm audit
pnpm why <可疑包名>
```

---

## 五、生产部署（依赖变更后）

1. 合并到主分支后，在**构建机或本地**执行生产构建（与线上一致）：  
   `pnpm run build:server` 或 `build:webpack`  
2. 按 `DEPLOYMENT_GUIDE.md`：**standalone + `.next/static` + `public`** 打包上传  
3. **不要在生产目录裸跑** `npm install` 拉全量依赖（易 peer 冲突、体积失控）；应急补包仅作临时手段  
4. 部署后：`pm2 restart`，看 `pm2 logs`  

本地一键产物包：`make release` / `make ship` → `deploy/highclaw-portal.tar.gz`（见 `build/README.md`）。

---

## 六、回滚

```bash
git revert <合并提交的 hash>
# 或
git checkout main -- pnpm-lock.yaml package.json && pnpm install
```

生产：回滚到**上一版构建产物包**最快。

---

## 七、与本项目相关的注意点

- **Next 16**：生产构建默认 Turbopack；小内存机器用 `pnpm run build:webpack` / `build:server`（见 `package.json`）。  
- **pnpm**：建议保留 `.npmrc`（若已配置 `shamefully-hoist` 等），避免与 CI/同事环境不一致。  
- **standalone**：升级 `@libsql/*`、`next` 后若线上报 `Cannot find module`，优先检查 **追踪包含** 与 **锁文件是否同步**。  

---

## 八、自动化（可选）

- **Dependabot / Renovate**：开 PR 自动 bump，合并前跑同一套 `build`。  
- **CI**：对 `main` / PR 跑 `pnpm install --frozen-lockfile && pnpm run build:webpack`。  

---

**一句话**：小步、`pnpm outdated` → 分支 → `pnpm update` → **锁文件提交** → **build:webpack** → 本地冒烟 → 再打 standalone 包上线；大版本单独排期并读官方升级说明。
