# 📦 Highclaw Portal 部署方案总结

## 🎯 已为你准备的部署资源

### 📚 文档指南
| 文件 | 说明 | 适用场景 |
|------|------|---------|
| `QUICK_DEPLOY.md` | ⚡ 5分钟快速部署 | 急于上线 |
| `DEPLOYMENT_GUIDE.md` | 📖 完整详细指南 | 学习部署流程 |
| `DOCKER_DEPLOY.md` | 🐳 Docker 容器部署 | 团队开发 |
| `DEPLOYMENT_OPTIONS.md` | 🔄 三种方案对比 | 选择最佳方案 |

### 🔧 自动化脚本
| 脚本 | 功能 | 使用方式 |
|------|------|---------|
| `scripts/deploy.sh` | 一键部署应用 | `./scripts/deploy.sh <IP> <user>` |
| `scripts/server-setup.sh` | 初始化服务器 | `sudo bash scripts/server-setup.sh` |

### ⚙️ 配置文件
| 文件 | 说明 |
|------|------|
| `nginx.conf.example` | Nginx 配置示例 |
| `docker-compose.yml` | Docker 编排配置 |
| `Dockerfile` | Docker 镜像定义 |

---

## 🚀 三种部署方案

### 方案 1: 传统部署（推荐新手）
```bash
# 步骤 1: 初始化服务器（仅需一次）
scp scripts/server-setup.sh ubuntu@your-ip:/tmp/
ssh ubuntu@your-ip 'sudo bash /tmp/server-setup.sh'

# 步骤 2: 部署应用
./scripts/deploy.sh your-ip ubuntu

# 步骤 3: 配置 Nginx
# 参考 nginx.conf.example

# 完成！应用已上线
```

**优点**: 简单、资源少、易调试  
**缺点**: 需要手动管理、扩展性有限  
**部署时间**: 15-25 分钟

---

### 方案 2: Docker 部署（推荐团队）
```bash
# 步骤 1: 在服务器安装 Docker
curl -fsSL https://get.docker.com | sh

# 步骤 2: 上传项目文件
scp -r . ubuntu@your-ip:/var/www/highclaw-portal/

# 步骤 3: 启动应用
ssh ubuntu@your-ip 'cd /var/www/highclaw-portal && docker-compose up -d'

# 完成！应用已上线
```

**优点**: 环境一致、易扩展、自动化  
**缺点**: 需要学习 Docker、资源占用多  
**部署时间**: 15-25 分钟

---

### 方案 3: 云平台部署（推荐企业）
```bash
# 使用 Vercel（最简单）
npm i -g vercel
vercel

# 或使用其他平台（AWS、Google Cloud 等）
```

**优点**: 一键部署、自动 SSL、CDN 加速  
**缺点**: 成本较高、依赖第三方  
**部署时间**: 5-10 分钟

---

## ⚡ 快速开始（5 分钟）

### 前置条件
- ✅ 远程 Ubuntu 服务器（已获得 SSH 访问）
- ✅ 本地已安装 Node.js 20+ 和 pnpm
- ✅ 服务器 IP 或域名

### 一键部署
```bash
# 1. 初始化服务器（仅需一次）
scp scripts/server-setup.sh ubuntu@192.168.1.100:/tmp/
ssh ubuntu@192.168.1.100 'sudo bash /tmp/server-setup.sh'

# 2. 部署应用
./scripts/deploy.sh 192.168.1.100 ubuntu

# 3. 配置 Nginx（参考 nginx.conf.example）
ssh ubuntu@192.168.1.100
sudo nano /etc/nginx/sites-available/highclaw-portal
# 复制 nginx.conf.example 的内容
sudo ln -s /etc/nginx/sites-available/highclaw-portal /etc/nginx/sites-enabled/
sudo systemctl restart nginx

# 4. 访问应用
# 浏览器打开: http://192.168.1.100
```

---

## 📊 常用命令速查

### 应用管理
```bash
pm2 status                    # 查看应用状态
pm2 logs highclaw-portal      # 查看应用日志
pm2 restart highclaw-portal   # 重启应用
pm2 stop highclaw-portal      # 停止应用
```

### Nginx 管理
```bash
sudo systemctl restart nginx   # 重启 Nginx
sudo nginx -t                  # 测试配置
sudo tail -f /var/log/nginx/error.log  # 查看错误日志
```

### Docker 管理
```bash
docker-compose ps             # 查看容器状态
docker-compose logs -f        # 查看日志
docker-compose restart app    # 重启应用
docker-compose down           # 停止所有容器
```

---

## 🔒 安全建议

- [ ] 配置 SSH 密钥认证（禁用密码登录）
- [ ] 启用防火墙（UFW）
- [ ] 配置 HTTPS/SSL 证书
- [ ] 定期更新系统和依赖
- [ ] 配置环境变量（不要提交敏感信息）
- [ ] 设置日志监控和告警

---

## 📈 性能优化

### Nginx 优化
- ✅ 启用 Gzip 压缩
- ✅ 配置静态文件缓存
- ✅ 使用 CDN 加速

### Next.js 优化
- ✅ 启用 Image Optimization
- ✅ 配置 ISR（增量静态再生成）
- ✅ 使用 API 路由缓存

### 服务器优化
- ✅ 增加内存
- ✅ 使用 SSD
- ✅ 配置 PM2 集群模式

---

## 🆘 常见问题

### Q: 502 Bad Gateway
**A:** 检查应用是否运行
```bash
pm2 status
pm2 logs highclaw-portal
```

### Q: 连接超时
**A:** 检查防火墙和安全组
```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

### Q: 静态文件 404
**A:** 检查 Nginx 配置中的路径
```bash
ls -la /var/www/highclaw-portal/.next/static
```

### Q: 内存不足
**A:** 使用高内存构建
```bash
pnpm build:fast
```

---

## 📝 更新应用

```bash
# 1. 本地修改代码
# 2. 本地构建测试
pnpm build

# 3. 运行部署脚本
./scripts/deploy.sh your-ip ubuntu

# 应用会自动重启
```

---

## 🎓 学习资源

- [Next.js 官方文档](https://nextjs.org/docs)
- [Nginx 官方文档](https://nginx.org/en/docs/)
- [Docker 官方文档](https://docs.docker.com/)
- [PM2 官方文档](https://pm2.keymetrics.io/)

---

## 📞 获取帮助

1. **快速部署**: 查看 `QUICK_DEPLOY.md`
2. **详细指南**: 查看 `DEPLOYMENT_GUIDE.md`
3. **Docker 部署**: 查看 `DOCKER_DEPLOY.md`
4. **方案对比**: 查看 `DEPLOYMENT_OPTIONS.md`
5. **脚本帮助**: 运行 `./scripts/deploy.sh --help`

---

## ✅ 部署检查清单

### 部署前
- [ ] 代码已提交
- [ ] 环境变量已配置
- [ ] 本地测试通过
- [ ] 依赖已安装

### 部署中
- [ ] 服务器已初始化
- [ ] 应用已上传
- [ ] 应用已启动
- [ ] Nginx 已配置

### 部署后
- [ ] 应用可访问
- [ ] 日志无错误
- [ ] 静态文件正常
- [ ] API 响应正常

---

## 🎉 祝部署顺利！

选择适合你的方案，开始部署吧！

**推荐流程**:
1. 阅读 `QUICK_DEPLOY.md` 了解流程
2. 运行 `scripts/server-setup.sh` 初始化服务器
3. 运行 `scripts/deploy.sh` 部署应用
4. 配置 Nginx 并访问应用

有问题？查看对应的部署指南或运行脚本获取帮助。

