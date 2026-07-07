# Wawa 番茄钟

一款支持桌面端与移动端的番茄钟应用。专注、短休、长休三种模式循环，专注计数自动触发长休，可自定义时长，深色/浅色主题切换，统计面板一目了然。

## 构建产物

| 平台       | 格式 | 路径 |
|-----------|------|------|
| Android   | APK  | `android/app/build/outputs/apk/debug/app-debug.apk` |
| Android   | APK  | `android/app/build/outputs/apk/release/app-release-unsigned.apk` |
| Linux     | DEB  | `src-tauri/target/release/bundle/deb/Wawa 番茄钟_0.1.0_amd64.deb` |
| Linux     | RPM  | `src-tauri/target/release/bundle/rpm/Wawa 番茄钟-0.1.0-1.x86_64.rpm` |
| Windows   | EXE  | 需在 Windows 环境执行 `npx tauri build` |

Android APK 包含前台计时服务通知（锁屏可见、不可划掉）和小米 HyperOS 灵动岛（Super Island）适配。

## 功能

- 专注/短休/长休三种模式，计时结束自动切换
- 每完成设定次数专注自动触发一次长休
- 自定义每种模式的时长（分钟）
- 自定义时长：暂停状态下点击时钟数字可直接输入
- 深色 / 浅色主题切换，选择持久化到 localStorage
- 计时结束可选铃声提示、桌面通知
- 统计面板：今日/累计番茄数与分钟、近 7 天柱状图
- PWA：可安装到桌面/主屏，离线可用
- 响应式布局：适配手机、平板、桌面

## Android 特性

- 前台计时服务：计时器在后台持续运行，通知栏显示剩余时间，不可划掉
- 小米 HyperOS 灵动岛（Super Island）：状态栏胶囊显示计时信息
- 锁屏通知：锁屏界面可见计时状态
- 计时结束本地通知

## 桌面版（Tauri）

独立运行窗口（420x620），不可拉伸、居中显示。`npx tauri build` 打包 DEB/RPM/EXE。

## 快捷键

| 按键 | 操作 |
|------|------|
| `Space` | 开始 / 暂停 |
| `R` | 重置 |
| `1` | 切换到专注 |
| `2` | 切换到短休 |
| `3` | 切换到长休 |

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 类型检查 + 生产构建
npm run build

# 预览生产构建
npm run preview
```

### 桌面打包

```bash
npx tauri build --bundles deb,rpm
```

### Android 打包

```bash
npx cap sync android
cd android && ANDROID_HOME="$HOME/Android/Sdk" ./gradlew assembleDebug
```

开发服务器默认监听 `http://localhost:5173/`。

## 技术栈

- Tauri v2（桌面打包）
- Capacitor（Android 打包，含 local-notifications 插件）
- Android 前台 Service + 小米灵动岛适配（Java）
- React 18 + TypeScript
- Vite
- vite-plugin-pwa (Workbox)
- 无 UI 框架，纯 CSS 手写样式

## 项目结构

```
src/
  App.tsx              # 主组件：计时逻辑、主题、模态框
  types.ts             # 类型定义与模式配置
  main.tsx             # 入口
  components/
    CircularProgress.tsx # 圆环进度与可编辑时长
    Controls.tsx         # 开始/暂停/重置/跳过
    ModeTabs.tsx         # 模式切换标签
    IconBtn.tsx          # SVG 图标按钮
    SettingsModal.tsx    # 设置面板
    StatsModal.tsx       # 统计面板
  hooks/
    useLocalStorage.ts   # localStorage 持久化 Hook
  lib/
    format.ts            # 时间格式化工具
    sound.ts             # 铃声播放（解锁 Audio）
    notify.ts            # 桌面通知
  styles/
    global.css           # 全部样式（含深色/浅色主题）
android/
  app/src/main/java/com/wawa/tomatoclock/
    MainActivity.java            # Capacitor Bridge Activity
    service/
      TomatoTimerService.java    # Android 前台计时服务
      XiaomiDynamicIslandHelper.java  # 小米灵动岛通知扩展
    plugin/                      # Capacitor 本地通知插件
src-tauri/                       # Tauri 桌面打包配置
```

## 数据

所有数据（设置、主题偏好、历史记录）存储在浏览器 `localStorage` 中，无后端、无追踪。
