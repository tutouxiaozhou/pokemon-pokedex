#!/bin/bash
set -e

echo "开始构建宝可梦图鉴项目..."

# 设置 Node.js 版本
export NODE_VERSION=20
export NPM_VERSION=10

# 清理缓存和临时文件
echo "清理缓存..."
rm -rf node_modules/.cache
npm cache clean --force

# 设置 npm 配置
npm config set fund false
npm config set audit false
npm config set progress false
npm config set maxsockets 1
npm config set registry https://registry.npmjs.org/

# 安装依赖（使用更保守的方式）
echo "安装项目依赖..."
timeout 600 npm install --legacy-peer-deps --no-audit --no-fund --maxsockets=1 || {
    echo "npm install 超时，尝试使用 yarn..."
    npm install -g yarn
    yarn install --network-timeout 600000
}

# 构建项目
echo "构建项目..."
npm run build

echo "构建完成！输出目录: dist"
