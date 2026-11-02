/*
  作者：滕依灵
  建立时间：2026-11-02
  使用模型：DeepSeek-V4.1-Flash
  功能名称及简介：tab 选项卡组件 —— 可复用的通用选项卡，支持多实例、默认选中项与点击切换
*/

(function (window, document) {
  'use strict';

  /* 选中态统一使用的类名与属性名 */
  var ACTIVE_CLASS = 'is-active';
  var TAB_SELECTOR = '[data-tyl-tab]';
  var PANEL_SELECTOR = '[data-tyl-panel]';
  var ROOT_SELECTOR = '[data-tyl-tabs]';

  /**
   * 收集容器内的选项卡按钮与内容面板
   * 用 Array.prototype.slice 转成真实数组，方便后续 forEach 调用
   */
  function collectParts(root) {
    var tabs = Array.prototype.slice.call(root.querySelectorAll(TAB_SELECTOR));
    var panels = Array.prototype.slice.call(root.querySelectorAll(PANEL_SELECTOR));
    return { tabs: tabs, panels: panels };
  }

  /**
   * 清除所有选项卡的选中状态
   * 依次去掉按钮高亮类、重置 aria-selected 与 tabindex，并隐藏全部内容面板
   */
  function clearSelection(tabs, panels) {
    tabs.forEach(function (tab) {
      tab.classList.remove(ACTIVE_CLASS);
      tab.setAttribute('aria-selected', 'false');
      tab.setAttribute('tabindex', '-1');
    });
    panels.forEach(function (panel) {
      panel.classList.remove(ACTIVE_CLASS);
      panel.hidden = true;
    });
  }

  /**
   * 设置当前选项卡的选中状态
   * 高亮当前按钮、同步 aria 属性，并显示与按钮 data-tyl-tab 值相同的内容面板
   */
  function selectTab(tab, panels) {
    var key = tab.getAttribute('data-tyl-tab');

    tab.classList.add(ACTIVE_CLASS);
    tab.setAttribute('aria-selected', 'true');
    tab.setAttribute('tabindex', '0');

    panels.forEach(function (panel) {
      var matched = panel.getAttribute('data-tyl-panel') === key;
      panel.hidden = !matched;
      panel.classList.toggle(ACTIVE_CLASS, matched);
    });
  }

  /**
   * 初始化单个选项卡容器
   * 为每个按钮绑定点击事件监听，点击时先清除全部选中状态，再选中当前按钮；
   * 同时按 data-tyl-default（缺省取第一个）激活默认选项卡
   */
  function initTabs(root) {
    var parts = collectParts(root);
    if (!parts.tabs.length) return;

    parts.tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        clearSelection(parts.tabs, parts.panels);
        selectTab(tab, parts.panels);
      });
    });

    var defaultKey = root.getAttribute('data-tyl-default');
    var defaultTab =
      parts.tabs.filter(function (tab) {
        return tab.getAttribute('data-tyl-tab') === defaultKey;
      })[0] || parts.tabs[0];

    clearSelection(parts.tabs, parts.panels);
    selectTab(defaultTab, parts.panels);
  }

  /**
   * 扫描页面上所有选项卡容器并逐个初始化
   * 页面存在多个 tab 实例时互不影响，可跨页面复用
   */
  function initAll() {
    var roots = document.querySelectorAll(ROOT_SELECTOR);
    Array.prototype.forEach.call(roots, function (root) {
      initTabs(root);
    });
  }

  /* 暴露到全局，页面可手动调用 window.tyl_initTabs(root) 重新初始化 */
  window.tyl_initTabs = initTabs;
  window.tyl_initAllTabs = initAll;

  /* 按文档加载状态决定立即初始化或等待 DOMContentLoaded */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})(window, document);
