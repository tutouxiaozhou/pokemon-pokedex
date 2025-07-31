#!/bin/bash

# Cloudflare Pages 专用部署脚本
# 解决构建卡住问题

echo "🚀 开始 Cloudflare Pages 部署..."

# 设置环境变量
export NODE_OPTIONS="--max-old-space-size=4096"
export NPM_CONFIG_PROGRESS=false
export NPM_CONFIG_AUDIT=false
export NPM_CONFIG_FUND=false
export NPM_CONFIG_LOGLEVEL=error

# 显示环境信息
echo "📋 环境信息:"
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"
echo "工作目录: $(pwd)"

# 清理环境
echo "🧹 清理构建环境..."
rm -rf dist .npm node_modules/.cache

# 安装依赖 - 多重策略
echo "📦 安装依赖..."

# 策略1: 使用 npm ci
if timeout 300 npm ci --no-audit --no-fund --progress=false --loglevel=error; then
    echo "✅ npm ci 成功"
else
    echo "⚠️ npm ci 失败，尝试备用方案..."

    # 策略2: 清理后使用 npm install
    rm -rf node_modules package-lock.json
    if timeout 300 npm install --no-audit --no-fund --progress=false --loglevel=error; then
        echo "✅ npm install 成功"
    else
        echo "❌ 依赖安装失败"
        exit 1
    fi
fi

# 构建项目
echo "🔨 构建项目..."
if npm run build; then
    echo "✅ 构建成功"
else
    echo "❌ 构建失败"
    exit 1
fi

echo "🎉 部署准备完成！"
echo "📁 构建输出目录: dist/"
echo "📊 构建统计:"
du -sh dist/ 2>/dev/null || echo "无法获取构建大小"