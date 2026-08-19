# 命名规范指导网站 —— 第十五~十七章「设计原则」+ 第十八章 IA 重构 交付概览

## 本次更新（对照计划文档最新版，975 行）
- **第十五章 全链路操作设计参考**：15.1 创建 / 15.2 检索过滤 / 15.3 修改 / 15.4 删除 / 15.5 关联查询，每节含「层 → 设计要点 → 命名落点 → 常见坑」表格 + 可折叠原理 + 代码示例 + 引用标注。
- **第十六章 解耦与正交设计原则**：16.1 分层单向依赖 / 16.2 正交性对比表 / 16.3 端口与适配器 / 16.4 轻量 CQRS / 16.5 可组合性（转述《The Pragmatic Programmer》正交性、《代码大全》第 5~6 章）。
- **第十七章 cats-effect 生态专属规范**：17.1 Option vs Error ADT（含**交互决策树**）/ 17.2 错误 ADT 命名 / 17.3 Tagless Final / 17.4 资源管理 / 17.5 章节呼应。
- **第十八章 IA 重构**：导航重组为 6 组（快速开始 / 命名规范 / 架构与设计原则 / 多语言范例 / 案例与工具 / 参考资料）；首页改造为「按角色快捷入口 + 最近更新 + 三大分类」。

## 改动文件
- `assets/js/data.js`：新增 `designPrinciples`（3 章 × 5 节 = 15 节，含 plain table / code / notes / refs，17.1 标记 `decisionTree:true`）。
- `assets/js/app.js`：新增 `renderDesign(chapterId)`、`renderDecisionTree()`、`bindDecisionTree()`；router 新增 `#/design/15|16|17`；搜索索引纳入设计章节；`buildNav` / `buildOutline` 重写为 6 组导航；`renderHome` 改为角色入口。
- `assets/css/style.css`：新增决策树、角色卡片、最近更新、chips、notes、`.nav-cat` 样式。

## 关键决策
- 新增「架构与设计原则」作为独立导航组，与「命名规范」区分开，呼应计划 18.1 的「按使用意图分组」。
- 17.1 的 Option vs Error 判断做成**内联可点击决策树**（纯 JS，无外部依赖），比静态表格更直观，契合计划 18.3 的交互增强建议。
- 引用均转述并标注章节（如《代码大全》第 5~6 章、《The Pragmatic Programmer》正交性、cats-effect 社区惯例），未逐字摘抄。

## 部署
- 提交推送 `main` 后 GitHub Pages 自动重新构建；线上 HTTP 200，数据/渲染/导航均已生效。
- 线上地址：https://darrenhp.github.io/naming-guidelines/

## 后续可选项（计划 18.3/18.4 建议，本次未做）
- 案例库多维标签筛选（语言 × 主题 × 层级）
- 全站面包屑 + 页内目录锚点
- 章节间交叉引用的悬浮预览卡片
- 链接健康检查定时自动化（计划 12.4，每季度一次）

## 备注
- 引用是否逐字摘抄书籍原文无法自动判定，建议人工终检一次。
