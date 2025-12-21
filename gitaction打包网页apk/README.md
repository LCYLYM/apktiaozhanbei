# 网页打包 APK（GitHub Actions）

这套方案是“最少改动”：仓库代码不需要增加 Capacitor 配置文件；在 CI 里临时生成 `capacitor.config.json`，把 Vite 的 `dist/` 当作本地资源打进 APK。

## 关键事实（别自欺欺人版）

- GitHub Actions **只会**加载 `.github/workflows/` 下的 YAML。
- 所以本目录里的 [build-android-apk.yml](build-android-apk.yml) 是**模板**，要复制到 `.github/workflows/build-android-apk.yml` 才能跑。
- 输出的是 `assembleDebug` 生成的 `app-debug.apk`：它是 **debug 签名**（Android 安装必须签名），但**不是**你的发布签名/证书。

## 怎么启用

1. 在仓库根目录创建 `.github/workflows/`（如果没有）。
2. 复制本文件：
   - `gitaction打包网页apk/build-android-apk.yml` → `.github/workflows/build-android-apk.yml`
3. 推送到 GitHub（默认在 `main` 分支 push 会触发；也支持手动触发 `workflow_dispatch`）。

## 产物在哪里

- Actions 运行完成后，在 job 的 **Artifacts** 里下载：`app-debug-apk`
- 对应文件路径：`android/app/build/outputs/apk/debug/app-debug.apk`

## 关于你给的 URL

你提到的 `http://22.gaistudio.dev.aiforme.site/`：
- 这个流程 **不会**把 WebView 指向远程 URL。
- 它只把本仓库 `npm run build` 生成的 `dist/`（本地静态资源）打包进 APK。

如果你真要“只加载远程网页”，那是另一个模式（Capacitor `server.url`），但那会让离线不可用，也不是你这次说的“本地网页访问”。
