/** 查找页面中第一个标准 favicon 声明。 */
function findIconLink() {
  return document.querySelector('link[rel~="icon"]');
}

/** 保存足够的 DOM 状态，以便准确还原原始 favicon。 */
export function createFaviconManager() {
  let link = findIconLink();
  const created = !link;
  const originalHref = link ? link.getAttribute('href') : null;

  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }

  return {
    set(href) {
      link.href = href;
    },
    restore() {
      if (created) {
        link.remove();
        return;
      }

      if (originalHref === null) {
        link.removeAttribute('href');
      } else {
        link.setAttribute('href', originalHref);
      }
    }
  };
}
