# 📚 Highclaw Portal 部署资源索引

## 🎯 快速导航

### 🚀 我想快速部署（5分钟）
👉 **查看**: [`QUICK_DEPLOY.md`](./QUICK_DEPLOY.md)

### 📖 我想了解完整流程
👉 **查看**: [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md)

### 🐳 我想使用 Docker 部署
👉 **查看**: [`DOCKER_DEPLOY.md`](./DOCKER_DEPLOY.md)

### 🔄 我想对比三种方案
👉 **查看**: [`DEPLOYMENT_OPTIONS.md`](./DEPLOYMENT_OPTIONS.md)

### 📊 我想看总结和检查清单
👉 **查看**: [`DEPLOYMENT_SUMMARY.md`](./DEPLOYMENT_SUMMARY.md)

---

## 📁 部署资源清单

### 📚 文档文件
```
├── QUICK_DEPLOY.md              ⚡ 5分钟快速部署指南
├── DEPLOYMENT_GUIDE.md          📖 完整详细部署指南
├── DOCKER_DEPLOY.md             🐳 Docker 容器部署指南
├── DEPLOYMENT_OPTIONS.md        🔄 三种方案对比分析
├── DEPLOYMENT_SUMMARY.md        📊 部署总结和检查清单
└── DEPLOYMENT_INDEX.md          📚 本文件 - 资源索引
```

### 🔧 脚本文件
```
scripts/
├── deploy.sh                    🚀 一键部署脚本
└── server-setup.sh              🖥️  服务器初始化脚本
```

### ⚙️ 配置文件
```
├── nginx.conf.example           🌐 Nginx 配置示例
├── docker-compose.yml           🐳 Docker 编排配置
├── Dockerfile                   📦 Docker 镜像定义
└── next.config.mjs              ⚙️  Next.js 配置
```

---

## 🎓 学习路径

### 初学者路径
1. 阅读 `QUICK_DEPLOY.md` - 了解基本流程
2. 运行 `scripts/server-setup.sh` - 初始化服务器
3. 运行 `scripts/deploy.sh` - 部署应用
4. 配置 Nginx - 参考 `nginx.conf.example`

### 进阶路径
1. 阅读 `DEPLOYMENT_GUIDE.md` - 深入理解每个步骤
2. 学习 `DOCKER_DEPLOY.md` - 掌握容器化部署
3. 研究 `DEPLOYMENT_OPTIONS.md` - 对比不同方案
4. 实施 CI/CD - 自动化部署流程

### 企业路径
1. 评估 `DEPLOYMENT_OPTIONS.md` - 选择最佳方案
2. 配置云平台 - Vercel/AWS/Google Cloud
3. 设置 CI/CD - GitHub Actions/GitLab CI
4. 监控和告警 - 性能监控和日志分析

---

## 🚀 三种部署方案速览

### 方案 1: 传统部署
- **难度**: ⭐⭐
- **成本**: 低
- **性能**: 高
- **维护**: 中
- **推荐**: 小型项目、学习
- **文档**: `QUICK_DEPLOY.md`, `DEPLOYMENT_GUIDE.md`

### 方案 2: Docker 部署
- **难度**: ⭐⭐⭐
- **成本**: 低
- **性能**: 高
- **维护**: 低
- **推荐**: 中型项目、团队开发
- **文档**: `DOCKER_DEPLOY.md`

### 方案 3: 云平台部署
- **难度**: ⭐
- **成本**: 中-高
- **性能**: 高
- **维护**: 低
- **推荐**: 大型项目、企业应用
- **文档**: `DEPLOYMENT_OPTIONS.md`

---

## 📋 部署前检查清单

### 环境准备
- [ ] 本地已安装 Node.js 20+
- [ ] 本地已安装 pnpm
- [ ] 已获得远程服务器 SSH 访问权限
- [ ] 服务器运行 Ubuntu 20.04+

### 代码准备
- [ ] 代码已提交到 Git
- [ ] 环境变量已配置
- [ ] 依赖已安装
- [ ] 本地测试通过

### 服务器准备
- [ ] 服务器已初始化（运行 `server-setup.sh`）
- [ ] Node.js 已安装
- [ ] Nginx 已安装
- [ ] PM2 已安装

---

## 🔧 常用命令速查

### 部署命令
```bash
# 初始化服务器
sudo bash scripts/server-setup.sh

# 部署应用
./scripts/deploy.sh your-ip ubuntu

# 本地构建
pnpm build
```

### 应用管理
```bash
# 查看状态
pm2 status

# 查看日志
pm2 logs highclaw-portal

# 重启应用
pm2 restart highclaw-portal
```

### Nginx 管理
```bash
# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx

# 查看日志
sudo tail -f /var/log/nginx/error.log
```

### Docker 管理
```bash
# 启动容器
docker-compose up -d

# 查看日志
docker-compose logs -f

# 重启容器
docker-compose restart app
```

---

## 🆘 故障排查

### 502 Bad Gateway
```bash
# 检查应用是否运行
pm2 status
pm2 logs highclaw-portal
```

### 连接超时
```bash
# 检查防火墙
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

### 静态文件 404
```bash
# 检查文件是否存在
ls -la /var/www/highclaw-portal/.next/static
```

### 内存不足
```bash
# 使用高内存构建
pnpm build:fast
```

---

## 📞 获取帮助

1. **快速问题**: 查看 `QUICK_DEPLOY.md`
2. **详细问题**: 查看 `DEPLOYMENT_GUIDE.md`
3. **Docker 问题**: 查看 `DOCKER_DEPLOY.md`
4. **方案选择**: 查看 `DEPLOYMENT_OPTIONS.md`
5. **脚本问题**: 运行 `./scripts/deploy.sh --help`

---

## 📊 部署资源统计

| 类型 | 数量 | 说明 |
|------|------|------|
| 📚 文档 | 6 | 完整的部署指南和参考 |
| 🔧 脚本 | 2 | 自动化部署脚本 |
| ⚙️ 配置 | 4 | Nginx、Docker 等配置 |
| 📋 清单 | 多个 | 检查清单和速查表 |

---

## ✅ 部署完成后

### 验证应用
- [ ] 应用可访问
- [ ] 日志无错误
- [ ] 静态文件加载正常
- [ ] API 响应正常

### 配置监控
- [ ] 设置日志监控
- [ ] 配置性能告警
- [ ] 设置备份策略

### 优化性能
- [ ] 启用 Gzip 压缩
- [ ] 配置静态文件缓存
- [ ] 使用 CDN 加速

---

## 🎉 开始部署

选择适合你的方案，开始部署吧！

**推荐流程**:
1. 阅读 `QUICK_DEPLOY.md`
2. 运行 `scripts/server-setup.sh`
3. 运行 `scripts/deploy.sh`
4. 配置 Nginx
5. 访问应用

祝部署顺利！🚀

