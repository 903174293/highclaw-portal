#!/bin/bash

# 🚀 Highclaw Portal 自动化部署脚本
# 使用方法: ./scripts/deploy.sh <server-ip> <username>
# 示例: ./scripts/deploy.sh 192.168.1.100 ubuntu

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 参数检查
if [ $# -lt 2 ]; then
    echo -e "${RED}❌ 参数不足${NC}"
    echo "使用方法: ./scripts/deploy.sh <server-ip> <username>"
    echo "示例: ./scripts/deploy.sh 192.168.1.100 ubuntu"
    exit 1
fi

SERVER_IP=$1
USERNAME=$2
DEPLOY_DIR="/var/www/highclaw-portal"
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo -e "${YELLOW}📦 开始部署 Highclaw Portal${NC}"
echo "服务器: $SERVER_IP"
echo "用户: $USERNAME"
echo ""

# 步骤 1: 本地构建
echo -e "${YELLOW}[1/5] 🔨 本地构建...${NC}"
cd "$PROJECT_ROOT"
pnpm install
pnpm build
echo -e "${GREEN}✅ 构建完成${NC}"
echo ""

# 步骤 2: 准备部署包
echo -e "${YELLOW}[2/5] 📦 准备部署包...${NC}"
DEPLOY_TEMP="/tmp/highclaw-portal-deploy"
rm -rf "$DEPLOY_TEMP"
mkdir -p "$DEPLOY_TEMP/highclaw-portal"

cp -r .next/standalone/* "$DEPLOY_TEMP/highclaw-portal/"
mkdir -p "$DEPLOY_TEMP/highclaw-portal/.next"
cp -r .next/static "$DEPLOY_TEMP/highclaw-portal/.next/"
cp -r public "$DEPLOY_TEMP/highclaw-portal/"

cd "$DEPLOY_TEMP"
tar -czf highclaw-portal.tar.gz highclaw-portal/
echo -e "${GREEN}✅ 部署包准备完成${NC}"
echo ""

# 步骤 3: 上传到服务器
echo -e "${YELLOW}[3/5] 📤 上传到服务器...${NC}"
scp highclaw-portal.tar.gz "$USERNAME@$SERVER_IP:/tmp/"
echo -e "${GREEN}✅ 上传完成${NC}"
echo ""

# 步骤 4: 在服务器上部署
echo -e "${YELLOW}[4/5] 🚀 在服务器上部署...${NC}"
ssh "$USERNAME@$SERVER_IP" << 'EOF'
    set -e
    
    # 停止现有应用
    pm2 stop highclaw-portal 2>/dev/null || true
    
    # 清理旧文件
    sudo rm -rf /var/www/highclaw-portal/*
    
    # 解压新文件（standalone 已含 node_modules，无需在服务器 pnpm install）
    cd /var/www/highclaw-portal
    tar -xzf /tmp/highclaw-portal.tar.gz --strip-components=1
    
    export NODE_ENV=production
    export HOSTNAME=0.0.0.0
    export PORT=3000
    pm2 delete highclaw-portal 2>/dev/null || true
    pm2 start server.js --name "highclaw-portal"
    pm2 save
    
    echo "✅ 服务器部署完成"
EOF
echo -e "${GREEN}✅ 服务器部署完成${NC}"
echo ""

# 步骤 5: 验证
echo -e "${YELLOW}[5/5] ✅ 验证部署...${NC}"
sleep 2
if ssh "$USERNAME@$SERVER_IP" "curl -s http://localhost:3000 > /dev/null"; then
    echo -e "${GREEN}✅ 应用运行正常${NC}"
else
    echo -e "${RED}⚠️  应用可能未正常启动，请检查日志${NC}"
    echo "查看日志: ssh $USERNAME@$SERVER_IP 'pm2 logs highclaw-portal'"
fi

echo ""
echo -e "${GREEN}🎉 部署完成！${NC}"
echo "访问地址: http://$SERVER_IP"
echo "查看日志: ssh $USERNAME@$SERVER_IP 'pm2 logs highclaw-portal'"
echo "重启应用: ssh $USERNAME@$SERVER_IP 'pm2 restart highclaw-portal'"

# 清理临时文件
rm -rf "$DEPLOY_TEMP"

