# Cloudflare Pages 部署指南

本指南将帮助你将宝可梦图鉴项目部署到 Cloudflare Pages。

## 🚀 快速部署步骤

### 方法一：Git 连接自动部署（推荐）

1. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "准备部署到 Cloudflare Pages"
   git push origin main
   ```

2. **在 **Cloudflare** 创建项目**
   - 访问 [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - 点击左侧菜单 "Pages"
   - 点击 "创建项目"
   - 选择 "连接到 Git"

3. **选择仓库**
   - 授权 Cloudflare 访问你的 GitHub
   - 选择 `pokemon-pokedex` 仓库
   - 点击 "开始设置"

4. **配置构建设置**
   ```
   项目名称: pokemon-pokedex
   生产分支: main
   框架预设: Vite
   构建命令: npm ci --legacy-peer-deps && npm run build
   构建输出目录: dist
   ```

5. **高级设置**
   - Node.js 版本: `18`
   - 环境变量:
     ```
     NODE_VERSION=18
     NPM_VERSION=10
     NODE_OPTIONS=--max-old-space-size=4096
     ```

6. **部署**
   - 点击 "保存并部署"
   - 等待构建完成（通常需要 2-5 分钟）

### 方法二：Wrangler CLI 部署

1. **安装 Wrangler**
   ```bash
   npm install -g wrangler
   ```

2. **登录 Cloudflare**
   ```bash
   wrangler login
   ```

3. **构建项目**
   ```bash
   npm run build
   ```

4. **创建 Pages 项目**
   ```bash
   wrangler pages project create pokemon-pokedex
   ```

5. **部署**
   ```bash
   wrangler pages deploy dist --project-name=pokemon-pokedex
   ```

## ⚙️ 部署优化配置

### 1. 创建 `_headers` 文件

在 `public` 目录下创建 `_headers` 文件来优化缓存：

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/*.js
  Cache-Control: public, max-age=31536000, immutable

/*.css
  Cache-Control: public, max-age=31536000, immutable

/*.png
  Cache-Control: public, max-age=31536000, immutable

/*.jpg
  Cache-Control: public, max-age=31536000, immutable

/*.svg
  Cache-Control: public, max-age=31536000, immutable
```

### 2. 创建 `_redirects` 文件

在 `public` 目录下创建 `_redirects` 文件来处理 SPA 路由：

```
/*    /index.html   200
```

### 3. 环境变量配置

如果项目需要环境变量，在 Cloudflare Pages 设置中添加：

- `NODE_VERSION`: `18`
- `NPM_VERSION`: `latest`

## 🔧 常见问题解决

### 构建失败

1. **Node.js 版本问题**
   - 确保使用 Node.js 16+ 版本
   - 在环境变量中设置 `NODE_VERSION=18`

2. **依赖安装失败**
   - 检查 `package.json` 中的依赖版本
   - 删除 `package-lock.json` 重新安装

3. **构建超时**
   - 优化构建脚本
   - 减少不必要的依赖

### 路由问题

1. **404 错误**
   - 确保创建了 `_redirects` 文件
   - 检查路由配置是否正确

2. **静态资源加载失败**
   - 检查 `vite.config.ts` 中的 `base` 配置
   - 确保资源路径正确

### 性能优化

1. **启用压缩**
   - Cloudflare 自动启用 Gzip/Brotli 压缩

2. **CDN 缓存**
   - 静态资源自动缓存到全球 CDN
   - 可在 Cloudflare 设置中调整缓存规则

3. **图片优化**
   - 使用 Cloudflare Images 优化图片
   - 启用 WebP 格式支持

## 📊 部署后监控

### 1. 访问统计

- 在 Cloudflare Analytics 中查看访问数据
- 监控页面加载速度和用户行为

### 2. 错误监控

- 查看 Functions 日志（如果使用）
- 监控 4xx/5xx 错误

### 3. 性能监控

- 使用 Cloudflare Web Analytics
- 监控 Core Web Vitals 指标

## 🌐 自定义域名

### 1. 添加域名

- 在 Pages 项目设置中点击 "自定义域"
- 输入你的域名（如：pokemon.yourdomain.com）

### 2. DNS 配置

- 添加 CNAME 记录指向 Cloudflare Pages
- 或使用 Cloudflare 作为 DNS 服务商

### 3. SSL 证书

- Cloudflare 自动提供免费 SSL 证书
- 支持通配符证书

## 🔄 自动部署

### GitHub Actions 集成

每次推送到主分支时自动部署：

```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: pokemon-pokedex
          directory: dist
```

## 📞 获取帮助

如果遇到部署问题：

1. 查看 [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
2. 检查构建日志中的错误信息
3. 在项目 Issues 中提问
4. 联系 Cloudflare 支持

---

🎉 部署成功后，你的宝可梦图鉴将在全球 CDN 上运行，享受极快的访问速度！