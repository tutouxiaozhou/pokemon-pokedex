# 构建故障排除指南

本文档帮助解决 Cloudflare Pages 部署过程中遇到的常见问题。

## 🚨 常见构建错误及解决方案

### 1. npm 安装失败

**错误信息**:
```
npm error Exit handler never called!
npm error This is an error with npm itself.
```

**解决方案**:

#### 方法一：更新 Cloudflare Pages 构建设置
在 Cloudflare Pages 项目设置中：
- **构建命令**: `npm ci --legacy-peer-deps --no-audit --no-fund && npm run build`
- **Node.js 版本**: `20`
- **环境变量**:
  ```
  NODE_VERSION=20
  NPM_VERSION=10
  NODE_OPTIONS=--max-old-space-size=4096
  ```

#### 方法二：使用自定义构建脚本
将构建命令改为：
```bash
chmod +x build.sh && ./build.sh
```

### 2. 构建命令配置错误

**错误信息**:
```
Build command failed
```

**解决方案**:
在 Cloudflare Pages 设置中使用正确的构建命令：
```bash
npm ci --legacy-peer-deps --no-audit --no-fund && npm run build
```

确保构建设置：
- 框架预设: Vite
- 构建输出目录: dist
- Node.js 版本: 18

### 3. 依赖版本冲突

**错误信息**:
```
ERESOLVE unable to resolve dependency tree
```

**解决方案**:
1. 使用 `--legacy-peer-deps` 标志
2. 检查 `.npmrc` 文件配置
3. 清理 package-lock.json：
   ```bash
   rm package-lock.json
   npm install
   ```

### 4. 内存不足错误

**错误信息**:
```
JavaScript heap out of memory
```

**解决方案**:
添加环境变量：
```
NODE_OPTIONS=--max-old-space-size=4096
```

### 5. TypeScript 编译错误

**错误信息**:
```
Type error: Cannot find module
```

**解决方案**:
1. 检查 `tsconfig.json` 配置
2. 确保所有类型定义已安装
3. 临时跳过类型检查：
   ```json
   {
     "scripts": {
       "build": "vite build --mode production"
     }
   }
   ```

## 🔧 推荐的构建配置

### Cloudflare Pages 设置

```
框架预设: Vite
构建命令: npm ci --legacy-peer-deps --no-audit --no-fund && npm run build
构建输出目录: dist
Node.js 版本: 18
```

### 环境变量

```
NODE_VERSION=18
NPM_VERSION=10
NODE_OPTIONS=--max-old-space-size=4096
CI=true
```

### 构建优化

1. **启用缓存**:
   ```bash
   # 在构建命令前添加
   npm config set cache /opt/buildhome/.npm
   ```

2. **并行构建**:
   ```json
   {
     "scripts": {
       "build": "vite build --mode production --minify esbuild"
     }
   }
   ```

3. **减少依赖**:
   - 移除不必要的 devDependencies
   - 使用 `npm ci` 而不是 `npm install`

## 📊 构建性能优化

### 1. 减少构建时间

```bash
# 使用更快的包管理器
npm config set prefer-offline true
npm config set progress false
npm config set audit false
npm config set fund false
```

### 2. 优化 Vite 配置

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    target: 'es2015',
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu']
        }
      }
    }
  }
})
```

### 3. 启用构建缓存

在 Cloudflare Pages 设置中启用构建缓存：
- 缓存 `node_modules`
- 缓存 `.npm` 目录

## 🐛 调试构建问题

### 1. 本地测试构建

```bash
# 清理环境
rm -rf node_modules package-lock.json dist

# 重新安装依赖
npm install --legacy-peer-deps

# 本地构建测试
npm run build

# 预览构建结果
npm run preview
```

### 2. 查看详细日志

在 Cloudflare Pages 构建设置中启用详细日志：
```
DEBUG=*
VERBOSE=true
```

### 3. 分步构建

将构建过程分解为多个步骤：
```bash
# 步骤1：清理
npm cache clean --force

# 步骤2：安装
npm ci --legacy-peer-deps

# 步骤3：类型检查
npm run lint

# 步骤4：构建
npm run build
```

## 📞 获取帮助

如果问题仍然存在：

1. **检查构建日志** - 查看完整的错误信息
2. **本地复现** - 在本地环境中重现问题
3. **简化配置** - 临时移除复杂配置
4. **社区求助** - 在 GitHub Issues 中提问

## 🎯 快速修复清单

- [ ] 检查 Node.js 版本 (推荐 18)
- [ ] 使用 `--legacy-peer-deps` 标志
- [ ] 设置正确的环境变量
- [ ] 清理 npm 缓存
- [ ] 检查 `.npmrc` 配置
- [ ] 验证 `wrangler.toml` 格式
- [ ] 本地测试构建过程
- [ ] 检查依赖版本兼容性

---

💡 **提示**: 大多数构建问题都与依赖管理和 Node.js 版本相关。确保使用推荐的配置通常能解决 90% 的问题。