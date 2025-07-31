#!/bin/bash
set -e

echo "开始构建宝可梦图鉴项目..."

# 设置 Node.js 版本
export NODE_VERSION=18
export NPM_VERSION=10

# 清理缓存和临时文件
echo "清理缓存..."
rm -rf node_modules/.cache
npm cache clean --force

# 设置 npm 配置
npm config set fund false
npm config set audit false
npm config set progress false

# 安装依赖
echo "安装项目依赖..."
npm ci --no-audit --no-fund --prefer-offline --legacy-peer-deps

# 构建项目
echo "构建项目..."
npm run build

echo "构建完成！输出目录: dist"