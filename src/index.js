import { captureViewport } from './capture.js';
import { compressToPng } from './compress.js';
import { DEFAULT_INTERVAL, DEFAULT_LEVEL, ICON_SIZES } from './constants.js';
import { createFaviconManager } from './favicon.js';

const VERSION = '1.0.1';
const REPOSITORY_URL = 'https://github.com/biu8bo/live-favicon';
let introductionPrinted = false;

function printIntroduction() {
  if (introductionPrinted || typeof console === 'undefined') {
    return;
  }

  introductionPrinted = true;
  console.info(
    `%c live-favicon %c v${VERSION} `,
    'background: #e56b8d; color: #ffffff; padding: 4px 12px; font: 700 14px monospace;',
    'background: #f0a3a8; color: #ffffff; padding: 4px 12px; font: 700 14px monospace;'
  );
  console.info(`GitHub: ${REPOSITORY_URL}`);
}

function normalizeInterval(value) {
  return Number.isFinite(value) && value > 0 ? value : DEFAULT_INTERVAL;
}

function normalizeLevel(value) {
  return Object.hasOwn(ICON_SIZES, value) ? value : DEFAULT_LEVEL;
}

/**
 * 持续截取可见视窗，并将其显示为 PNG favicon。
 * 导出失败会被静默忽略，包括跨域资源导致中间 Canvas 无法导出的情况。
 */
export function initFavicon(interval = DEFAULT_INTERVAL, level = DEFAULT_LEVEL) {
  const delay = normalizeInterval(interval);
  const iconSize = ICON_SIZES[normalizeLevel(level)];
  const favicon = createFaviconManager();
  printIntroduction();
  let active = true;
  let timerId = null;
  let frameId = null;
  let updating = false;

  const schedule = () => {
    if (!active || document.hidden) {
      return;
    }

    timerId = window.setTimeout(() => {
      timerId = null;
      frameId = window.requestAnimationFrame(update);
    }, delay);
  };

  const update = async () => {
    frameId = null;
    if (!active || document.hidden || updating) {
      schedule();
      return;
    }

    updating = true;
    try {
      const viewportPng = await captureViewport();
      const faviconPng = await compressToPng(viewportPng, iconSize);
      if (active && !document.hidden) {
        favicon.set(faviconPng);
      }
    } catch {
      // Canvas 被污染或缺少 DOM 能力时，仅跳过本次更新。
    } finally {
      updating = false;
      schedule();
    }
  };

  const onVisibilityChange = () => {
    if (!document.hidden && active && timerId === null && frameId === null && !updating) {
      frameId = window.requestAnimationFrame(update);
    }
  };

  document.addEventListener('visibilitychange', onVisibilityChange);
  frameId = window.requestAnimationFrame(update);

  return {
    stop() {
      if (!active) {
        return;
      }

      active = false;
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (timerId !== null) {
        window.clearTimeout(timerId);
      }
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
      favicon.restore();
    }
  };
}
