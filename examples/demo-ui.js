(function () {
  const copy = {
    zh: {
      modeIife: '浏览器直引 / IIFE', modeEsm: '模块化导入 / ESM', heroLead: '让标签页，', heroAccent: '实时映射', heroTail: '你的页面。',
      heroCopy: '捕捉当前可见区域，压缩成 PNG，再同步为 favicon。滚动这页，然后看看浏览器标签。', stop: '停止实时捕捉', start: '启动实时捕捉', usageLink: '查看接入方式', previewAria: '当前页面的视窗预览', fakeHeading: '一扇通往页面的微型窗口。',
      running: '正在捕捉视窗并更新 favicon', paused: '已暂停，并恢复原始 favicon', statusAria: '实时运行状态', refresh: '刷新周期', output: '输出尺寸',
      featuresTitle: '小而完整的浏览器能力。', featuresCopy: '页面不可见时自动暂停；发生跨域导出错误时仅跳过当前帧，后续更新不受影响。',
      featureOneTitle: '只截取你看到的部分', featureOneCopy: '按当前滚动位置裁剪，不会把整张长页面塞进 16 到 64 像素的图标。',
      featureTwoTitle: '三档有效尺寸', featureTwoCopy: '从 16x16 到 64x64，统一生成自包含 PNG data URL，无需额外静态资源。',
      featureThreeTitle: '随时恢复原图标', featureThreeCopy: '控制器的 stop() 会取消任务，并将 favicon 恢复为初始化之前的状态。',
      setupEye: 'INTEGRATION', setupTitle: '按你的项目方式接入。', setupCopy: '二选一即可。npm 适合已有构建器的应用；script 标签适合无需构建流程的静态页面。',
      npmTitle: 'npm + ESM', npmCopy: '适用于 Vite、Webpack、Rollup 或任何支持 ES module 的项目。',
      scriptTitle: 'script 标签 + IIFE', scriptCopy: '适用于纯 HTML 页面。部署一个 JS 文件，无需安装包或配置构建器。',
      installLabel: '01 / 安装', importLabel: '02 / 导入并启动', directLabel: '01 / 引入并启动', docs: '阅读中文文档', footerHint: '滚动、切换状态，然后观察此标签页。', languageLabel: '语言切换'
    },
    en: {
      modeIife: 'Direct browser use / IIFE', modeEsm: 'Module import / ESM', heroLead: 'Make your tab ', heroAccent: 'mirror', heroTail: ' your page.',
      heroCopy: 'Capture the visible viewport, compress it to PNG, and sync it as your favicon. Scroll this page, then watch the browser tab.', stop: 'Stop live capture', start: 'Start live capture', usageLink: 'View integration options', previewAria: 'Current page viewport preview', fakeHeading: 'A tiny window into your page.',
      running: 'Capturing the viewport and updating the favicon', paused: 'Paused and restored the original favicon', statusAria: 'Live runtime status', refresh: 'Refresh interval', output: 'Output size',
      featuresTitle: 'Small, complete browser capability.', featuresCopy: 'Updates pause automatically while the page is hidden. Cross-origin export errors skip only the current frame.',
      featureOneTitle: 'Capture only what you see', featureOneCopy: 'Crop at the current scroll position instead of squeezing an entire long page into a 16 to 64 pixel icon.',
      featureTwoTitle: 'Three valid sizes', featureTwoCopy: 'Generate a self-contained PNG data URL at 16x16, 32x32, or 64x64 without additional static assets.',
      featureThreeTitle: 'Restore the original icon', featureThreeCopy: 'The controller stop() method cancels work and restores the favicon state present before initialization.',
      setupEye: 'INTEGRATION', setupTitle: 'Connect it the way your project works.', setupCopy: 'Choose one path. npm suits applications with a bundler; a script tag suits static pages without a build step.',
      npmTitle: 'npm + ESM', npmCopy: 'For Vite, Webpack, Rollup, or any project that supports ES modules.',
      scriptTitle: 'script tag + IIFE', scriptCopy: 'For plain HTML. Serve one JavaScript file with no package install or bundler setup.',
      installLabel: '01 / Install', importLabel: '02 / Import and start', directLabel: '01 / Load and start', docs: 'Read English documentation', footerHint: 'Scroll, toggle the state, then watch this browser tab.', languageLabel: 'Language switcher'
    }
  };

  function mount(initFavicon, mode) {
    let controller = initFavicon(100);
    let language = 'zh';
    const toggle = document.querySelector('[data-toggle]');
    const status = document.querySelector('[data-status]');
    const statusText = document.querySelector('[data-status-text]');

    function updateStatus(isRunning) {
      const text = copy[language];
      toggle.textContent = text[isRunning ? 'stop' : 'start'];
      status.classList.toggle('is-paused', !isRunning);
      statusText.textContent = text[isRunning ? 'running' : 'paused'];
    }

    function translate() {
      const text = copy[language];
      document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
      document.querySelectorAll('[data-i18n]').forEach(element => { element.textContent = text[element.dataset.i18n]; });
      document.querySelectorAll('[data-i18n-aria]').forEach(element => { element.setAttribute('aria-label', text[element.dataset.i18nAria]); });
      document.querySelector('[data-mode-label]').textContent = text[mode === 'iife' ? 'modeIife' : 'modeEsm'];
      document.querySelector('[data-docs]').href = language === 'zh' ? '../../README.zh-CN.md' : '../../README.md';
      document.querySelectorAll('[data-language]').forEach(button => { button.setAttribute('aria-pressed', String(button.dataset.language === language)); });
      updateStatus(Boolean(controller));
    }

    toggle.addEventListener('click', () => {
      if (controller) {
        controller.stop();
        controller = null;
      } else {
        controller = initFavicon(100);
      }
      updateStatus(Boolean(controller));
    });

    document.querySelectorAll('[data-language]').forEach(button => {
      button.addEventListener('click', () => {
        language = button.dataset.language;
        translate();
      });
    });

    document.querySelector(`[data-setup="${mode}"]`).classList.add('setup-card--active');
    translate();
  }

  window.LiveFaviconDemo = { mount };
})();
