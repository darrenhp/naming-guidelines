# 命名与设计规范指导网站

面向工程师的 **代码命名 / REST API 命名 / 数据库命名** 规范速查与深入理解站点。
强调「对比示例」（❌ 反例 / ✅ 正例）而非单纯罗列规则，并额外提供：
全站搜索、深色模式、响应式、案例库筛选、速查表（可打印）、外部参考资料聚合、
AI 提示词工具箱（一键复制）、新人 Onboarding 自测路径。

## 技术栈

- **纯静态站点，无构建步骤**：原生 HTML + CSS + 原生 JavaScript（ES6）。
- 直接双击 `index.html`，或任意静态服务器即可运行，方便部署到 GitHub Pages。
- 内容采用 **数据驱动渲染**：所有正文、对比表格、案例、提示词、题库都抽成
  `assets/js/data.js` 中的 JS 对象，由 `assets/js/app.js` 渲染。

## 本地运行

方式一（最简单）：直接双击 `index.html` 用浏览器打开。

方式二（推荐，避免个别浏览器对 `file://` 的限制）：

```bash
cd naming-guidelines
python3 -m http.server 8080
# 然后浏览器访问 http://localhost:8080
```

## 文件结构

```
naming-guidelines/
├── index.html            # 外壳：顶栏(搜索/主题切换/汉堡菜单) + 侧边栏 + 主内容容器
├── assets/
│   ├── css/
│   │   └── style.css     # 完整样式：CSS 变量主题(亮/暗)、响应式、表格横滚、卡片
│   └── js/
│       ├── data.js       # 全部内容数据（核心工作量，所有页面都来自这里）
│       └── app.js        # 路由(hash)、渲染、搜索、案例筛选、复制、打印、主题、测验
└── README.md             # 本文件
```

## 页面 / 路由（hash 路由，可分享/刷新定位）

| 路由 | 页面 |
|---|---|
| `#/home` | 首页（三大分类卡片 + 搜索入口 + 定位说明） |
| `#/code` `#/code/<id>` | 代码命名（10 节，点单节进入详情） |
| `#/api` `#/api/<id>` | REST API 命名（8 节） |
| `#/db` `#/db/<id>` | 数据库命名（5 节） |
| `#/cases` | 对比案例库（按类别筛选 + 关键字搜索） |
| `#/cheatsheet` | 速查表（一页纸，可打印/另存 PDF） |
| `#/references` | 参考资料（业界规范外链 + 适用场景提示） |
| `#/toolbox` | AI 提示词工具箱（占位符可替换，一键复制） |
| `#/onboarding` | 新人培训路径（含交互自测题） |

## 如何新增一条命名案例（改 data.js 即可）

所有内容都在 `assets/js/data.js` 的 `SITE_DATA` 对象里。以「代码命名 → 变量命名」
新增一条对比为例：

1. 打开 `assets/js/data.js`，找到 `categories[0].sections` 里 `id: "code-variable"` 的章节。
2. 在其 `tables[0].rows` 数组里追加一条：

   ```js
   { bad: "foo", good: "userScore", note: "说明这条反例为什么不好、正例好在哪" }
   ```

   - 三列对比表每行是 `{ bad, good, note }`；
   - 四列对比表（含「类别」列）每行是 `{ group, bad, good, note }`。

3. 保存后刷新浏览器即可，**无需任何构建**。该条目会自动出现在：
   - 对应章节页面；
   - 「对比案例库」聚合页（按 `category` 字段归类：code / api / db）。

> 章节的 `category` 由它所属的 `categories[i].id` 决定（code / api / db），
> 案例库会自动从所有章节表格中汇总，无需手动同步。

## 如何新增一个章节

在对应 `categories[i].sections` 数组里加一个对象：

```js
{
  id: "code-my-topic",          // 唯一 id，用于 hash 路由 #/code/code-my-topic
  title: "我的新章节",
  principle: "一句话原则（加粗展示在最前）",
  why: "为什么（可折叠 <details> 内的说明，转述书籍观点请标注章节来源）",
  tables: [
    { type: "three", columns: ["❌ 反例", "✅ 正例", "说明"], rows: [ { bad, good, note }, ... ] }
  ],
  examples: [ { lang: "typescript", code: "你的可运行示例", caption: "示例说明" } ],
  refs: ["《代码大全》第11章"]
}
```

`type` 支持 `"three"`（反例/正例/说明）与 `"four"`（类别/反例/正例/说明）。

## 部署到 GitHub Pages

仓库根目录即站点根目录，直接在仓库 Settings → Pages 选择 `main` 分支根目录发布即可。
无需任何构建产物。

## 内容来源与版权

- 书籍观点均**转述**并标注章节来源（《代码大全》第 11 章、《编写可读代码的艺术》第 1~3 章），不逐字摘抄。
- 外部链接来自 Google / Microsoft / Airbnb / JSON:API / SQL Style Guide 等一手资料（见第十二章），
  内容以官方最新版本为准，本站仅做归纳提炼。
- 涉及「业界多流派」（如表名单复数、Query 数组参数写法）的，列出对比与适用场景，
  建议团队选定一种并全站统一，不强行唯一答案。
