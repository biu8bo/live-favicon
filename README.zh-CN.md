# live-favicon

[中文](README.zh-CN.md) | [English](README.md)

`live-favicon` 会持续截取浏览器当前可见视窗，压缩后将结果设为浏览器标签页图标。它仅适用于浏览器环境，且只暴露一个公开方法：`initFavicon`。

[打开在线演示](https://biu8bo.github.io/live-favicon/)

## 安装

```bash
npm install live-favicon
```

## 使用方法

### ESM

Vite、Webpack、Rollup 等打包器会自动解析 ESM 入口。

```js
import { initFavicon } from 'live-favicon';

const controller = initFavicon();
// controller.stop(); // 停止更新并还原原始 favicon
```

### 直接使用 script 标签

将 `dist/live-favicon.iife.js` 复制到静态资源目录后引入。唯一的全局变量是 `LiveFavicon`，其唯一方法为 `initFavicon`。

```html
<script src="/assets/live-favicon.iife.js"></script>
<script>
  const controller = LiveFavicon.initFavicon();
  // controller.stop();
</script>
```

## API

```js
initFavicon(interval = 1000, level = 2)
```

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `interval` | `1000` | 更新周期，单位为毫秒。非法值或非正数会回退为 `1000`。 |
| `level` | `2` | PNG favicon 的输出尺寸：`1` 为 16x16，`2` 为 32x32，`3` 为 64x64。非法值会回退为 `2`。 |

方法返回的控制器提供 `stop()`。调用后会取消后续任务，并还原原有图标；如果图标标签由本库创建，则会移除该标签。

## 工作原理

本库使用 [modern-screenshot](https://github.com/qq15725/modern-screenshot) 渲染 `document.documentElement`，结合当前滚动偏移并裁剪到 `window.innerWidth` 与 `window.innerHeight`，从而获得当前可见视窗。之后用 Canvas 或 OffscreenCanvas 将截图压缩为 16x16、32x32 或 64x64 像素。64x64 是最大等级，因为它仍处于浏览器普遍接受的 favicon 尺寸范围内。

最终的 `data:image/png;base64,...` 会赋给页面中第一个已有的 `<link rel="icon">`；若不存在，则在 `<head>` 中动态创建一个。PNG 是无损格式，现代浏览器普遍支持，且可直接作为自包含 data URL 使用，不需要额外请求服务器资源。

## 性能

更新任务会先等待设定的周期，再在 `requestAnimationFrame` 中启动 DOM 与 Canvas 工作。截图任务不会重叠，最终图标 Canvas 最大只有 64x64，因此缩放和 PNG 编码成本很低。在中等配置机器和普通复杂度页面上，单次截图、压缩、设置图标的目标总耗时为 **50 ms 以内**。实际截图耗时主要受页面复杂度、字体和图像数量影响；对高开销页面可增大 `interval` 或选择 `level` 为 `1`。当 `document.hidden` 为 `true` 时，本库会自动暂停；标签页恢复可见后会立即安排一次更新。

## 浏览器兼容性与已知限制

- 当前版本的 Chromium、Firefox 和 Safari 均支持在普通网页上下文中动态修改 favicon 链接。部分浏览器界面会缓存旧图标，因此标签栏、固定标签、历史记录、书签和应用快捷方式可能延迟更新或完全不更新。Safari 对动态 favicon 的缓存历来比 Chromium 和 Firefox 更积极。
- `modern-screenshot` 依赖浏览器 DOM 与 Canvas 能力，本库不支持 SSR。请仅在客户端代码中初始化。
- 跨域图像、CSS 资源、字体或 iframe 内容可能污染 Canvas，或使 DOM 渲染失败。导出失败会被捕获并静默跳过本次更新，之后的定时任务仍会继续运行。
- 截图保真度受浏览器 DOM/Canvas 和同源策略限制。页面非常大或图形结构非常复杂时，单次任务可能无法满足 50 ms 目标。

## 开发与构建

```bash
npm install
npm run build
npm test
```

`npm run build` 从同一个 `src/index.js` 入口生成两份产物：

- `dist/live-favicon.esm.js`：具名 ESM 导出 `initFavicon`
- `dist/live-favicon.iife.js`：通过 script 标签使用的全局方法 `LiveFavicon.initFavicon`
- `dist/index.d.ts`：ESM 包入口对应的 TypeScript 类型声明

## GitHub Pages 演示部署

仓库在 `docs/` 中提供了静态的中英文演示页。每次构建都会将 IIFE 与 ESM 浏览器产物复制到 `docs/assets/`，因此 GitHub Pages 无需额外构建即可直接运行。

进入仓库的 **Settings > Pages**，选择 **Deploy from a branch**，然后选择 `main` 分支与 `/docs` 目录。部署完成后，演示页地址为 `https://biu8bo.github.io/live-favicon/`。
