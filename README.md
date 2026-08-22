# live-favicon

[English](README.md) | [中文](README.zh-CN.md)

`live-favicon` repeatedly captures the browser's current viewport, downsizes it,
and uses the result as the tab favicon. It is a browser-only library and exposes
one public method: `initFavicon`.

[Open the live demo](https://biu8bo.github.io/live-favicon/)

## Install

```bash
npm install live-favicon
```

## Usage

### ESM

Bundlers such as Vite, Webpack, and Rollup resolve the ESM entry automatically.

```js
import { initFavicon } from 'live-favicon';

const controller = initFavicon();
// controller.stop(); // stop updates and restore the original favicon
```

### Direct script tag

Copy `dist/live-favicon.iife.js` to a publicly served directory, then load it.
The only global is `LiveFavicon`, whose only method is `initFavicon`.

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

| Parameter | Default | Meaning |
| --- | --- | --- |
| `interval` | `1000` | Milliseconds between updates. Invalid or non-positive values fall back to `1000`. |
| `level` | `2` | PNG favicon output size: `1` is 16x16, `2` is 32x32, and `3` is 64x64. Invalid values fall back to `2`. |

The returned controller has `stop()`. It cancels future work and restores the
original icon, or removes the icon tag that the library created.

## How it works

The library uses [modern-screenshot](https://github.com/qq15725/modern-screenshot)
to render `document.documentElement` with the current scroll offset, clipped to
`window.innerWidth` and `window.innerHeight`. The resulting viewport PNG is then
downscaled on a Canvas or OffscreenCanvas to 16x16, 32x32, or 64x64 pixels.
64x64 is the largest level because it remains within the commonly supported
favicon size limit.

The final `data:image/png;base64,...` URL is assigned to the first existing
`<link rel="icon">`; if none exists, the library creates one in `<head>`. PNG is
used because it is lossless, universally understood by current browsers, and
works directly as a self-contained data URL without a server round trip.

## Performance

Updates are requested after the configured interval and their DOM/canvas work is
started in `requestAnimationFrame`. Captures never overlap. The icon canvas is at
most 64x64, so final resize and PNG encoding are deliberately small. On a
middle-tier machine and an ordinary-complexity page, the target for one capture,
compression, and favicon assignment is **50 ms or less**. Actual capture time is
dominated by page complexity and fonts/images: for expensive pages, increase
`interval` or choose level `1`. The library automatically pauses while
`document.hidden` is true and schedules an immediate update when the tab becomes
visible again.

## Browser support and limitations

- Current Chromium, Firefox, and Safari support dynamically changing a favicon
  link in normal browsing contexts. Some browser UI surfaces cache the old icon,
  so tab strips, pinned tabs, history, bookmarks, and application shortcuts may
  update late or not at all. Safari has historically cached dynamic favicons more
  aggressively than Chromium and Firefox.
- `modern-screenshot` requires browser DOM and canvas features; this package does
  not run during SSR. Initialize it only in client-side code.
- Cross-origin images, CSS assets, fonts, or iframe content can make a canvas
  tainted or prevent a DOM render. A failed export is caught and that update is
  silently skipped; later updates keep running.
- Screenshot fidelity follows the browser's DOM/canvas and same-origin rules.
  Very large or graphically complex pages may exceed the 50 ms target.

## Development

```bash
npm install
npm run build
npm test
```

`npm run build` produces both distributions from the same `src/index.js` entry:

- `dist/live-favicon.esm.js`: named ESM export, `initFavicon`
- `dist/live-favicon.iife.js`: script-tag global, `LiveFavicon.initFavicon`
- `dist/index.d.ts`: TypeScript declaration for the ESM package entry
