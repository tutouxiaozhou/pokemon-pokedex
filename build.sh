#!/bin/bash

# 设置错误时退出
set -e

echo "开始构建 Pokemon Pokedex..."

# 设置环境变量
export NODE_OPTIONS="--max-old-space-size=4096"
export NPM_CONFIG_PROGRESS=false
export NPM_CONFIG_AUDIT=false
export NPM_CONFIG_FUND=false
export NPM_CONFIG_LOGLEVEL=error

# 清理缓存和构建文件
echo "清理缓存和构建文件..."
rm -rf dist node_modules/.cache .npm

# 显示版本信息
echo "Node.js 版本: $(node --version)"
echo "npm 版本: $(npm --version)"

# 安装依赖 - 使用优化策略
echo "安装项目依赖..."

# 尝试使用 npm ci，如果失败则使用 npm install
if ! timeout 600 npm ci --no-audit --no-fund --progress=false --loglevel=error; then
    echo "npm ci 失败，尝试使用 npm install..."
    rm -rf node_modules package-lock.json
    timeout 600 npm install --no-audit --no-fund --progress=false --loglevel=error
fi

echo "依赖安装完成"

# 构建项目
echo "构建项目..."
npm run build

echo "构建完成！"
