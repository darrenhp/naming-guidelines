# 命名规范指导网站 — 布局改版（大纲目录 + 精简侧边栏）

## 本次改动
按用户要求调整站点导航结构：

- **顶部 Banner 新增「全站大纲目录」**：在顶栏下方新增 sticky 横幅（`#outline`），按三大分类分组展示全部 23 个编号章节（如「1. 命名基本原则」「2. 变量命名」…）作为可点击锚点，支持横向滚动，并随路由高亮当前章节。
- **左侧侧边栏精简为一级**：移除了每个分类下的子章节展开（`nav-sub`），侧边栏现在只保留「总览」功能页（首页/速查表/案例库/参考资料/AI 工具箱/Onboarding）+ 三大分类的一级入口（「全部章节」）。具体章节仍可通过分类总览页的卡片进入。

## 关键文件
- `index.html` — 在 `<header>` 与 `<div class="layout">` 之间新增 banner 容器；修正了误写的 `</  header>` 标签。
- `assets/js/app.js` — 新增 `buildOutline()` 渲染大纲、`updateOutlineActive()` 同步高亮；`buildNav()` 移除子章节。
- `assets/css/style.css` — 新增 `--banner-h` 变量与 `.outline-banner` 样式；调整 `.sidebar` 的 sticky 偏移与 `.content-section` 锚点滚动补偿；打印时隐藏 banner。

## 布局要点
- 侧边栏 sticky 顶部 = `topbar(56px) + banner(48px)`，避免与大纲横幅重叠。
- 章节进入方式：侧边栏分类入口 → 分类总览页卡片 → 具体章节；或直接点 banner 大纲锚点。

## 在线地址
https://darrenhp.github.io/naming-guidelines/

## 备注
- 引用是否逐字摘抄书籍原文无法自动化判定，建议人工终检一次。
- 若希望 banner 非粘性（滚动后收起）或调整为全站点目录样式，可再调整。
