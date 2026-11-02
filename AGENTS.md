# AGENTS.md

## 项目结构

- 仓库根目录是一组独立的静态演示页，无构建流程。没有 `package.json`、构建、lint、类型检查或测试。验证改动直接打开页面（`start index.html`），不需要本地服务器。
- `index.html` 是当前在用的抓小球小游戏实现，所有 CSS 与 JS 都内联其中。`style.css` 与 `script.js` 是已不再引用的历史拆分文件，修改它们不会影响游戏。
- `spec.md`、`plan.md`、`retrospective.md` 描述的是旧版球游戏，已与代码冲突（如球的大小、`refreshBall()`、浮动分数）。以 `index.html` 为准，不要信任这些文档。
- `iconfont-1.html` / `iconfont-2.html` 是图标库展示页，分别使用 Font Awesome Web 字体与 Lucide SVG。`iconfont-3.html` / `iconfont-4.html` 是移动端底部导航演示，同样对应这两种图标方案。本地资源位于 `cdn/` 与 `font/`。
- `starter-level1-tyl-330.html` 与 `starter-level2-tyl-330.html` 是学生成绩看板练习的两个版本。两者都加载 `data.js`，它暴露 `window.STUDENTS` 与 `window.SUBJECTS`；level 2 的实现变量使用 `cyr_` 前缀。

## 约定与约束

- 页面通过 `file://` 打开。不要为本地数据添加 `fetch()`，不要使用 ES 模块或打包工具；使用传统 `<script src>` 标签与全局变量，和 `data.js` 一样。
- 新建的 CSS 类名、ID、JS 变量以 `tyl_` 开头（CSS 自定义属性用 `--tyl`），见 `tyl_prompt.md` 记录 #1。`index.html`、`starter-level1-tyl-330.html` 等旧文件早于该规则，按文件本地风格处理，不要批量重命名。
- 每个新 HTML 页面必须提供返回 `index.html` 的链接（记录 #3）；现有 `iconfont-*.html` 页面都已具备。
- 新建 HTML 文件必须写注释，尤其是 JS 部分：每个函数都要有简短注释说明其主要功能与实现要点。每个新页面需有文件头注释与脚本头注释，均包含以下四项：
  1. 作者：滕依灵
  2. 建立时间：`YYYY-MM-DD`
  3. 使用模型：当前所使用的模型名称
  4. 功能名称及简介：页面名称加一句话简介

  模板：

  ```html
  <!--
    作者：滕依灵
    建立时间：YYYY-MM-DD
    使用模型：<模型名称>
    功能名称及简介：<页面名称> —— <一句话简介>
  -->
  ...
  <script>
    /*
      作者：滕依灵
      建立时间：YYYY-MM-DD
      使用模型：<模型名称>
      功能名称及简介：<页面名称> —— <一句话简介>
    */

    /** <函数名>：<主要功能与实现要点> */
    function foo() { ... }
  </script>
  ```

- 本项目所有说明、文档与检查清单统一使用简体中文；文件路径、HTML 标签与属性、CSS 选择器与属性、JS 标识符、命令及代码保持英文原样。后续新增或修改的文档、检查清单均遵守此约定。
- `tyl_prompt.md` 是用户提示的追加式日志，记录时间、模型与提示原文。不要改写已有记录。
- UI 文案与文档使用简体中文，UTF-8 无 BOM。优先使用文件工具；PowerShell 控制台可能出现乱码，但文件本身未必损坏。
- `rules/`、`skills/`、`superpowers/` 仅存在于本地且已被 gitignore（见 `.gitignore`），不属于受版本管理的项目源码。`skills/git-push-project/SKILL.md` 记录了要求的提交流程。

## 提交改动

- 仅在明确要求时执行：`git add -A`，用 `feat:`、`fix:`、`docs:` 或 `chore:` 提交，然后 `git push -u origin main` 推送到 Gitee 远程。未经确认不要 force push。
- 没有 CI 或自动检查；手动打开改动后的页面并检查浏览器控制台进行验证。
