(function () {
  const text = {
    en: {
      heroLead: 'Make your tab ', heroAccent: 'mirror', heroTail: ' your page.',
      heroCopy: 'This page is being captured every 100 milliseconds, compressed to PNG, and rendered in the browser tab. Scroll it and watch the icon change.',
      stop: 'Stop live capture', start: 'Start live capture', integrationLink: 'Choose an integration', previewAria: 'Live viewport preview', previewTitle: 'Your page, condensed into a living tab icon.',
      running: 'Capturing the viewport and updating the favicon', paused: 'Capture stopped and the original favicon was restored', statusAria: 'Live capture status', refresh: 'DEMO INTERVAL', output: 'ICON OUTPUT', languageLabel: 'Language selector',
      benefitsTitle: 'Small surface. Full control.', benefitsCopy: 'The runtime stays out of sight until your visitor notices the tab. It also backs away when the page is hidden.',
      benefitOneTitle: 'The visible moment', benefitOneCopy: 'The image tracks the current viewport instead of shrinking an entire long document into a tiny square.',
      benefitTwoTitle: 'PNG at the right scale', benefitTwoCopy: 'Choose 16, 32, or 64 pixels. Each output is a self-contained PNG data URL.',
      benefitThreeTitle: 'A clean exit', benefitThreeCopy: 'Call stop() to cancel future work and restore the favicon that existed before initialization.',
      integrationTitle: 'One API. Three ways to load it.', integrationCopy: 'Use the package in an existing build, place one browser file on a static site, or import the ESM file yourself.',
      npmTitle: 'npm package', npmCopy: 'Best for Vite, Webpack, Rollup, and application projects that already use a package manager.',
      scriptTitle: 'Script tag', scriptCopy: 'Best for plain HTML. Load the IIFE file and call the sole global method.',
      moduleTitle: 'Direct ESM', moduleCopy: 'Best for static sites that serve JavaScript modules without an extra bundling step.', readmeLink: 'Read the English README'
    },
    zh: {
      heroLead: '让标签页，', heroAccent: '实时映射', heroTail: '你的页面。',
      heroCopy: '此页面每 100 毫秒截取一次可见视窗，压缩为 PNG 后写入浏览器标签图标。滚动页面，观察图标变化。',
      stop: '停止实时捕捉', start: '启动实时捕捉', integrationLink: '查看接入方式', previewAria: '实时视窗预览', previewTitle: '将你的页面凝缩成一个会变化的标签图标。',
      running: '正在捕捉视窗并更新 favicon', paused: '捕捉已停止，原始 favicon 已恢复', statusAria: '实时捕捉状态', refresh: '演示周期', output: '图标输出', languageLabel: '语言选择',
      benefitsTitle: '极小界面，完整控制。', benefitsCopy: '运行过程隐于页面之后，访客会在标签页看到效果；页面隐藏时，它会自动暂停。',
      benefitOneTitle: '你正在看到的瞬间', benefitOneCopy: '图像跟随当前可见视窗，不会把整张长页面硬塞进一个微小方块。',
      benefitTwoTitle: '正确尺寸的 PNG', benefitTwoCopy: '可选择 16、32 或 64 像素，每个图标都是自包含的 PNG data URL。',
      benefitThreeTitle: '干净地退出', benefitThreeCopy: '调用 stop() 取消后续任务，并恢复初始化前存在的 favicon。',
      integrationTitle: '一个 API，三种加载方式。', integrationCopy: '可在已有构建项目中使用 npm，也可为静态网站部署一个浏览器文件，或直接加载 ESM 文件。',
      npmTitle: 'npm 包', npmCopy: '适用于 Vite、Webpack、Rollup 及已使用包管理器的应用项目。',
      scriptTitle: 'script 标签', scriptCopy: '适用于纯 HTML 页面。加载 IIFE 文件后调用唯一的全局方法即可。',
      moduleTitle: '直接 ESM', moduleCopy: '适用于无需额外打包、但可托管 JavaScript 模块的静态网站。', readmeLink: '阅读中文文档'
    }
  };

  function mount() {
    let language = 'en';
    let controller = window.LiveFavicon.initFavicon(100);
    const toggle = document.querySelector('[data-toggle]');
    const status = document.querySelector('[data-status]');
    const statusText = document.querySelector('[data-status-text]');

    function updateStatus() {
      const running = Boolean(controller);
      const copy = text[language];
      toggle.textContent = copy[running ? 'stop' : 'start'];
      status.classList.toggle('is-paused', !running);
      statusText.textContent = copy[running ? 'running' : 'paused'];
    }

    function translate() {
      const copy = text[language];
      document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
      document.querySelectorAll('[data-i18n]').forEach(element => { element.textContent = copy[element.dataset.i18n]; });
      document.querySelectorAll('[data-i18n-aria]').forEach(element => { element.setAttribute('aria-label', copy[element.dataset.i18nAria]); });
      document.querySelector('[data-readme]').href = language === 'zh' ? '../README.zh-CN.md' : '../README.md';
      document.querySelectorAll('[data-language]').forEach(button => { button.setAttribute('aria-pressed', String(button.dataset.language === language)); });
      updateStatus();
    }

    toggle.addEventListener('click', () => {
      if (controller) {
        controller.stop();
        controller = null;
      } else {
        controller = window.LiveFavicon.initFavicon(100);
      }
      updateStatus();
    });

    document.querySelectorAll('[data-language]').forEach(button => {
      button.addEventListener('click', () => {
        language = button.dataset.language;
        translate();
      });
    });

    translate();
  }

  window.addEventListener('DOMContentLoaded', mount);
})();
