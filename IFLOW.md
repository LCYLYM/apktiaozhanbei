# 智语通 (ZhiYuTong) 项目文档

## 项目概述

智语通是一款面向在华外国人的应急翻译助手应用，支持医疗、警务等多种紧急场景的多语言沟通。

### 核心功能

- **AI 翻译助手**：基于 Google Gemini 2.5 Flash 模型，提供实时文本和图像翻译
- **离线应急词典**：包含医疗、警务场景的常用短语多语言对照（支持 12 种语言）
- **SOS 工具**：紧急情况下的快速求助功能
- **用户档案管理**：存储血型、过敏史、保险信息等个人医疗信息
- **订阅系统**：个人/企业/政府三种订阅方案，支持本地存储管理

### 技术栈

- **前端框架**：React 19.2.1 + TypeScript 5.8.2
- **构建工具**：Vite 6.2.0
- **UI 组件**：Lucide React 图标库
- **AI 服务**：Google Generative AI (@google/genai)
- **打包插件**：vite-plugin-singlefile（单文件输出）
- **移动端打包**：Capacitor（通过 GitHub Actions 构建 Android APK）

### 项目结构

```
├── components/          # React 组件
│   ├── AiAssistant.tsx  # AI 翻译助手界面
│   ├── BentoGrid.tsx    # 主仪表盘（网格布局）
│   ├── Checkout.tsx     # 订阅支付流程
│   ├── OfflineMode.tsx  # 离线医疗词典
│   ├── OfflinePolice.tsx # 离线警务词典
│   ├── Pricing.tsx      # 订阅方案展示
│   ├── Profile.tsx      # 用户档案管理
│   └── SosTools.tsx     # SOS 工具
├── services/            # 业务逻辑服务
│   ├── geminiService.ts      # Gemini AI 调用
│   ├── openaiCompatService.ts # OpenAI 兼容接口
│   └── subscriptionService.ts # 订阅状态管理
├── types.ts             # TypeScript 类型定义
├── constants.ts         # 常量配置（词典、订阅方案等）
├── App.tsx              # 主应用组件（路由、状态管理）
├── index.tsx            # 应用入口
└── vite.config.ts       # Vite 构建配置
```

## 构建和运行

### 开发环境

```bash
# 安装依赖
npm install

# 启动开发服务器（端口 3000）
npm run dev
```

### 生产构建

```bash
# 构建生产版本（输出到 dist/ 目录）
npm run build

# 预览生产构建
npm run preview
# 或
npm start
```

### 环境变量配置

应用需要配置 Google Gemini API Key：

**方式 1：环境变量**
```bash
# 创建 .env 文件
VITE_API_KEY=your_gemini_api_key_here
```

**方式 2：系统环境变量**
```bash
GEMINI_API_KEY=your_gemini_api_key_here
API_KEY=your_gemini_api_key_here
```

### Android APK 构建

项目使用 GitHub Actions 自动构建 Android APK：

1. 确保 `.github/workflows/build-android-apk.yml` 存在
2. 推送到 `main` 分支或手动触发 workflow_dispatch
3. 构建完成后在 Actions Artifacts 下载 `app-debug.apk`

**注意**：当前生成的是 debug 签名 APK，仅用于测试。发布版本需要配置正式签名证书。

## 开发规范

### 代码风格

- 使用 TypeScript 严格模式
- React 函数组件 + Hooks
- 组件文件使用 PascalCase 命名（如 `AiAssistant.tsx`）
- 服务文件使用 camelCase 命名（如 `geminiService.ts`）

### 状态管理

- 使用 React `useState` 管理本地状态
- 使用 `localStorage` 持久化用户档案和订阅状态
- 应用导航使用 History API + 自定义栈管理（支持双击退出）

### 路由和视图

应用使用自定义视图状态枚举 `ViewState` 管理页面切换：

```typescript
enum ViewState {
  DASHBOARD,      // 主仪表盘
  OFFLINE_MEDICAL, // 离线医疗词典
  OFFLINE_POLICE,  // 离线警务词典
  AI_CENTER,      // AI 助手
  SOS_TOOLS,      // SOS 工具
  PROFILE,        // 用户档案
  PRICING,        // 订阅方案
  CHECKOUT        // 支付流程
}
```

### API 调用

- 所有 AI 调用通过 `GeminiService` 封装
- 翻译请求返回结构化 JSON：`{ translation, medical_note }`
- 图像分析支持 base64 编码输入

### 离线功能

- 医疗和警务词典预置在 `constants.ts` 中
- 支持的网络状态检测：`navigator.onLine`
- 离线模式下仅显示词典功能，AI 功能需要网络

### 订阅系统

- 订阅状态存储在 `localStorage`（key: `zhiyutong_subscription_v1`）
- 三种方案：`personal`（¥19/月）、`enterprise`（¥199/月）、`government`（定制）
- 企业/政府方案支持多账号管理（本地存储）

### 构建配置

- 使用 `vite-plugin-singlefile` 将所有资源内联为单个 HTML 文件
- 资源内联限制：100MB
- CSS 不拆分，动态导入内联

## 测试

当前项目未配置自动化测试框架。建议添加：

```bash
# 安装测试依赖
npm install -D vitest @testing-library/react @testing-library/jest-dom

# 运行测试（需配置）
npm run test
```

## 已知问题和限制

1. **APK 签名**：当前生成的 APK 使用 debug 签名，无法直接发布到应用商店
2. **测试覆盖**：缺少单元测试和集成测试
3. **API Key 安全**：生产环境应使用后端代理，避免前端暴露 API Key
4. **离线 AI**：当前 AI 功能需要网络连接，不支持完全离线模式

## 部署说明

### Web 部署

构建产物为单文件 HTML，可直接部署到任何静态托管服务：

```bash
npm run build
# 将 dist/index.html 部署到服务器
```

### Android 发布

1. 配置正式签名证书（修改 `android/app/build.gradle`）
2. 修改 GitHub Actions workflow 使用 `assembleRelease`
3. 配置应用签名信息

## 相关资源

- [Vite 文档](https://vitejs.dev/)
- [React 文档](https://react.dev/)
- [Capacitor 文档](https://capacitorjs.com/)
- [Google Gemini API](https://ai.google.dev/)