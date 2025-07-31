# 宝可梦图鉴 (Pokémon Pokédex)

一个基于 React + TypeScript + Vite 构建的现代化宝可梦图鉴应用，提供完整的宝可梦信息查询、收藏和对比功能。

## ✨ 功能特性

- 🔍 **智能搜索** - 支持按名称、类型、能力等多维度搜索宝可梦
- 📱 **响应式设计** - 完美适配桌面端和移动端设备
- ❤️ **收藏系统** - 收藏你喜欢的宝可梦，本地存储永不丢失
- ⚖️ **对比功能** - 并排对比不同宝可梦的属性和能力
- 🎨 **现代化UI** - 基于 shadcn/ui 组件库的精美界面
- 🌙 **主题切换** - 支持明暗主题切换
- 📊 **详细信息** - 展示宝可梦的属性、能力、进化链等完整信息

## 🚀 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式方案**: Tailwind CSS
- **UI组件**: shadcn/ui
- **路由管理**: React Router DOM
- **状态管理**: React Hooks
- **数据源**: PokéAPI
- **图标库**: Lucide React

## 📦 安装与运行

### 环境要求

- Node.js >= 16.0.0
- npm 或 yarn

### 安装依赖

```bash
# 克隆项目
git clone https://github.com/yourusername/pokemon-pokedex.git
cd pokemon-pokedex

# 安装依赖
npm install
# 或
yarn install
```

### 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

访问 `http://localhost:5173` 查看应用。

### 构建生产版本

```bash
npm run build
# 或
yarn build
```

构建文件将生成在 `dist` 目录中。

## 📁 项目结构

```
pokemon-pokedex/
├── public/                 # 静态资源
├── src/
│   ├── components/         # 可复用组件
│   │   ├── ui/            # shadcn/ui 组件
│   │   └── theme-provider.tsx
│   ├── hooks/             # 自定义 Hooks
│   │   ├── usePokemonData.ts
│   │   └── use-toast.ts
│   ├── lib/               # 工具函数
│   │   └── utils.ts
│   ├── pages/             # 页面组件
│   │   ├── home-page.tsx
│   │   ├── search-page-with-api.tsx
│   │   ├── pokemon-detail-page.tsx
│   │   ├── favorites-page.tsx
│   │   └── compare-page.tsx
│   ├── services/          # API 服务
│   │   └── pokemonApi.ts
│   ├── App.tsx            # 主应用组件
│   ├── layout.tsx         # 布局组件
│   ├── main.tsx           # 应用入口
│   └── globals.css        # 全局样式
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── README.md
```

## 🎮 使用指南

### 主要页面

1. **首页** - 展示热门宝可梦和快速搜索入口
2. **搜索页面** - 提供高级搜索功能，支持多种筛选条件
3. **详情页面** - 显示宝可梦的完整信息，包括属性、能力、进化等
4. **收藏页面** - 管理你收藏的宝可梦
5. **对比页面** - 对比不同宝可梦的属性差异

### 核心功能

#### 搜索宝可梦
- 在搜索框中输入宝可梦名称
- 使用筛选器按类型、世代等条件筛选
- 点击搜索结果查看详细信息

#### 收藏管理
- 在宝可梦详情页点击收藏按钮
- 在收藏页面查看和管理收藏的宝可梦
- 收藏数据保存在本地存储中

#### 宝可梦对比
- 在详情页或搜索结果中选择要对比的宝可梦
- 在对比页面查看属性对比图表
- 支持同时对比多个宝可梦

## 🔧 开发指南

### 添加新页面

1. 在 `src/pages/` 目录下创建新的页面组件
2. 在 `src/App.tsx` 中添加路由配置
3. 在导航组件中添加链接

### 自定义主题

项目使用 Tailwind CSS 和 shadcn/ui，可以通过以下方式自定义主题：

1. 修改 `tailwind.config.ts` 中的颜色配置
2. 更新 `src/globals.css` 中的 CSS 变量
3. 使用 `ThemeProvider` 管理主题状态

### API 集成

项目使用 PokéAPI 作为数据源，相关配置在 `src/services/pokemonApi.ts` 中：

```typescript
// 获取宝可梦列表
const pokemonList = await fetchPokemonList(limit, offset);

// 获取宝可梦详情
const pokemonDetail = await fetchPokemonDetail(id);
```

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [PokéAPI](https://pokeapi.co/) - 提供宝可梦数据
- [shadcn/ui](https://ui.shadcn.com/) - 优秀的 UI 组件库
- [Tailwind CSS](https://tailwindcss.com/) - 实用的 CSS 框架
- [Lucide](https://lucide.dev/) - 精美的图标库

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 [Issue](https://github.com/yourusername/pokemon-pokedex/issues)

---

⭐ 如果这个项目对你有帮助，请给它一个星标！