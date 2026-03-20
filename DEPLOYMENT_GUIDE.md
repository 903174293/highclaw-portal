# 🚀 Highclaw Portal 部署指南 - Ubuntu + Nginx

## 📋 前置条件

- **本地环境**: macOS/Linux，已安装 Node.js 20+、pnpm
- **远程服务器**: Ubuntu 20.04+，已安装 Node.js 20+、Nginx
- **SSH 访问**: 能够 SSH 连接到远程服务器
- **域名/IP**: 服务器的公网 IP 或域名

---

## 第一步：本地构建

### 1.1 安装依赖
```bash
cd /Users/weimianzhizizhangwanbin/Data/DevRepository/Git/highclaw-portal
pnpm install
```

### 1.2 构建生产版本
```bash
# 标准构建
pnpm build

# 或使用高内存构建（如果遇到内存不足）
pnpm build:fast
```

### 1.3 验证构建成功
```bash
# 检查 .next 目录是否生成
ls -la .next/standalone/
```

---

## 第二步：准备部署包

### 2.1 创建部署目录
```bash
mkdir -p ~/deploy/highclaw-portal
cd ~/deploy/highclaw-portal
```

### 2.2 复制必要文件
```bash
# 复制构建产物
cp -r /path/to/highclaw-portal/.next/standalone/* ./
cp -r /path/to/highclaw-portal/.next/static ./.next/
cp -r /path/to/highclaw-portal/public ./

# 复制 package.json（用于生产依赖）
cp /path/to/highclaw-portal/package.json ./
cp /path/to/highclaw-portal/pnpm-lock.yaml ./
```

### 2.3 创建部署压缩包
```bash
cd ~/deploy
tar -czf highclaw-portal.tar.gz highclaw-portal/
```

---

## 第三步：配置远程服务器

### 3.1 SSH 连接到服务器
```bash
ssh user@your-server-ip
```

### 3.2 安装必要软件
```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 安装 pnpm
npm install -g pnpm

# 安装 Nginx
sudo apt install -y nginx

# 安装 PM2（进程管理）
sudo npm install -g pm2
```

### 3.3 创建应用目录
```bash
sudo mkdir -p /var/www/highclaw-portal
sudo chown $USER:$USER /var/www/highclaw-portal
```

---

## 第四步：上传部署包

### 4.1 从本地上传到服务器
```bash
scp ~/deploy/highclaw-portal.tar.gz user@your-server-ip:/tmp/
```

### 4.2 在服务器上解压
```bash
cd /var/www/highclaw-portal
tar -xzf /tmp/highclaw-portal.tar.gz --strip-components=1
```

### 4.3 安装生产依赖
```bash
cd /var/www/highclaw-portal
pnpm install --prod
```

---

## 第五步：配置 Nginx

### 5.1 创建 Nginx 配置文件
```bash
sudo nano /etc/nginx/sites-available/highclaw-portal
```

### 5.2 添加以下配置
```nginx
upstream nextjs_backend {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name your-domain.com;  # 替换为你的域名或 IP

    # 重定向 HTTP 到 HTTPS（可选）
    # return 301 https://$server_name$request_uri;

    location / {
        proxy_pass http://nextjs_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 静态文件缓存
    location /_next/static {
        alias /var/www/highclaw-portal/.next/static;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    location /public {
        alias /var/www/highclaw-portal/public;
        expires 30d;
        add_header Cache-Control "public";
    }
}
```

### 5.3 启用配置
```bash
sudo ln -s /etc/nginx/sites-available/highclaw-portal /etc/nginx/sites-enabled/
sudo nginx -t  # 测试配置
sudo systemctl restart nginx
```

---

## 第六步：启动应用

### 6.1 使用 PM2 启动
```bash
cd /var/www/highclaw-portal
pm2 start server.js --name "highclaw-portal"
pm2 save
pm2 startup
```

### 6.2 验证应用运行
```bash
pm2 logs highclaw-portal
curl http://localhost:3000
```

---

## 第七步：配置 SSL（可选但推荐）

### 7.1 安装 Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 7.2 申请证书
```bash
sudo certbot --nginx -d your-domain.com
```

---

## 📊 常用命令

```bash
# 查看应用状态
pm2 status

# 查看日志
pm2 logs highclaw-portal

# 重启应用
pm2 restart highclaw-portal

# 停止应用
pm2 stop highclaw-portal

# 查看 Nginx 状态
sudo systemctl status nginx

# 查看 Nginx 日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## 🔧 环境变量配置

在服务器上创建 `.env.local` 文件：
```bash
nano /var/www/highclaw-portal/.env.local
```

添加必要的环境变量（根据你的应用需求）。

---

## ✅ 验证部署

1. 访问 `http://your-domain.com` 或 `http://your-server-ip`
2. 检查应用是否正常加载
3. 查看浏览器控制台是否有错误
4. 检查服务器日志：`pm2 logs highclaw-portal`

---

## 🆘 故障排查

| 问题 | 解决方案 |
|------|--------|
| 502 Bad Gateway | 检查 PM2 应用是否运行：`pm2 status` |
| 连接超时 | 检查防火墙：`sudo ufw allow 80/tcp` |
| 静态文件 404 | 检查 Nginx 配置中的路径是否正确 |
| 内存不足 | 增加服务器内存或使用 `pnpm build:fast` |

---

## 📝 更新应用

```bash
# 1. 本地重新构建
pnpm build

# 2. 创建新的部署包
tar -czf highclaw-portal-v2.tar.gz highclaw-portal/

# 3. 上传到服务器
scp highclaw-portal-v2.tar.gz user@your-server-ip:/tmp/

# 4. 在服务器上更新
cd /var/www/highclaw-portal
pm2 stop highclaw-portal
rm -rf .next public
tar -xzf /tmp/highclaw-portal-v2.tar.gz --strip-components=1
pnpm install --prod
pm2 start highclaw-portal
```

---

**祝部署顺利！🎉**

