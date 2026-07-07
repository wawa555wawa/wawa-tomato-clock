# Wawa 番茄钟

一款支持桌面端与移动端的番茄钟 PWA 应用。专注、短休、长休三种模式循环,专注计数自动触发长休,可自定义时长,主题切换(深色/浅色),统计面板一目了然。

## 功能

- 专注/短休/长休三种模式,计时结束自动切换
- 每完成设定次数专注自动触发一次长休
- 自定义每种模式的时长(分钟)
- 自定义时长:暂停状态下点击时钟数字可直接输入
- 深色 / 浅色主题切换,选择持久化到 localStorage
- 计时结束可选铃声提示、桌面通知
- 统计面板:今日/累计番茄数与分钟、近 7 天柱状图
- PWA:可安装到桌面/主屏,离线可用
- 响应式布局:适配手机、平板、桌面

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

开发服务器默认监听 `http://localhost:5173/`。

## 技术栈

- React 18 + TypeScript
- Vite
- vite-plugin-pwa (Workbox)
- 无 UI 框架,纯 CSS 手写样式

## 项目结构

```
src/
  App.tsx              # 主组件:计时逻辑、主题、模态框
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
    sound.ts             # 铃声播放(解锁 Audio)
    notify.ts            # 桌面通知
  styles/
    global.css           # 全部样式(含深色/浅色主题)
```

## 数据

所有数据(设置、主题偏好、历史记录)存储在浏览器 `localStorage` 中,无后端、无追踪。
