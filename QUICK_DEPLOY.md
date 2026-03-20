# ⚡ 快速部署指南 - 5 分钟上线

## 🎯 快速部署流程

### 前置条件
- 远程 Ubuntu 服务器（已获得 SSH 访问权限）
- 本地已安装 Node.js 20+ 和 pnpm
- 服务器 IP 或域名

### 第一步：初始化服务器（仅需一次）

```bash
# 1. 下载初始化脚本到本地
curl -fsSL https://raw.githubusercontent.com/your-repo/main/scripts/server-setup.sh -o server-setup.sh

# 2. 上传到服务器
scp server-setup.sh ubuntu@your-server-ip:/tmp/

# 3. SSH 连接到服务器并运行
ssh ubuntu@your-server-ip
sudo bash /tmp/server-setup.sh

# 4. 按提示完成初始化（约 5-10 分钟）
```

### 第二步：部署应用

```bash
# 1. 在本地项目目录运行部署脚本
cd /path/to/highclaw-portal
chmod +x scripts/deploy.sh
./scripts/deploy.sh your-server-ip ubuntu

# 脚本会自动完成：
# ✅ 本地构建
# ✅ 准备部署包
# ✅ 上传到服务器
# ✅ 在服务器上部署
# ✅ 启动应用
```

### 第三步：配置 Nginx

```bash
# 1. SSH 连接到服务器
ssh ubuntu@your-server-ip

# 2. 创建 Nginx 配置
sudo nano /etc/nginx/sites-available/highclaw-portal

# 3. 复制以下内容（替换 your-domain.com）：
```

```nginx
upstream nextjs_backend {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://nextjs_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    location /_next/static {
        alias /var/www/highclaw-portal/.next/static;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }
    
    location /public {
        alias /var/www/highclaw-portal/public;
        expires 30d;
    }
}
```

```bash
# 4. 启用配置
sudo ln -s /etc/nginx/sites-available/highclaw-portal /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 5. 验证应用
curl http://localhost:3000
```

### 第四步：验证部署

```bash
# 访问应用
# 浏览器打开: http://your-server-ip 或 http://your-domain.com

# 查看应用状态
pm2 status

# 查看应用日志
pm2 logs highclaw-portal

# 查看 Nginx 日志
sudo tail -f /var/log/nginx/error.log
```

---

## 📊 常用命令速查表

| 命令 | 说明 |
|------|------|
| `pm2 status` | 查看应用状态 |
| `pm2 logs highclaw-portal` | 查看应用日志 |
| `pm2 restart highclaw-portal` | 重启应用 |
| `pm2 stop highclaw-portal` | 停止应用 |
| `pm2 start highclaw-portal` | 启动应用 |
| `sudo systemctl restart nginx` | 重启 Nginx |
| `sudo nginx -t` | 测试 Nginx 配置 |
| `sudo tail -f /var/log/nginx/error.log` | 查看 Nginx 错误日志 |

---

## 🔒 配置 HTTPS（可选）

```bash
# 1. 安装 Certbot（如果未安装）
sudo apt install -y certbot python3-certbot-nginx

# 2. 申请证书
sudo certbot --nginx -d your-domain.com

# 3. 自动续期
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# 4. 验证证书
sudo certbot certificates
```

---

## 🆘 常见问题

### Q: 502 Bad Gateway
**A:** 检查应用是否运行
```bash
pm2 status
pm2 logs highclaw-portal
```

### Q: 连接超时
**A:** 检查防火墙
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
# 1. 本地修改代码并构建
pnpm build

# 2. 运行部署脚本
./scripts/deploy.sh your-server-ip ubuntu

# 应用会自动重启
```

---

## 🎉 完成！

你的应用现在应该在线了！

- **应用地址**: http://your-domain.com
- **查看日志**: `ssh ubuntu@your-server-ip 'pm2 logs highclaw-portal'`
- **重启应用**: `ssh ubuntu@your-server-ip 'pm2 restart highclaw-portal'`

有问题？查看完整的 `DEPLOYMENT_GUIDE.md` 文件。

