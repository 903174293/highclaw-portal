#!/bin/bash

# 🖥️  Ubuntu 服务器初始化脚本
# 在远程 Ubuntu 服务器上运行此脚本以设置部署环境
# 使用方法: curl -fsSL https://your-repo/scripts/server-setup.sh | bash
# 或本地运行: bash scripts/server-setup.sh

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Highclaw Portal 服务器初始化脚本     ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}❌ 此脚本需要 root 权限${NC}"
    echo "请使用: sudo bash scripts/server-setup.sh"
    exit 1
fi

# 步骤 1: 更新系统
echo -e "${YELLOW}[1/7] 📦 更新系统包...${NC}"
apt update && apt upgrade -y
echo -e "${GREEN}✅ 系统更新完成${NC}"
echo ""

# 步骤 2: 安装基础工具
echo -e "${YELLOW}[2/7] 🔧 安装基础工具...${NC}"
apt install -y \
    curl \
    wget \
    git \
    build-essential \
    python3 \
    ca-certificates \
    gnupg \
    lsb-release
echo -e "${GREEN}✅ 基础工具安装完成${NC}"
echo ""

# 步骤 3: 安装 Node.js 20
echo -e "${YELLOW}[3/7] 📦 安装 Node.js 20...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
echo -e "${GREEN}✅ Node.js 安装完成${NC}"
node --version
echo ""

# 步骤 4: 安装 pnpm
echo -e "${YELLOW}[4/7] 📦 安装 pnpm...${NC}"
npm install -g pnpm
echo -e "${GREEN}✅ pnpm 安装完成${NC}"
pnpm --version
echo ""

# 步骤 5: 安装 PM2
echo -e "${YELLOW}[5/7] 📦 安装 PM2...${NC}"
npm install -g pm2
pm2 startup
pm2 save
echo -e "${GREEN}✅ PM2 安装完成${NC}"
echo ""

# 步骤 6: 安装 Nginx
echo -e "${YELLOW}[6/7] 🌐 安装 Nginx...${NC}"
apt install -y nginx
systemctl enable nginx
systemctl start nginx
echo -e "${GREEN}✅ Nginx 安装完成${NC}"
echo ""

# 步骤 7: 创建应用目录
echo -e "${YELLOW}[7/7] 📁 创建应用目录...${NC}"
mkdir -p /var/www/highclaw-portal
chown -R $SUDO_USER:$SUDO_USER /var/www/highclaw-portal
chmod -R 755 /var/www/highclaw-portal
echo -e "${GREEN}✅ 应用目录创建完成${NC}"
echo ""

# 可选: 安装 Certbot（SSL 证书）
echo -e "${YELLOW}[可选] 🔒 安装 Certbot（用于 SSL 证书）...${NC}"
read -p "是否安装 Certbot？(y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    apt install -y certbot python3-certbot-nginx
    echo -e "${GREEN}✅ Certbot 安装完成${NC}"
else
    echo -e "${YELLOW}⏭️  跳过 Certbot 安装${NC}"
fi
echo ""

# 可选: 配置防火墙
echo -e "${YELLOW}[可选] 🔥 配置防火墙...${NC}"
read -p "是否配置 UFW 防火墙？(y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    ufw allow 22/tcp
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw --force enable
    echo -e "${GREEN}✅ 防火墙配置完成${NC}"
else
    echo -e "${YELLOW}⏭️  跳过防火墙配置${NC}"
fi
echo ""

# 显示总结
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅ 服务器初始化完成！                ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📋 已安装的软件:${NC}"
echo "  • Node.js: $(node --version)"
echo "  • npm: $(npm --version)"
echo "  • pnpm: $(pnpm --version)"
echo "  • PM2: $(pm2 --version)"
echo "  • Nginx: $(nginx -v 2>&1)"
echo ""
echo -e "${BLUE}📁 应用目录:${NC}"
echo "  /var/www/highclaw-portal"
echo ""
echo -e "${BLUE}🚀 下一步:${NC}"
echo "  1. 上传部署包到服务器"
echo "  2. 运行部署脚本: ./scripts/deploy.sh <server-ip> <username>"
echo "  3. 配置 Nginx: sudo nano /etc/nginx/sites-available/highclaw-portal"
echo "  4. 启用配置: sudo ln -s /etc/nginx/sites-available/highclaw-portal /etc/nginx/sites-enabled/"
echo "  5. 重启 Nginx: sudo systemctl restart nginx"
echo ""
echo -e "${YELLOW}💡 提示:${NC}"
echo "  • 查看应用日志: pm2 logs highclaw-portal"
echo "  • 查看 Nginx 日志: sudo tail -f /var/log/nginx/error.log"
echo "  • 重启应用: pm2 restart highclaw-portal"
echo ""

