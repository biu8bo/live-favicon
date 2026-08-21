import { domToPng } from 'modern-screenshot';

/**
 * modern-screenshot 渲染的是文档克隆体；通过偏移使其左上角对应当前
 * 视窗，而不是整张页面。
 */
export function captureViewport() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const x = window.scrollX;
  const y = window.scrollY;

  return domToPng(document.documentElement, {
    width,
    height,
    backgroundColor: getComputedStyle(document.body).backgroundColor,
    style: {
      transform: `translate(${-x}px, ${-y}px)`,
      transformOrigin: 'top left',
      width: `${document.documentElement.scrollWidth}px`,
      height: `${document.documentElement.scrollHeight}px`
    }
  });
}
