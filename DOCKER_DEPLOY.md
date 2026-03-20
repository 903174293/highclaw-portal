# 🐳 Docker 部署指南 - Highclaw Portal

## 📋 前置条件

- 远程 Ubuntu 服务器
- 已安装 Docker 和 Docker Compose
- SSH 访问权限

---

## 第一步：在服务器上安装 Docker

```bash
# SSH 连接到服务器
ssh ubuntu@your-server-ip

# 安装 Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 安装 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 验证安装
docker --version
docker-compose --version

# 将当前用户添加到 docker 组（可选）
sudo usermod -aG docker $USER
newgrp docker
```

---

## 第二步：准备部署文件

### 2.1 创建项目目录
```bash
mkdir -p /var/www/highclaw-portal
cd /var/www/highclaw-portal
```

### 2.2 上传项目文件
```bash
# 从本地上传整个项目
scp -r /path/to/highclaw-portal/* ubuntu@your-server-ip:/var/www/highclaw-portal/
```

### 2.3 创建 Nginx 配置目录
```bash
mkdir -p nginx-sites
mkdir -p ssl
mkdir -p logs/{app,nginx}
```

---

## 第三步：配置 Nginx

### 3.1 创建 Nginx 主配置文件
```bash
cat > nginx.conf << 'EOF'
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 20M;

    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript 
               application/json application/javascript application/xml+rss 
               application/rss+xml font/truetype font/opentype 
               application/vnd.ms-fontobject image/svg+xml;

    include /etc/nginx/sites-available/*.conf;
}
EOF
```

### 3.2 创建站点配置
```bash
cat > nginx-sites/highclaw-portal.conf << 'EOF'
upstream nextjs_backend {
    server app:3000;
}

server {
    listen 80;
    server_name _;

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
        proxy_pass http://nextjs_backend;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    location /public {
        proxy_pass http://nextjs_backend;
        expires 30d;
    }
}
EOF
```

---

## 第四步：配置环境变量

```bash
# 创建 .env.production 文件
cat > .env.production << 'EOF'
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0

# 添加你的环境变量
# DATABASE_URL=your-database-url
# API_KEY=your-api-key
EOF
```

---

## 第五步：启动应用

```bash
# 构建并启动容器
docker-compose up -d

# 查看日志
docker-compose logs -f

# 查看容器状态
docker-compose ps
```

---

## 第六步：验证部署

```bash
# 检查应用是否运行
curl http://localhost:3000

# 查看应用日志
docker-compose logs app

# 查看 Nginx 日志
docker-compose logs nginx
```

---

## 📊 常用 Docker 命令

```bash
# 查看容器状态
docker-compose ps

# 查看日志
docker-compose logs -f app
docker-compose logs -f nginx

# 重启应用
docker-compose restart app

# 停止应用
docker-compose stop

# 启动应用
docker-compose start

# 重建镜像
docker-compose build --no-cache

# 完全重新部署
docker-compose down
docker-compose up -d

# 进入容器
docker-compose exec app sh
docker-compose exec nginx sh
```

---

## 🔒 配置 HTTPS

### 使用 Let's Encrypt 证书

```bash
# 1. 安装 Certbot
sudo apt install -y certbot python3-certbot-nginx

# 2. 申请证书
sudo certbot certonly --standalone -d your-domain.com

# 3. 复制证书到 ssl 目录
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ./ssl/
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ./ssl/
sudo chown $USER:$USER ./ssl/*

# 4. 更新 Nginx 配置以使用 HTTPS
```

### 更新 Nginx 配置

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # 其他配置...
}
```

---

## 📝 更新应用

```bash
# 1. 拉取最新代码
git pull origin main

# 2. 重新构建镜像
docker-compose build

# 3. 重启容器
docker-compose up -d

# 4. 查看日志
docker-compose logs -f
```

---

## 🆘 故障排查

| 问题 | 解决方案 |
|------|--------|
| 502 Bad Gateway | `docker-compose logs app` 查看应用日志 |
| 容器无法启动 | `docker-compose build --no-cache` 重新构建 |
| 端口被占用 | 修改 `docker-compose.yml` 中的端口映射 |
| 内存不足 | 增加服务器内存或优化应用 |

---

## 🎉 完成！

你的应用现在运行在 Docker 容器中！

- **应用地址**: http://your-domain.com
- **查看日志**: `docker-compose logs -f`
- **重启应用**: `docker-compose restart app`

