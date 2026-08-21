/**
 * 开始为当前浏览器视窗实时更新 favicon。
 * @param interval 截图周期，单位毫秒，默认值为 1000。
 * @param level 图标尺寸：1 = 16px，2 = 32px，3 = 64px，默认值为 2。
 */
export declare function initFavicon(
  interval?: number,
  level?: 1 | 2 | 3
): { stop(): void };
