#!/bin/bash

# 设置错误时退出
set -e

echo "开始构建 Pokemon Pokedex..."

# 清理之前的构建
echo "清理之前的构建文件..."
rm -rf dist node_modules/.cache

# 设置 Node.js 内存限制
export NODE_OPTIONS="--max-old-space-size=4096"

# 安装依赖
echo "安装项目依赖..."
npm ci --prefer-offline --no-audit --progress=false

# 构建项目
echo "构建项目..."
npm run build

echo "构建完成！"