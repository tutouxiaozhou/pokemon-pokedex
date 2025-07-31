# Cloudflare Pages 部署指南

## 问题描述
Cloudflare Pages 构建时在 npm 安装依赖阶段卡住，通常表现为：
- npm clean-install 命令执行时间过长
- 构建过程在依赖安装阶段超时
- 网络连接问题导致的包下载失败

## 解决方案

### 1. 优化的 .npmrc 配置
已更新 `.npmrc` 文件，包含以下优化：
- 使用官方 npm 注册表（在 Cloudflare 网络环境下更稳定）
- 增加网络超时时间和重试次数
- 控制并发连接数避免网络拥塞
- 禁用可选依赖和审计功能

### 2. 改进的构建脚本
更新了 `build.sh` 脚本：
- 添加超时控制（600秒）
- 提供 npm ci 失败时的备用方案
- 清理缓存和临时文件
- 设置适当的环境变量

### 3. Cloudflare Pages 配置
创建了 `wrangler.toml` 配置文件：
- 指定构建命令和输出目录
- 配置文件类型规则
- 优化资源处理

### 4. Package.json 优化
添加了专门的构建脚本：
- `build:cf`: 专门用于 Cloudflare Pages 的构建命令
- 增加内存限制和生产模式构建

## Cloudflare Pages 部署设置

### 构建配置
在 Cloudflare Pages 控制台中设置：

**构建命令**: `npm run build:cf`
**构建输出目录**: `dist`
**Node.js 版本**: `20.19.2`

### 环境变量
在 Cloudflare Pages 设置中添加：
```
NODE_OPTIONS=--max-old-space-size=4096
NPM_CONFIG_PROGRESS=false
NPM_CONFIG_AUDIT=false
NPM_CONFIG_FUND=false
```

### 替代方案
如果问题仍然存在，可以尝试：

1. **使用 Yarn 替代 npm**:
   ```bash
   # 在项目根目录添加 yarn.lock
   yarn install --frozen-lockfile
   yarn build
   ```

2. **使用 pnpm**:
   ```bash
   # 构建命令改为
   pnpm install --frozen-lockfile && pnpm build
   ```

3. **手动清理依赖**:
   删除 `package-lock.json` 和 `node_modules`，重新生成锁文件

## 常见问题排查

### 1. 依赖安装超时
- 检查网络连接
- 尝试使用不同的 npm 注册表
- 减少并发安装数量

### 2. 内存不足
- 增加 Node.js 内存限制
- 优化构建过程
- 移除不必要的依赖

### 3. 构建失败
- 检查 TypeScript 类型错误
- 确保所有依赖版本兼容
- 查看详细的构建日志

## 监控和调试

### 查看构建日志
在 Cloudflare Pages 控制台中：
1. 进入项目设置
2. 查看部署历史
3. 点击失败的部署查看详细日志

### 本地测试
在本地环境中模拟 Cloudflare 构建：
```bash
# 清理环境
rm -rf node_modules package-lock.json dist

# 使用相同的命令构建
npm run build:cf
```

## 更新日志
- 2025-01-31: 优化 npm 配置和构建脚本
- 2025-01-31: 添加 wrangler.toml 配置
- 2025-01-31: 创建专用构建命令