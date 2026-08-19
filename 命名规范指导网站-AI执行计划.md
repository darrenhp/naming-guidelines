# 命名规范指导网站 —— AI Agent 执行计划文档

> 本文档用于指导 AI Agent 自动生成一个「命名与设计规范指导网站」。
> 网站主题：代码命名 / REST API 设计命名 / 数据库表与字段命名。
> 定位：面向工程师的**速查 + 深入理解**双层内容站点，强调"对比示例"而非单纯罗列规则。

---

## 〇、深层意图解读（提问者可能没有直接说出来的需求）

在动笔之前，先把"用户真正想要什么"想清楚，这决定了网站的取舍标准。以下是几条**推测出的隐含目标**，已经并入后续章节的设计决策中：

1. **真实目的不是"建一个网站"，而是"训练出高标准的工程师"。**
   → 这意味着网站不能只是规则堆砌，而要承担"教材"的角色：需要有循序渐进的阅读路径（先讲原则、再看反例正例、最后看真实场景），要方便老工程师用来做新人培训、方便 Tech Lead 直接甩链接做 Code Review 依据。因此第八章"交付物"里新增了"新人培训阅读路径"和"Code Review 速查清单"的要求（见〈十一〉）。
2. **"最方便阅读"是硬指标，不是锦上添花。**
   → 意味着信息密度要高但认知负担要低：每条规则必须能在 5 秒内扫到结论（❌/✅ 表格），10 秒内理解原理。所以强制要求"一句话原则"必须加粗、放在最前面，长篇原理解释放在表格之后、可折叠。
3. **用户提到"能否有命名参考网站作为外链"，说明他希望这个站不是孤岛，而是聚合入口。**
   → 网站应该扮演"精选层 + 转译层"的角色：把 Google/Microsoft/Airbnb 等分散在各处、且往往是英文、原始文档冗长的规范，提炼成对比表格，同时保留外链供读者深挖原文。见〈十二、外部权威参考网站清单〉。
4. **用户提到"如何用 AI 查找好的命名"和"如何让 Codex/Cursor review 代码找出命名问题"，说明他的终极使用场景是"把这个规范变成可以被 AI 直接执行的东西"，而不仅仅是给人看的文档。**
   → 网站因此需要产出**两类可复制粘贴的提示词资产**：(a) 用于"起名/找名字"的 AI 提示词模板；(b) 用于喂给 Cursor/Codex/Claude Code 做自动化 Code Review 的规则文件（`AGENTS.md` / `.cursor/rules/*.mdc`）和一次性 Review Prompt。这是本次计划相比上一版新增的核心模块，见〈十三〉。
5. **隐含的"最高标准"暗示需要有权威性背书。**
   → 每条规则尽量标注"参考来源"（书籍章节 / 业界规范名称），增强说服力，也方便工程师在团队内部推行规范时"不是我说了算，是业界共识"。

> 结论：这份网站的本质是「**给工程师看的规范手册 + 给 AI Agent 用的执行规则库**」的合体，而不是一个纯展示型的文档站。后续章节的设计都围绕这个定位展开。

---

## 一、项目目标

1. 产出一个可浏览、可检索的静态网站，系统性地讲清楚三类命名规范：
   - **代码命名**（变量 / 函数 / 类 / 常量 / 布尔值 / 包与模块等）
   - **API 设计命名**（以 REST 风格为主，兼顾常见变体）
   - **数据库表与字段命名**（关系型数据库为主）
2. 每条规则必须配**"反例 vs 正例"对比表格**，而不是干巴巴的文字描述。
3. 内容需要有理论支撑，明确引用/致敬以下书籍的相关章节思想（**不逐字摘抄原文，只复述观点并标注来源章节**，避免版权问题）：
   - 《代码大全》(Code Complete, Steve McConnell) —— 第 11 章「变量名的力量」等
   - 《编写可读代码的艺术》(The Art of Readable Code, Dustin Boswell & Trevor Foucher) —— 第 1~3 章关于命名的内容
4. 网站要能直接当作团队 Code Review / API 设计评审的参考手册使用。
5. 网站要能同时服务"人"和"AI 工具"两种使用者：人用来阅读学习、做新人培训；AI Agent（Cursor / Codex / Claude Code 等）用来作为规则文件直接执行代码评审。因此网站需产出可直接复制的提示词模板与规则文件（详见〈十三、AI 辅助命名与代码评审提示词库〉）。

---

## 二、目标读者

- 后端 / 全栈工程师（日常写代码、设计接口）
- 需要制定团队规范的 Tech Lead / 架构师
- 数据库设计人员（DBA、后端）
- 新人培训场景（Onboarding 文档的一部分）

---

## 三、网站信息架构（IA）

```
首页 Home（新版：不再是简单卡片，见〈十八、网站信息架构优化〉）
 │
 ├─ 【导航组 A】快速开始 Getting Started
 │   ├─ 新人培训路径 Onboarding Path（1小时速成阅读顺序 + 自测，见〈十一〉）
 │   └─ 速查表 Cheat Sheet（一页纸可下载）
 │
 ├─ 【导航组 B】命名规范 Naming
 │   ├─ 一、代码命名规范 Code Naming
 │   │   ├─ 1. 命名基本原则（可读性、意图暴露、一致性、可搜索性）
 │   │   ├─ 2. 变量命名
 │   │   ├─ 3. 函数/方法命名
 │   │   ├─ 4. 类/接口/类型命名
 │   │   ├─ 5. 布尔量命名
 │   │   ├─ 6. 常量/枚举命名
 │   │   ├─ 7. 集合类型命名（数组/Map/Set）
 │   │   ├─ 8. 缩写与单位命名
 │   │   ├─ 9. 作用域与命名长度的关系
 │   │   └─ 10. 常见反模式清单（Anti-pattern Checklist）
 │   ├─ 二、API 设计命名规范 API Naming (REST)
 │   │   ├─ 1. URL 路径设计（资源命名、复数、层级）
 │   │   ├─ 2. HTTP 方法与语义映射
 │   │   ├─ 3. Query 参数命名（分页、排序、过滤）
 │   │   ├─ 4. 请求/响应 Body 字段命名（大小写风格、嵌套）
 │   │   ├─ 5. 状态码与错误码命名规范
 │   │   ├─ 6. 版本控制命名
 │   │   ├─ 7. 特殊动作接口命名（非 CRUD 场景）
 │   │   └─ 8. 常见反模式清单
 │   └─ 三、数据库表/字段命名规范 DB Naming
 │       ├─ 1. 表命名（单复数、前缀、中间表）
 │       ├─ 2. 字段命名（主键、外键、时间字段、布尔字段）
 │       ├─ 3. 索引/约束/视图命名
 │       ├─ 4. 枚举值与状态字段设计
 │       └─ 5. 常见反模式清单
 │
 ├─ 【导航组 C】架构与设计原则 Architecture & Design（本次新增的核心扩展）
 │   ├─ 十五、全链路操作设计参考 End-to-End Operation Patterns
 │   │   ├─ 1. 创建 Create
 │   │   ├─ 2. 检索/过滤 Retrieve & Filter
 │   │   ├─ 3. 修改 Update（全量 vs 局部）
 │   │   ├─ 4. 删除 Delete（软删/硬删）
 │   │   └─ 5. 关联关系查询 Relational Query（避免 N+1、DTO 组装）
 │   ├─ 十六、解耦与正交设计原则 Decoupling & Orthogonality
 │   │   ├─ 1. 分层职责与依赖方向
 │   │   ├─ 2. 正交性：模块互不知晓、可自由组合
 │   │   ├─ 3. 依赖反转与端口-适配器（Ports & Adapters）
 │   │   └─ 4. Command/Query 分离
 │   └─ 十七、语言生态专属设计规范 Ecosystem-specific Design
 │       └─ cats-effect 生态：错误建模（ADT vs Option）、Tagless Final、Resource 管理
 │
 ├─ 【导航组 D】多语言范例 Language Examples
 │   └─ 十四、Java / Scala / Python 分层服务范例
 │       ├─ Java (Spring Boot)：Endpoint / Service / Repository / RPC Client / Test
 │       ├─ Scala (Akka HTTP + cats-effect)：同上五层
 │       ├─ Python (FastAPI)：同上五层
 │       └─ 三语言横向对照表（同一业务场景 Tab 切换查看）
 │
 ├─ 【导航组 E】案例与工具 Cases & Tools
 │   ├─ 四、对比案例库 Case Gallery（可搜索/可筛选的大表格集合，聚合以上所有正反例）
 │   └─ 十三、AI 提示词工具箱 Prompt Toolbox
 │       ├─ 1. 用 AI 起名/找名字的提示词模板
 │       ├─ 2. 喂给 Cursor/Codex/Claude Code 的规则文件模板（AGENTS.md / .cursor/rules）
 │       └─ 3. 一次性 Code Review 提示词模板（复制即用）
 │
 └─ 【导航组 F】参考资料 References
     ├─ 六、书籍推荐（含章节映射说明）
     └─ 十二、业界规范外链清单（需实时检索确认链接有效）
```

> 说明：该 IA 已从"命名规范站"升级为"命名规范 + 架构设计规范站"，导航从扁平的一~八调整为 6 个分组（A~F），原因与具体交互细节见〈十八、网站信息架构优化〉。正文章节编号沿用之前版本已有的编号（一~十四），新增内容续接为十五~十八，避免大范围重新编号造成的引用混乱。

---

## 四、内容编写规范（写给 AI Agent 的强约束）

1. **每个知识点必须包含**：
   - 一句话原则（黑体高亮）
   - "为什么"（简短原理说明，可引用书籍思想）
   - 对比表格（❌ 反例 / ✅ 正例 / 说明）
   - 至少 1 个真实语言示例（可覆盖 Java/Python/Go/TypeScript 任选其一，保持全站语言风格一致或做 Tab 切换）
2. **对比表格是核心交付物**，每个子主题至少 5～8 行案例，不能少于 3 行。
3. 语气：简洁、克制、可直接复制到团队 Wiki，不使用营销号式夸张语言。
4. 禁止逐句摘抄书籍原文；用自己的话转述观点，书名和章节以「参考：《代码大全》第11章」形式标注。
5. 所有示例代码需可运行/语法正确，不能是伪代码占位。

---

## 五、核心内容大纲与"种子"对比表格（供 Agent 扩展参考）

> 以下表格为**内容范例**，AI Agent 生成网站正文时需要在此基础上扩充到每类 5~8 条，并补充原理说明。

### 5.1 代码命名 —— 变量命名

原则：**变量名应暴露意图，长度与作用域成反比，避免无意义噪音词。**（参考：《代码大全》第11章"变量名的力量"；《编写可读代码的艺术》第1~2章）

| ❌ 反例 | ✅ 正例 | 说明 |
|---|---|---|
| `d` | `elapsedDays` | 单字母变量无法表达意图，仅限极短循环体内使用 |
| `data`, `info`, `temp` | `userProfile`, `retryCount` | "万能词"未传达任何领域信息 |
| `list1` | `activeUserIds` | 数字后缀是命名思考不足的信号 |
| `flag` | `isEmailVerified` | 应说明"是什么状态"而非"这是个标志" |
| `getUserInfo2` | `getUserInfoWithOrders` | 数字后缀掩盖了两个函数真正的语义差异 |
| `theList` | `pendingOrders` | 冠词/代词不具备区分度 |
| `usrNm` | `userName` | 非通用缩写增加阅读成本 |
| `maxNum` | `maxRetryCount` | 说明"什么的最大值"，避免歧义 |

### 5.2 代码命名 —— 布尔量命名

原则：**布尔变量/函数名应能直接放入 if 语句朗读成一句通顺的话，使用 is/has/can/should 前缀。**

| ❌ 反例 | ✅ 正例 | 说明 |
|---|---|---|
| `status` | `isActive` | `status` 是名词，无法判断真假语义 |
| `check` | `isValid` | 动词裸词不表达"检查结果" |
| `visible` | `isVisible` | 缺少 is 前缀，读起来像名词 |
| `notEmpty` | `isEmpty`（取反使用） | 避免双重否定 `if (!isNotEmpty)` |
| `hasNoError` | `hasError` | 同上，双重否定难以阅读 |
| `enable` | `isEnabled` | 动词原形容易与"启用它"的命令混淆 |
| `flag_delete` | `isDeleted` | 避免下划线与拼音式缩写混用 |

### 5.3 代码命名 —— 函数/方法命名

原则：**函数名 = 动词 + 名词，准确描述"做什么"而不是"怎么做"；避免名不副实（不要叫 getX 却做了写操作）。**（参考：《编写可读代码的艺术》第2章"名字应该包含更多信息"）

| ❌ 反例 | ✅ 正例 | 说明 |
|---|---|---|
| `getUser()`（内部会写库） | `createOrGetUser()` / `fetchAndPersistUser()` | 函数名承诺了只读，实际有副作用，属于欺骗性命名 |
| `handleData()` | `parseCsvToOrders()` | "handle/process"是万能词，等于没说 |
| `doIt()` | `sendConfirmationEmail()` | 名字必须能替代注释 |
| `check(user)` | `validateUserAge(user)` | 说明检查的具体维度 |
| `stop()` | `cancelSubscription()` | 描述业务动作而非泛化动词 |
| `calc()` | `calculateMonthlyInterest()` | 完整单词，减少认知负担 |
| `isUserValid()`（实际返回错误列表） | `validateUser()` 返回 `List<Error>` | 命名要与返回类型语义一致 |

### 5.4 代码命名 —— 类/常量/集合

| 类别 | ❌ 反例 | ✅ 正例 | 说明 |
|---|---|---|---|
| 类名 | `Manager`, `Helper`, `Util`（无限定） | `OrderPaymentReconciler` | 万能类名会变成"垃圾桶类" |
| 常量 | `MAX = 100` | `MAX_LOGIN_ATTEMPTS = 100` | 常量必须自解释 |
| 集合(数组) | `userList` 存的是 IDs | `userIds` | 类型后缀应准确，`List`不代表内容 |
| 集合(Map) | `map` | `userIdToOrderCount` | Map 命名建议 `keyToValue` 模式 |
| 枚举 | `Status { A, B, C }` | `OrderStatus { PENDING, PAID, SHIPPED }` | 枚举值需自解释业务含义 |
| 接口 | `IUserService` (Java中不推荐 I 前缀) | `UserService` | 视语言社区惯例而定，需在站点注明"语言差异" |

### 5.5 REST API —— URL 路径命名

原则：**URL 使用名词复数表示资源集合，用层级表达从属关系，动词只出现在非 CRUD 的"控制器式"端点里。**

| ❌ 反例 | ✅ 正例 | 说明 |
|---|---|---|
| `/getUser?id=1` | `GET /users/1` | 动词不应出现在 URL 中，HTTP 方法已表达动作 |
| `/user` | `/users` | 资源集合统一使用复数，全站保持一致 |
| `/users/1/getOrders` | `GET /users/1/orders` | 从属资源用路径层级表达 |
| `/deleteUser/1` | `DELETE /users/1` | 同上，避免动词+ID混合 |
| `/UserOrders` | `/users/{userId}/orders` | 避免大驼峰，路径统一小写中划线/斜杠 |
| `/users_list` | `/users` | 不需要 `_list` 后缀，复数已表达列表语义 |
| `/user-Info/1` | `/users/1` | 混合大小写与下划线不一致，统一 kebab-case |
| `/api/v1/getAllActiveUsers` | `GET /api/v1/users?status=active` | 过滤条件应放入 query，而非编码进路径 |

### 5.6 REST API —— 非 CRUD 动作端点命名

原则：**当操作无法映射为标准 CRUD 时，允许在资源后追加"动词子资源"，但要克制使用。**

| ❌ 反例 | ✅ 正例 | 说明 |
|---|---|---|
| `POST /users/1/doActivate` | `POST /users/1/activation` | 用"名词化的动作资源"代替裸动词 |
| `POST /activateUser/1` | `POST /users/1/activate` | 若团队接受动词子路径，需全站统一放在资源之后 |
| `POST /orders/1/cancelOrder` | `POST /orders/1/cancellation` | 避免动词与资源名重复冗余 |
| `GET /searchUsersByName` | `GET /users?name=xxx` | 搜索优先用 query 参数而非专用路径 |
| `POST /sendResetPasswordEmail` | `POST /password-resets` | 把"发送重置邮件"建模为创建一个"重置请求"资源 |

### 5.7 REST API —— Query 参数命名

| ❌ 反例 | ✅ 正例 | 说明 |
|---|---|---|
| `?p=2&s=20` | `?page=2&pageSize=20` | 缩写降低可读性，参数名需完整单词 |
| `?sort=1` | `?sortBy=createdAt&order=desc` | 排序字段与方向分离，避免magic number |
| `?filter=active` | `?status=active` | 明确过滤的字段名，而非笼统的 filter |
| `?from=2024-01-01&to=2024-02-01` | `?startDate=2024-01-01&endDate=2024-02-01` | 语义更清晰，避免 from/to 在不同接口含义不一致 |
| `?ids=1,2,3` vs `?id=1&id=2` | 团队统一二选一并写入规范 | 数组参数风格需要全站强制统一 |

### 5.8 REST API —— 请求/响应 Body 字段命名

| ❌ 反例 | ✅ 正例 | 说明 |
|---|---|---|
| 混用 `user_name` 和 `userName` | 统一 `camelCase`（JS 生态）或统一 `snake_case`（Python/Ruby 生态） | 大小写风格必须全局唯一，写入规范首条 |
| `data`（顶层字段名） | `{ "user": {...} }` 或规范化的 `{ "data": ..., "meta": ... }` 信封结构 | 顶层结构需要有约定的信封（envelope）规范 |
| `errmsg` | `errorMessage` | 避免不规范缩写 |
| `is_deleted: "true"`（字符串） | `isDeleted: true`（布尔类型） | 类型与命名要匹配，不要用字符串表示布尔 |
| `created`（歧义：时间还是布尔） | `createdAt`（ISO8601 时间戳） | 时间字段统一加 `At` 后缀 |
| `user_type_id: 3` 无文档 | `userType: "ADMIN"` 或附带枚举说明 | 优先语义化枚举而非裸魔法数字 |

### 5.9 数据库 —— 表命名

原则：**表名使用小写 + 下划线（snake_case），统一单数或复数（业界两派均有，需团队选定并全站统一），避免类型前缀污染。**

| ❌ 反例 | ✅ 正例 | 说明 |
|---|---|---|
| `Tbl_User` | `users`（或统一 `user`） | 不需要 `Tbl_` 类前缀，且大小写统一小写 |
| `UserOrderRelation` | `user_orders`（中间表） | 多对多中间表建议 `表A_表B` 或体现业务含义的名字 |
| `data1`, `tmp_user` | 明确业务含义的表名，禁止临时表进入正式 schema | 临时/草稿表需要独立命名空间或前缀如 `tmp_` 并有清理机制 |
| `user_info_new` | `users`（通过迁移脚本替换旧表） | 禁止用 `_new`/`_old`/`_bak` 后缀长期存在于生产 schema |
| `t_user_login_log` | `user_login_logs` | 避免无意义的类型编码前缀（匈牙利命名法遗留问题） |

### 5.10 数据库 —— 字段命名

| 类别 | ❌ 反例 | ✅ 正例 | 说明 |
|---|---|---|---|
| 主键 | `uid`, `userId`（不统一） | 全站统一 `id` | 主键统一叫 `id`，外键才带前缀 |
| 外键 | `uid` | `user_id` | 外键命名 = 引用表单数名 + `_id` |
| 时间 | `time`, `date` | `created_at` / `updated_at` / `deleted_at` | 统一后缀 `_at`，软删除统一 `deleted_at` |
| 布尔 | `active` (int 类型 0/1 无字段名提示) | `is_active`（boolean 类型） | 与代码层布尔命名规范呼应 |
| 金额 | `price` (不清楚单位) | `price_cents` 或 `price_amount` + 独立 `currency` 字段 | 涉及金额务必显式标注单位/精度 |
| 状态枚举 | `status`（数字 1/2/3 无注释） | `status` + 应用层枚举映射表，或 `status_code` 附文档 | 数据库字段名一致但需配合注释/字典表 |
| 计数 | `num`, `cnt` | `retry_count`, `login_count` | 完整单词，`_count` 后缀统一 |

### 5.11 数据库 —— 索引/约束命名

| ❌ 反例 | ✅ 正例 | 说明 |
|---|---|---|
| `index1` | `idx_users_email` | `idx_表名_字段名` 格式，可追溯 |
| `uk1` | `uk_users_email`（唯一约束） | 前缀区分索引类型：`idx_`普通索引，`uk_`唯一索引，`fk_`外键 |
| `fk_1` | `fk_orders_user_id` | 外键命名体现"从哪个表的哪个字段而来" |

---

## 六、技术实现建议（给 AI Agent 的执行参数）

1. **技术栈**：静态站点生成器（如 VitePress / Docusaurus / Nextra 任一），优先选择内置全文搜索、Markdown 表格渲染良好、支持代码高亮与深色模式的方案。
2. **搜索**：接入本地全文搜索（如 Docusaurus 的 Algolia/local search 插件），支持按"❌/✅"关键字或场景搜索。
3. **交互增强**：
   - 每个对比表格支持"一键复制正例代码"
   - 语言 Tab 切换（Java/Python/Go/TS）
   - "速查表"页面提供可下载 PDF/PNG（复用 pdf 或图片导出能力）
4. **可维护性**：所有对比表格数据建议抽成结构化数据（JSON/YAML）驱动渲染，方便后续增补案例、支持"案例库"页面的筛选/搜索功能。
5. **部署**：产出可直接部署到 Vercel/Netlify/GitHub Pages 的静态产物。

---

## 七、交付物清单

- [ ] 网站信息架构落地（目录结构 + 导航）
- [ ] 三大分类正文页面（含不少于第五章节规模 2 倍的对比表格）
- [ ] 案例库聚合页（结构化数据驱动，可筛选：代码/API/数据库）
- [ ] 速查表单页（可下载）
- [ ] 参考资料页（书籍章节映射 + 业界规范链接，链接需自行检索校验有效性）
- [ ] 三语言（Java/Scala/Python）分层 REST 服务命名范例页 + 横向对照表（见〈十四〉），代码需可编译/运行
- [ ] 全链路操作设计参考页（Create/Retrieve-Filter/Update/Delete/关联查询，见〈十五〉）
- [ ] 解耦与正交设计原则页（见〈十六〉）
- [ ] cats-effect 生态专属设计规范页，含 Option vs Error ADT 决策树（见〈十七〉）
- [ ] 按角色的首页快捷入口 + 分组导航（见〈十八〉）
- [ ] 全站搜索功能
- [ ] 响应式布局（移动端可读）
- [ ] README：说明如何本地运行、如何新增一条命名案例

---

## 八、验收标准

1. 每个子主题对比表格 ≥ 5 行，且反例/正例均可运行或语法正确。
2. 无逐字引用书籍原文，所有引用需转述并标注章节来源。
3. 全站大小写/命名风格自身保持一致（网站自己也要"以身作则"）。
4. 移动端与桌面端均可正常浏览，表格在窄屏下不破版（可横向滚动或折叠）。
5. 全文搜索可用，搜索"布尔命名"等关键词能定位到对应章节。

---

## 九、分阶段任务拆解（可直接作为 Agent 的任务队列）

| 阶段 | 任务 | 产出 |
|---|---|---|
| 1 | 初始化项目脚手架，选定技术栈 | 可运行的空站点 |
| 2 | 搭建分组导航信息架构骨架（见〈十八〉6 大导航组） | 空页面 + 导航跑通 |
| 3 | 编写「代码命名」全部子页面 + 对比表格 | Markdown/MDX 正文 |
| 4 | 编写「API 设计命名」全部子页面 + 对比表格 | Markdown/MDX 正文 |
| 5 | 编写「数据库命名」全部子页面 + 对比表格 | Markdown/MDX 正文 |
| 6 | 编写「全链路操作设计参考」页面（见〈十五〉） | Markdown/MDX 正文 |
| 7 | 编写「解耦与正交设计原则」页面（见〈十六〉） | Markdown/MDX 正文 |
| 8 | 编写「cats-effect 生态专属设计规范」页面 + Option/Error 决策树（见〈十七〉） | Markdown/MDX 正文 + 交互组件 |
| 9 | 编写三语言分层服务范例页 + 横向对照表（见〈十四〉） | Markdown/MDX 正文，代码需可编译/运行 |
| 10 | 构建案例库聚合页（结构化数据 + 语言×主题×层级多维筛选） | 交互页面 |
| 11 | 制作速查表下载页 + AI 提示词工具箱页（一键复制卡片） | PDF/图片 + 交互页面 |
| 12 | 首页角色化快捷入口改造，接入搜索、完善响应式与深色模式 | 完整体验 |
| 13 | 自查验收标准，修订不一致命名风格，校验所有外链有效性 | 校对报告 |
| 14 | 打包部署，产出 README | 上线链接 + 文档 |

---

## 十、给 AI Agent 的补充提示

- 遇到"业界确实存在多种流派"的情况（例如表名单复数、Query 数组参数写法），**不要强行给出唯一正确答案**，而是在页面中列出主流方案对比 + 各自适用场景，并建议"团队选定一种并写入规范文档、全站统一执行"。
- 所有涉及具体产品/公司规范引用（如 Google API 设计指南、Microsoft REST 指南）时，需要**实时检索确认链接可访问**，不要凭记忆编造 URL。
- 优先保证第五章节列出的表格内容被**完整还原并适当扩充**到正文中，这是本次任务的核心可交付物。

---

## 十一、新人培训路径（回应"培训出最好最高标准工程师"这个目标）

单纯把规则平铺展示，达不到"培训"效果。建议在网站里单独做一个 Onboarding 页面，提供一条**强制顺序的阅读路径**，并配自测环节：

| 步骤 | 内容 | 形式 | 预计耗时 |
|---|---|---|---|
| 1 | 命名三大原则导读（意图暴露/一致性/作用域匹配长度） | 图文 | 10 分钟 |
| 2 | 代码命名核心 8 条 + 对比表格通读 | 交互式表格 | 15 分钟 |
| 3 | REST API 命名核心 6 条 + 对比表格通读 | 交互式表格 | 15 分钟 |
| 4 | 数据库命名核心 5 条 + 对比表格通读 | 交互式表格 | 10 分钟 |
| 5 | 自测：给出 10 个反例，要求新人写出正例并说明理由 | `quiz` 形式互动题 | 10 分钟 |
| 6 | 把速查表 Cheat Sheet 加入浏览器书签 / 团队 Wiki 置顶 | 引导提示 | 1 分钟 |

- 建议在自测环节采用"给反例代码片段 → 让学员改写 → 系统给出参考答案与依据章节"的形式，比单纯选择题更贴近真实 Code Review 场景。
- 该页面同时可以作为 Tech Lead 布置新人任务时直接甩的链接（"先看完这个 Onboarding 页，再来找我聊"）。

---

## 十二、外部权威参考网站清单（用于"参考资料"页外链，已实时检索校验）

> 以下链接均为业界公认的一手资料，建议网站直接外链而非转述其详细条款（避免与自身内容重复、且尊重原作者版权）。AI Agent 在生成"参考资料"页时可直接使用这些链接，若发现失效需重新检索替换。

### 12.1 代码命名 / 通用编码风格

| 名称 | 说明 | 链接 |
|---|---|---|
| Google Style Guides（多语言总入口） | Google 官方各语言编码规范总目录，含命名章节 | https://google.github.io/styleguide/ |
| Airbnb JavaScript Style Guide | 业界最流行的 JS/React 风格指南之一，命名规则详尽 | https://github.com/airbnb/javascript |
| 《代码大全》作者 Steve McConnell 官网 | 可查书籍章节目录与勘误 | https://stevemcconnell.com/ |

### 12.2 REST API 设计命名

| 名称 | 说明 | 链接 |
|---|---|---|
| Google Cloud API Design Guide（AIP） | Google 内部长期使用的 API 设计规范，命名章节非常系统 | https://docs.cloud.google.com/apis/design |
| AIP-190 Naming Conventions | Google AIP 体系中专门讲命名的一篇 | https://google.aip.dev/190 |
| AIP-122 Resource Names | 专讲资源命名（URL 路径设计） | https://google.aip.dev/122 |
| Microsoft REST API Guidelines | 微软内部跨团队 REST API 设计规范，HTTP 方法与字段命名讲得很细 | https://github.com/microsoft/api-guidelines |
| JSON:API 规范 | 关于响应体结构、字段命名、分页参数命名的社区标准 | https://jsonapi.org/ |

### 12.3 数据库命名

| 名称 | 说明 | 链接 |
|---|---|---|
| SQL Style Guide（Simon Holywell） | 广泛引用的 SQL/数据库对象命名风格指南，含表名/字段名/索引前缀约定 | https://www.sqlstyle.guide/ |

### 12.4 使用建议

- 网站在每个"外链"卡片上应注明该资料的**核心适用场景**（例如"Microsoft 指南更适合企业级/Azure 风格 API；Google AIP 更适合资源导向、gRPC/REST 双栈团队"），避免读者迷失在多个流派中。
- 由于这些外部网站内容会持续更新，建议在网站的参考资料页加一行免责声明："以下链接内容以官方最新版本为准，本站仅做归纳提炼，不代表逐字复述。"
- 部署时安排一个「链接健康检查」的定期任务（如每季度跑一次 HTTP 状态检查脚本），防止外链失效影响体验。

---

## 十三、AI 辅助命名与代码评审提示词库（新增核心模块）

这一章是本计划相较于基础版本新增的重点：把网站里沉淀的规范，转译成**可以直接复制粘贴给 AI 使用**的提示词和规则文件，让规范真正"落地执行"而不只是停留在文档里。建议网站为每一类提示词单独做一个可一键复制的卡片组件。

### 13.1 用 AI（Claude / ChatGPT 等对话式模型）辅助"起名/找好名字"的提示词模板

**模板 A：变量/函数命名**
```
我在写 [语言] 代码，需要给下面这个 [变量/函数/类] 起一个好名字。
它的作用是：[一句话描述业务含义/职责]。
所在上下文/作用域是：[函数内部局部变量 / 类的成员 / 模块级公共 API]。
请给出 3~5 个候选名字，并按"清晰度、简洁度、与团队现有命名风格的一致性"打分排序，
说明每个候选名字的优缺点，最后给出你最推荐的一个。
如果我提供的候选名字有歧义（比如万能词 data/info/temp/flag/handle/manager），
请直接指出问题并给出替代方案。
```

**模板 B：REST API 字段/路径命名**
```
我在设计一个 REST API，资源是 [资源名称]，字段/路径片段的业务含义是：[描述]。
请帮我确定命名，要求：
1. 路径使用小写 + 连字符风格，资源用复数名词；
2. Body 字段使用 [camelCase / snake_case]（团队现有约定，需与全站保持一致）；
3. 避免把动词写进 URL（除非是非 CRUD 的动作型端点）；
4. 对照 Google AIP 和 Microsoft REST API Guidelines 的常见做法给出参考。
请给出最终建议的完整路径/字段示例，并说明理由。
```

**模板 C：数据库表/字段命名**
```
我要设计一张数据库表，用途是：[描述]。
请按照以下约定给出表名、主键、外键、时间字段、状态字段、索引名的命名建议：
- 表名：小写 + 下划线，[单数/复数，团队约定]；
- 主键统一为 id；外键为 关联表单数_id；
- 时间字段统一 _at 后缀（created_at/updated_at/deleted_at）；
- 布尔字段统一 is_/has_ 前缀；
- 索引命名 idx_表名_字段名，唯一索引 uk_表名_字段名。
请输出一份 CREATE TABLE 的字段清单草案，并标注每个命名的依据。
```

> 使用建议：把 [语言]/[camelCase 或 snake_case]/[单数或复数] 这些括号项，替换成团队在〈第五章〉里最终选定的规范，做成"团队专属版提示词"贴在网站的"我的团队规范"个性化页面（如果项目有余力做用户自定义功能）。

### 13.2 喂给 Cursor / Codex / Claude Code 的规则文件模板

2026 年主流 AI 编码工具（Cursor、Codex、Claude Code、Copilot、Windsurf 等）已经收敛到"仓库根目录放一份 Markdown 规则文件，多数工具都能读"的模式：通用格式是 **`AGENTS.md`**（开放标准，Codex/Cursor/Copilot/Gemini CLI 等原生支持），Cursor 另有更细粒度的 **`.cursor/rules/*.mdc`** 按文件类型/路径生效的规则。建议网站提供两份可直接下载的模板文件：

**(1) `AGENTS.md` 命名规范片段示例（适用于 Codex / Cursor / Copilot 等通用场景）**
```markdown
## 命名规范（Naming Conventions）

在生成或修改代码时，必须遵守以下命名规则，发现已有代码违反时应在 PR 中主动指出：

### 代码命名
- 禁止使用无意义的万能词作为变量/函数名：data, info, temp, flag, handle, manager, obj, foo, tmp。
- 布尔变量/函数必须使用 is/has/can/should 前缀，且能直接放进 if 语句读成一句话。
- 函数名必须是"动词+名词"，且名字要与函数的真实副作用一致（只读函数不能叫 getX 却做写操作）。
- 禁止用数字后缀区分同类变量/函数（如 user1, user2, getUserInfo2）。

### REST API 命名
- URL 路径只用名词复数表示资源集合，禁止在路径中出现动词（非 CRUD 动作端点除外，需用名词化的子资源表达）。
- Query 参数使用完整单词，禁止不常见缩写（如 p, s 代替 page, size）。
- Body 字段大小写风格全项目统一为 [camelCase]，禁止混用 snake_case。
- 时间字段统一使用 [xxxAt] 后缀并使用 ISO 8601 格式。

### 数据库命名
- 表名统一使用小写 + 下划线（snake_case），[单数/复数，按团队约定二选一]。
- 主键统一叫 id；外键统一为 关联表单数_id。
- 布尔字段必须有 is_/has_ 前缀，禁止用 0/1 语义不明的字段名。
- 索引命名遵循 idx_表名_字段名，唯一索引 uk_表名_字段名。

请在 Code Review 时，凡发现违反以上任意一条的命名，直接在对应代码行给出修改建议，并注明违反的具体规则。
```

**(2) Cursor 专用 `.cursor/rules/naming-conventions.mdc` 片段示例**
```markdown
---
description: 命名规范检查规则，适用于所有代码与 API/DB 相关文件
alwaysApply: true
---

# 命名规范强制规则

(此处内容与上方 AGENTS.md 中的"命名规范"部分保持一致，
 建议两个文件通过脚本自动同步，避免规则漂移。)

当你生成新代码或编辑已有代码时：
1. 若发现变量/函数命名违反规则，在生成代码前先自我检查一遍并修正，无需等待用户指出。
2. 若在阅读到既有代码时发现命名问题，在你的回复末尾单独列出"发现的命名问题"清单，
   格式：`文件:行号 | 现有名字 | 问题 | 建议名字`。
```

### 13.3 一次性 Code Review 提示词模板（无需改仓库配置，直接在对话里粘贴使用）

适用场景：临时想用 Cursor Chat / Codex CLI / Claude Code 对某个文件或某次 PR 做一次命名专项审查，而不想改动仓库规则文件。

```
请只针对"命名质量"对本次改动/本文件做一轮专项 Code Review，不用管其他方面（性能、测试覆盖率等）。

审查标准：
1. 变量/函数名是否暴露了真实意图，是否存在 data/info/temp/flag/manager 这类万能词；
2. 布尔量命名是否使用 is/has/can/should 前缀，能否直接读成一句通顺的 if 语句；
3. 函数名是否"名副其实"，是否存在名字承诺是只读但实际有副作用的情况；
4. 如果涉及 REST API：路径是否使用名词复数、是否有动词混入路径、字段大小写风格是否与项目现有风格一致；
5. 如果涉及数据库变更：表名/字段名/索引名是否符合 [团队规范链接或摘要]。

请输出一张表格，包含以下列：文件:行号 | 现有命名 | 问题类型 | 建议命名 | 严重程度(高/中/低)。
表格之后，用一句话总结本次改动的整体命名质量。
```

### 13.4 网站落地建议

- 在网站「AI 提示词工具箱」页面，把 13.1~13.3 的每个模板做成"一键复制"卡片，并允许用户在页面上直接把 [语言]/[camelCase 或 snake_case] 等占位符替换为自己团队的选择，生成"团队专属版"文本再复制。
- 建议附一段简短说明："规则文件只是让 AI 更快对齐团队标准，最终仍需要人工复核——AI 给出的命名建议不是绝对正确答案。"避免读者把 AI 输出当作免检的权威结论。
- 若网站技术栈支持，可以考虑做一个小工具：粘贴一段代码，调用 Claude API（复用〈anthropic_api_in_artifacts〉能力）按 13.3 的提示词自动跑一遍命名审查，直接在页面里展示结果——这会让网站从"文档"升级为"轻量工具"，更贴合"给 AI 用"的深层定位。

---

## 十四、三语言分层 REST 服务命名规范样例（Java / Scala / Python）

> 目的：只讲抽象原则容易"知道但不会用"。这一章要求网站为 Java、Scala、Python 各提供一个**麻雀虽小五脏俱全的普通 REST 服务范例**，贯穿 Endpoint（接口层）→ Service（业务层）→ Storage（存储层）→ RPC（跨服务调用层）→ Unit Test（单元测试），让读者看到"同一个业务场景，在不同语言/社区惯例下，类名、方法名、参数名、字段名分别应该怎么起"。三个范例统一用**同一个业务场景**（创建用户 + 查询用户，且创建用户时需要调用积分服务 RPC 发放注册积分），方便横向对比。

### 14.1 统一的分层结构与职责定义（三语言通用骨架）

| 分层 | 职责 | 通用后缀/前缀惯例 |
|---|---|---|
| Endpoint / API 层 | 接收 HTTP 请求、参数校验、调用 Service、组装响应 | `xxxController` / `xxxRoutes` / `xxx_router` |
| Service 层 | 业务逻辑编排，事务边界 | `xxxService`（接口）+ `xxxServiceImpl`（实现，或语言习惯的默认实现名） |
| Storage / Repository 层 | 数据库读写，屏蔽 SQL/ORM 细节 | `xxxRepository` / `xxxDao` |
| RPC / Client 层 | 调用其他微服务（HTTP/gRPC/Thrift） | `xxxClient` |
| DTO / Schema 层 | 请求体、响应体、内部数据传输对象 | `XxxRequest` / `XxxResponse` / `XxxDTO` |
| Test 层 | 单元测试 | `xxxTest` / `xxxSpec` / `test_xxx`（因语言而异，见下） |

统一业务场景（三语言范例均实现这两个用例）：
1. `POST /users` 创建用户 → Service 校验邮箱唯一 → Repository 写库 → RPC 调用积分服务发放注册积分 → 返回用户信息。
2. `GET /users/{id}` 查询用户 → Service 从 Repository 读取 → 返回用户信息，不存在则 404。

---

### 14.2 Java 范例（Spring Boot 社区惯例）

**包结构**
```
com.example.userservice
 ├─ controller/UserController.java
 ├─ service/UserService.java
 ├─ service/impl/UserServiceImpl.java
 ├─ repository/UserRepository.java
 ├─ entity/UserEntity.java
 ├─ dto/CreateUserRequest.java
 ├─ dto/UserResponse.java
 ├─ client/PointsServiceClient.java     // RPC，调用积分服务
 └─ exception/EmailAlreadyExistsException.java
```

**分层命名规范表**

| 分层 | 类名规范 | 方法名规范 | 参数名规范 | 字段名规范 | 依据 |
|---|---|---|---|---|---|
| Controller | `UserController`（大驼峰 + Controller 后缀） | `createUser`、`getUserById`（小驼峰，动词开头） | `@RequestBody CreateUserRequest request`、`@PathVariable Long userId` | — | Spring 官方文档命名惯例；Google Java Style Guide |
| Service | 接口 `UserService`，实现类 `UserServiceImpl` | 与接口方法名一致：`createUser(CreateUserRequest request)`、`findUserById(Long userId)` | 入参用完整业务名词，避免 `req`/`param` 这类缩写 | — | 同上 |
| Repository | `UserRepository extends JpaRepository<UserEntity, Long>` | Spring Data 派生查询命名：`findByEmail`、`existsByEmail` | `String email`、`Long userId` | — | Spring Data JPA 命名规则（方法名即查询语义） |
| Entity | `UserEntity`（避免直接叫 `User`，与 DTO 区分开） | getter/setter 或 Lombok 自动生成 | — | `id`、`email`、`createdAt`、`updatedAt`（小驼峰，时间字段 `At` 结尾） | Google Java Style Guide + 团队 DB 命名映射 |
| DTO | 请求 `CreateUserRequest`，响应 `UserResponse` | — | — | 与 JSON 字段保持 camelCase 一致：`email`、`userId`、`createdAt` | 与〈5.8 Body 字段命名〉呼应 |
| RPC Client | `PointsServiceClient`（接口）+ `PointsServiceClientImpl` 或直接用 Feign/gRPC Stub | `grantRegistrationPoints(Long userId)` | 与被调用方 API 参数名保持语义一致，而非照抄内部字段名 | — | 与〈5.6 非CRUD动作端点命名〉呼应 |
| Exception | `EmailAlreadyExistsException`（业务语义 + `Exception` 后缀） | — | — | — | Java 社区惯例：异常类名即错误语义 |
| Unit Test | `UserServiceTest`（JUnit5，Test 后缀） | `createUser_shouldThrowException_whenEmailAlreadyExists()` 或 BDD 风格 `shouldThrowException_whenEmailAlreadyExists()` | — | — | JUnit5 社区惯例：`方法_条件_预期结果` 或 `should...When...` |

**核心代码片段（体现命名一致性，非完整实现）**
```java
// controller/UserController.java
@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<UserResponse> createUser(@RequestBody CreateUserRequest request) {
        UserResponse response = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long userId) {
        return userService.findUserById(userId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}

// service/impl/UserServiceImpl.java
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PointsServiceClient pointsServiceClient;

    @Override
    @Transactional
    public UserResponse createUser(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException(request.getEmail());
        }
        UserEntity savedUser = userRepository.save(UserEntity.from(request));
        pointsServiceClient.grantRegistrationPoints(savedUser.getId());
        return UserResponse.from(savedUser);
    }
}

// test/UserServiceTest.java
class UserServiceTest {

    @Test
    void createUser_shouldThrowException_whenEmailAlreadyExists() {
        // given / when / then
    }
}
```

---

### 14.3 Scala 范例（Akka HTTP + 社区风格指南，如 Databricks Scala Style Guide）

**包结构**
```
com.example.userservice
 ├─ http/UserRoutes.scala          // Endpoint 层
 ├─ service/UserService.scala      // trait
 ├─ service/DefaultUserService.scala
 ├─ repository/UserRepository.scala   // trait
 ├─ repository/SlickUserRepository.scala
 ├─ client/PointsServiceClient.scala  // RPC
 ├─ model/User.scala               // 领域模型（case class）
 ├─ dto/CreateUserRequest.scala
 ├─ dto/UserResponse.scala
 └─ EmailAlreadyExistsException.scala
```

**分层命名规范表**

| 分层 | 类型/命名规范 | 方法名规范 | 参数名规范 | 字段名规范 | 依据 |
|---|---|---|---|---|---|
| Endpoint (Routes) | `UserRoutes`（大驼峰 + Routes 后缀，Akka HTTP 惯例） | 路由内的处理函数用小驼峰：`createUser`、`getUserById` | — | — | Akka HTTP 官方示例惯例 |
| Service | trait `UserService`，默认实现 `DefaultUserService`（Scala 社区偏好 `Default`/`XxxImpl` 均可，但同一项目需统一） | `createUser(request: CreateUserRequest): Future[UserResponse]` | 小驼峰，类型显式标注 | — | Scala 社区风格指南（如 Databricks Scala Style Guide） |
| Repository | trait `UserRepository`，具体实现 `SlickUserRepository`（技术栈名 + Repository） | `findByEmail(email: String): Future[Option[User]]` | — | — | 同上，方法名沿用"动词+By+字段"惯例，与 Java 侧呼应 |
| Domain Model | `case class User(id: Long, email: String, createdAt: Instant)`（不可变 case class，字段即构造参数） | — | — | 字段小驼峰：`id`、`email`、`createdAt` | Scala 惯用不可变数据建模，字段名与 DTO/DB 映射保持一致 |
| DTO | `case class CreateUserRequest(email: String)`、`case class UserResponse(userId: Long, email: String, createdAt: Instant)` | — | — | 与 JSON 序列化后的 camelCase 保持一致（配合 circe/play-json 的自动命名） | 与〈5.8 Body 字段命名〉呼应 |
| RPC Client | `PointsServiceClient`（trait）+ `HttpPointsServiceClient`（实现，技术手段前缀） | `grantRegistrationPoints(userId: Long): Future[Unit]` | — | — | 与 Java 侧方法名保持跨语言一致，便于团队心智统一 |
| Exception | `EmailAlreadyExistsException`（继承 `RuntimeException`，语义化命名） | — | — | — | 与 Java 命名惯例保持一致，跨语言团队协作更顺畅 |
| Unit Test | `UserServiceSpec`（ScalaTest，`Spec` 后缀，区别于 Java 的 `Test`） | 不写"方法名"，而是用行为描述：`it should "throw an exception when email already exists" in { ... }` | — | — | ScalaTest 社区惯例：BDD 风格描述，比拼接方法名更贴近"描述行为" |

**核心代码片段**
```scala
// service/DefaultUserService.scala
class DefaultUserService(
    userRepository: UserRepository,
    pointsServiceClient: PointsServiceClient
)(implicit ec: ExecutionContext) extends UserService {

  override def createUser(request: CreateUserRequest): Future[UserResponse] =
    for {
      exists <- userRepository.existsByEmail(request.email)
      _ = if (exists) throw new EmailAlreadyExistsException(request.email)
      savedUser <- userRepository.save(User.from(request))
      _ <- pointsServiceClient.grantRegistrationPoints(savedUser.id)
    } yield UserResponse.from(savedUser)

  override def findUserById(userId: Long): Future[Option[UserResponse]] =
    userRepository.findById(userId).map(_.map(UserResponse.from))
}

// test/UserServiceSpec.scala
class UserServiceSpec extends AnyFlatSpec with Matchers {

  "UserService" should "throw an exception when email already exists" in {
    // given / when / then
  }

  it should "grant registration points after creating a user" in {
    // given / when / then
  }
}
```

---

### 14.4 Python 范例（FastAPI + PEP 8 社区惯例）

**模块结构**
```
app/
 ├─ api/routes/user.py          // Endpoint 层，router
 ├─ services/user_service.py    // Service 层
 ├─ repositories/user_repository.py  // Storage 层
 ├─ clients/points_service_client.py // RPC 层
 ├─ models/user.py              // ORM/领域模型
 ├─ schemas/user.py             // Pydantic 请求/响应模型
 └─ exceptions.py
tests/
 └─ test_user_service.py
```

**分层命名规范表**

| 分层 | 类型/命名规范 | 函数名规范 | 参数名规范 | 字段名规范 | 依据 |
|---|---|---|---|---|---|
| Endpoint (router) | 模块级变量 `user_router = APIRouter()`（文件/模块用 snake_case） | 路由处理函数 snake_case：`create_user`、`get_user_by_id` | 函数参数 snake_case：`user_id: int`，请求体用 Pydantic 模型类型标注 | — | PEP 8；FastAPI 官方文档惯例 |
| Service | 类 `UserService`（PascalCase，类名遵循 PEP 8 类命名规则） | 方法 snake_case：`create_user(self, request: CreateUserRequest) -> UserResponse` | 同上 | — | PEP 8 |
| Repository | 类 `UserRepository` | `find_by_email(self, email: str) -> Optional[User]`、`save(self, user: User) -> User` | — | — | PEP 8 + 社区惯例（方法名沿用"动词+by+字段"，与 Java/Scala 侧呼应） |
| ORM Model | 类 `User`（SQLAlchemy 惯例，模型类通常不加 Entity 后缀） | — | — | 字段 snake_case：`id`、`email`、`created_at`、`updated_at` | SQLAlchemy 社区惯例 + PEP 8 |
| Schema (DTO) | `CreateUserRequest(BaseModel)`、`UserResponse(BaseModel)`（PascalCase，Pydantic 惯例） | — | — | 字段默认 snake_case（`user_id`、`created_at`），对外 JSON 若需 camelCase，通过 Pydantic 的 `alias_generator`/`Field(alias=...)` 转换，而不是直接改 Python 字段名 | PEP 8 优先，同时兼容〈5.8〉里"Body 字段风格需全局统一"的要求 |
| RPC Client | 类 `PointsServiceClient` | `grant_registration_points(self, user_id: int) -> None` | — | — | 与 Java/Scala 侧方法语义保持一致 |
| Exception | `EmailAlreadyExistsError`（Python 社区偏好 `Error` 而非 `Exception` 作为自定义异常后缀） | — | — | — | PEP 8 及标准库惯例（如 `ValueError`、`KeyError`） |
| Unit Test | 文件 `test_user_service.py`，函数 `test_create_user_raises_error_when_email_exists` | 函数名即"test_+行为+条件"，snake_case，全小写 | — | — | pytest 社区惯例：`test_` 前缀是发现测试的硬性要求 |

**核心代码片段**
```python
# services/user_service.py
class UserService:
    def __init__(self, user_repository: UserRepository, points_client: PointsServiceClient):
        self._user_repository = user_repository
        self._points_client = points_client

    def create_user(self, request: CreateUserRequest) -> UserResponse:
        if self._user_repository.exists_by_email(request.email):
            raise EmailAlreadyExistsError(request.email)
        saved_user = self._user_repository.save(User.from_request(request))
        self._points_client.grant_registration_points(saved_user.id)
        return UserResponse.from_model(saved_user)

    def find_user_by_id(self, user_id: int) -> Optional[UserResponse]:
        user = self._user_repository.find_by_id(user_id)
        return UserResponse.from_model(user) if user else None


# tests/test_user_service.py
def test_create_user_raises_error_when_email_exists(user_service, mock_repository):
    mock_repository.exists_by_email.return_value = True
    with pytest.raises(EmailAlreadyExistsError):
        user_service.create_user(CreateUserRequest(email="a@b.com"))
```

---

### 14.5 三语言横向对照表（同一场景，快速类比）

| 分层/概念 | Java (Spring Boot) | Scala (Akka HTTP) | Python (FastAPI) |
|---|---|---|---|
| Endpoint 类命名 | `UserController` | `UserRoutes` | `user_router`（模块级变量，非类） |
| Service 接口/实现 | `UserService` / `UserServiceImpl` | `UserService`（trait） / `DefaultUserService` | `UserService`（类，Python 无接口/实现区分，靠鸭子类型或 `Protocol`） |
| 存储层命名 | `UserRepository`（interface, Spring Data 派生查询） | `UserRepository`（trait） / `SlickUserRepository` | `UserRepository`（类） |
| RPC 客户端 | `PointsServiceClient` | `PointsServiceClient` | `PointsServiceClient` |
| 领域模型/Entity | `UserEntity` | `case class User` | `User`（ORM 模型类） |
| 请求/响应 DTO | `CreateUserRequest` / `UserResponse` | `CreateUserRequest` / `UserResponse`（case class） | `CreateUserRequest` / `UserResponse`（Pydantic `BaseModel`） |
| 字段大小写 | camelCase | camelCase | snake_case（对外 JSON 可用 alias 转 camelCase） |
| 自定义异常后缀 | `...Exception` | `...Exception` | `...Error` |
| 单元测试文件/类命名 | `UserServiceTest`（JUnit5） | `UserServiceSpec`（ScalaTest） | `test_user_service.py`（pytest，模块级） |
| 测试方法命名风格 | `方法_条件_预期结果` | BDD 行为描述字符串（`should "..." in {}`） | `test_行为_条件`（snake_case 全小写） |

**给 AI Agent 的写作提示**：
- 这一横向对照表建议单独做成网站里的一个"多语言对照"卡片/页面，允许用户通过 Tab 在 Java/Scala/Python 之间切换查看同一场景的完整代码，强化"同一套原则，不同语言各自的社区表达方式"这一核心认知。
- 三个范例服务的完整可运行代码（含 build 文件：`pom.xml`/`build.sbt`/`pyproject.toml`）建议作为独立的 GitHub 仓库或 monorepo 子目录发布，网站正文引用其 GitHub 链接，不必把整个工程内联在文档页面里，避免页面过重。
- 命名差异（如异常后缀 `Exception` vs `Error`、字段大小写 camelCase vs snake_case）要明确标注"这是语言社区惯例差异，不是错误"，避免读者误以为某一方"不规范"。

---

## 十五、全链路操作设计参考（Create / Retrieve-Filter / Update / Delete / 关联查询）

> 命名规范解决"叫什么"，这一章解决"该怎么设计"。对每种常见操作，从 Endpoint → Service → Storage 讲清楚**职责划分、常见坑、以及对应的命名落点**，让读者能把〈一~三〉〈十四〉的命名规则套用到真实设计决策里。

### 15.1 创建 Create

| 层 | 设计要点 | 命名落点 | 常见坑 |
|---|---|---|---|
| Endpoint | `POST /resources`；建议支持 `Idempotency-Key` 请求头防重复提交 | 方法名 `createXxx`；成功返回 `201 Created` + `Location` 响应头 | 把创建接口设计成可以被重复点击两次却产生两条记录 |
| Service | 校验业务规则（唯一性、配额），组装领域对象，编排副作用（写库 + RPC + 发事件） | `CreateXxxRequest` → `XxxResponse`；如需要发领域事件命名为 `XxxCreatedEvent` | 把参数校验和业务规则校验混在一起，导致 Service 方法过长、职责不清晰 |
| Storage | 插入并返回生成的主键；唯一性约束建议数据库层也加一道（不要只信任应用层校验） | `save` / `insert`，返回值命名为新建实体本身而非裸 ID | 只在应用层查重（先 SELECT 再 INSERT），并发场景下会产生竞态条件，产生重复记录 |
| 响应设计 | 返回创建后的完整资源表示，而不是仅返回一个 ID | — | 只返回 `{"id": 123}`，前端还要再发一次 GET 才能拿到完整数据，增加一次不必要的往返 |

### 15.2 检索/过滤 Retrieve & Filter

**核心设计决策：单个查询（"按 ID 查"）和列表查询（"按条件搜"）在语义上完全不同，命名和返回类型都要体现这种差异。**

| 场景 | 命名 | 返回类型 | 找不到时的行为 |
|---|---|---|---|
| 按主键单条查询 | `findXxxById` / `getXxxById` | `Optional<Xxx>` / `Option[Xxx]` / `Xxx \| None` | 不是错误，是"合法的缺失"，交由调用方决定是否升级为错误（见〈十七〉） |
| 条件过滤/搜索列表 | `searchXxx` / `listXxx` | 分页集合（`Page<Xxx>` 或自定义 `{items, page, pageSize, totalCount}`） | 空列表是正常结果，不应抛异常，也不应返回 404 |

- **过滤参数对象化**：当过滤条件超过 2~3 个时，不要在方法签名里堆砌参数（呼应〈第一章〉长参数列表反模式），改为聚合成一个 `XxxSearchCriteria` / `XxxFilter` 对象：
```java
public class UserSearchCriteria {
    private String emailContains;
    private UserStatus status;
    private Instant createdAfter;
    private PageRequest pageRequest; // page, pageSize, sortBy, order
}
```
- **分页参数命名统一**：全站只能二选一并写入规范——`page`+`pageSize`（页码分页）或 `cursor`+`limit`（游标分页）。游标分页更适合数据量大、频繁变化的列表（避免深分页性能问题），页码分页更适合需要"跳转到第 N 页"的管理后台场景。
- **过滤 vs 搜索的接口设计**：简单精确匹配用 Query 参数（`?status=active`）；复杂全文检索建议单独开一个语义清晰的端点或用 `POST /resources/search`（请求体传复杂查询 DSL），避免把过长的过滤条件塞进 URL。

### 15.3 修改 Update（全量 vs 局部）

| 方式 | HTTP 方法 | 语义 | 命名落点 | 适用场景 |
|---|---|---|---|---|
| 全量替换 | `PUT /resources/{id}` | 幂等，必须提交完整资源表示，未提交字段视为置空 | `updateXxx(id, XxxRequest)` | 客户端总是拿到完整对象后再整体提交（如表单编辑页） |
| 局部更新 | `PATCH /resources/{id}` | 只提交变化的字段 | `patchXxx(id, XxxPatchRequest)` 或 `partialUpdateXxx` | 移动端/精细化字段更新，减少误覆盖风险 |

- **局部更新的 DTO 设计**：`XxxPatchRequest` 中每个字段都应该是 `Optional<T>` / `Option[T]`（Java/Scala）或显式区分"未传"与"传了 null"（Python 可用 `Unset` 哨兵值或 `exclude_unset` 机制），否则无法区分"用户没有传这个字段"和"用户想把这个字段清空"。
- **函数式建模下的更新**：在不可变数据风格（如 Scala case class）中，"更新"本质是"基于旧值构造一个新值"，命名上体现"生成新版本"而非"原地修改"：
```scala
val updatedUser: User = existingUser.copy(email = newEmail, updatedAt = Instant.now())
```
- **并发控制命名**：需要乐观锁时，实体上加 `version` 字段（或用 `updatedAt` 做 ETag），接口层通过 `If-Match` 请求头传入版本号，冲突时返回 `409 Conflict`，方法命名可为 `updateXxxIfVersionMatches` 或在 Service 内部统一处理，不必把"乐观锁"字样写进每个方法名里（避免命名过度暴露实现细节）。

### 15.4 删除 Delete（软删 / 硬删）

| 类型 | 命名 | 数据库表现 | 使用建议 |
|---|---|---|---|
| 软删除（默认推荐） | `deleteXxx`（对外语义"删除"，内部实现是标记） | `deleted_at` 置为当前时间，默认查询自动过滤 `deleted_at IS NULL` | 绝大多数业务资源应默认软删，保留可恢复性和审计能力 |
| 硬删除 | `purgeXxx` / `hardDeleteXxx`（命名必须明确区别于普通删除，提示"不可逆"） | 真正执行 `DELETE FROM` | 只在合规要求（如 GDPR 数据擦除）或后台清理任务中使用，且需要单独的权限控制 |

- **幂等性**：`DELETE /resources/{id}` 对已经被删除的资源再次调用，建议依然返回 `204 No Content`（幂等语义），而不是 `404`；具体选择需要写进团队规范并全站统一，避免各接口行为不一致。
- **级联删除的命名与设计**：涉及关联资源级联删除时，要在 Service 层显式编排（如 `deleteUserAndCascadeOrders`），不要仅依赖数据库外键 `ON DELETE CASCADE` 静默处理业务上重要的级联关系——至少要保证这个决策在代码里"看得见"。

### 15.5 关联关系查询 Relational Query

| 设计问题 | 反模式 | 推荐做法 | 命名落点 |
|---|---|---|---|
| N+1 查询 | 先查用户列表，再对每个用户循环查订单 | Repository 层提供批量预加载方法，一次性 JOIN 或批量 IN 查询 | `findAllWithOrders`（预加载版）区别于 `findAll`（精简版），让调用方明确知道自己拿到的是"带关联数据"还是"轻量版" |
| 响应体结构 | 直接把 ORM 实体（含所有关联对象的懒加载代理）序列化返回 | 显式定义组合 DTO，只暴露需要的字段 | `UserWithOrdersResponse { user: UserResponse, orders: List<OrderSummary> }` |
| 客户端按需展开关联数据 | 每个关联关系都单独开一个"膨胀版"接口（`getUserWithOrders`、`getUserWithOrdersAndPayments`……组合爆炸） | 参考 JSON:API 的 `include` 查询参数惯例：`GET /users/1?include=orders,payments`，由客户端声明需要展开哪些关联 | Service/Repository 层对应提供可组合的加载方法，而不是为每种组合单独写一个方法 |

---

## 十六、解耦与正交设计原则

> 命名让单个符号"说人话"，这一章讲的是让模块与模块之间"互不拖累"——参考《The Pragmatic Programmer》(Hunt & Thomas) 中关于"正交性"（Orthogonality）的论述、以及《代码大全》第 5~6 章关于设计与类的构建思想，转述为可直接落地的分层实践。

### 16.1 分层单向依赖

- 依赖方向必须单向：`Endpoint → Service → Repository/Client`，禁止反向依赖（如 Repository 反过来调用 Service）。
- Service 依赖 Repository 的**接口/trait**，而不是具体实现类（依赖倒置，Dependency Inversion）；具体实现通过依赖注入在启动时装配。这样做的直接收益：单元测试时可以用 Mock/Stub 替换 Repository，不需要真实数据库。

### 16.2 正交性：模块之间互不知晓内部细节

**判断标准：修改模块 A 的内部实现，是否需要连带修改模块 B？如果需要，说明两者不正交，存在不必要的耦合。**

| 反例（耦合） | 正例（正交） | 说明 |
|---|---|---|
| `UserService` 里直接拼 SQL 字符串操作数据库 | `UserService` 只依赖 `UserRepository` 接口，SQL 细节完全封装在实现类内部 | Service 换用哪种存储技术（MySQL/Mongo/内存）不应该影响业务逻辑代码 |
| `UserController` 直接依赖具体的 `MySqlUserRepositoryImpl` | `UserController` 只依赖 `UserService` 接口，`UserService` 只依赖 `UserRepository` 接口 | 每一层只知道"下一层的契约"，不知道"下一层的实现细节" |
| 一个函数既做参数校验，又做业务计算，还顺带写日志和发消息 | 拆成职责单一的小函数：`validate` / `calculate` / `persist` / `notify`，由上层编排调用顺序 | 每个小函数可以独立测试、独立复用、独立替换 |

### 16.3 端口与适配器（Ports & Adapters / 六边形架构）

- 领域核心（Domain / Service 层的业务逻辑）不应该 `import` 任何框架相关的类（如 Spring 的 `@Component`、数据库驱动、HTTP 客户端库）。
- HTTP Controller、数据库 Repository 实现、RPC Client 实现都是"适配器"，它们实现由领域层定义的"端口"（接口/trait）。
- 收益：业务逻辑可以脱离框架单独跑单元测试；替换 Web 框架或数据库时，领域层代码零改动。

### 16.4 Command / Query 分离（轻量级 CQRS）

- 即使不引入完整的 CQRS 基础设施，也建议在设计上区分"读路径"和"写路径"：
  - 写路径（Command）：`CreateXxxRequest` 等输入型 DTO，重点是校验完整性和业务规则。
  - 读路径（Query）：`XxxResponse` / `XxxSummary` 等输出型 DTO，可以按展示需要裁剪字段，不必和写入模型字段一一对应。
- 一个常见误区是"一个模型走天下"：用同一个类既承担数据库实体、又承担请求体、又承担响应体，导致任何一处改动都互相牵连——这正是"不正交"的典型表现。

### 16.5 可组合性：小函数优于大函数

- 优先编写没有副作用、输入输出明确的小函数，通过组合构建复杂行为，而不是写一个"做了十件事"的大函数。
- 在 OOP 语言中体现为职责单一的方法 + 组合调用；在 FP 语言（如 Scala + cats-effect）中体现为通过 `for-comprehension` / `flatMap` 链式组合多个小的 `F[_]` 计算（见〈十七〉）。

---

## 十七、cats-effect 生态专属设计规范

> 这一章面向使用 Scala + cats-effect（`IO`、Tagless Final 风格）技术栈的团队，重点回答一个高频困惑：**错误到底该用 sealed trait 的 Error ADT 表示，还是用 `Option` 表示？** 以及这套生态里其他值得沉淀成规范的命名/设计惯例。

### 17.1 Option vs Error ADT：判断标准

**核心原则：`Option` 表示"缺失是一种合法、预期内的状态"；Error ADT（通常配合 `Either`/`EitherT`）表示"这是一种需要调用方特殊处理、带有语义信息的失败"。**

| 场景 | 用 Option 还是 Error ADT | 理由 | 示例签名 |
|---|---|---|---|
| Repository 按主键查询，可能查无此记录 | `Option` | 查一条不存在的记录本身不是"失败"，是数据库的正常回答 | `def findById(id: UserId): F[Option[User]]` |
| Service 层某个动作要求用户必须存在（否则无法继续） | 把 `Option` 提升为 Error ADT | 在这个业务语境下，"用户不存在"变成了一个需要被调用方感知并处理（比如返回 404）的失败分支 | `EitherT.fromOptionF(repo.findById(id), UserError.UserNotFound)` |
| 邮箱已被占用、参数格式非法、余额不足等业务规则校验失败 | Error ADT | 这些失败有明确的语义，调用方（如 Controller）需要据此映射成不同的 HTTP 状态码和错误信息 | `sealed trait UserError`；`case class EmailAlreadyExists(email: String) extends UserError` |
| 领域模型里某个字段本身就是可选的（如用户中间名） | `Option` | 这是数据建模层面的"可能没有这个值"，与错误处理无关，只是恰好复用了同一个类型 | `case class User(id: UserId, email: String, middleName: Option[String])` |
| 外部 RPC 调用超时/网络失败 | Error ADT（通常还需要区分"可重试"与"不可重试"两类） | 需要携带足够信息供上层决定重试策略、告警级别 | `sealed trait PointsServiceError`；`case class Timeout(afterMs: Long) extends PointsServiceError` |
| 多个字段同时校验，需要一次性收集所有错误而不是查到第一个就短路 | Error ADT + `ValidatedNel`（而非 `Either`） | `Either`/`EitherT` 是短路语义（遇到第一个错误就停）；`ValidatedNel` 是累积语义，适合表单类校验场景 | `def validate(req: CreateUserRequest): ValidatedNel[ValidationError, CreateUserRequest]` |

**一句话记忆：Option 回答"有没有"，Error ADT 回答"为什么不行、该怎么办"。当"没有"这件事本身需要被调用方特殊处理并展示给用户明确的原因时，就该从 Option 升级为 Error ADT。**

### 17.2 错误 ADT 的命名与组织规范

```scala
sealed trait UserError extends Product with Serializable

object UserError {
  final case class EmailAlreadyExists(email: String) extends UserError
  final case class InvalidEmailFormat(email: String) extends UserError
  case object UserNotFound extends UserError
}
```

- 顶层用 `sealed trait Xxx­Error`，按领域（而非按层）划分——`UserError`、`OrderError`，而不是笼统的一个全局 `AppError`（除非项目规模很小）。
- 具体错误用 `case class`（需要携带上下文信息，如 `email: String`）或 `case object`（无附加信息，如 `UserNotFound`）。
- 命名用"名词短语描述失败原因"，不加 `Error` 后缀在每个子类型上重复（父 trait 已经叫 `UserError`，子类型直接叫 `EmailAlreadyExists` 即可，不必写成 `EmailAlreadyExistsError`）。
- Controller/Endpoint 层负责把 Error ADT 映射为 HTTP 状态码，建议用一个集中的 `xxxErrorMapper`，避免每个 Controller 方法里散落 `match` 语句。

### 17.3 Tagless Final 与算法/解释器命名

```scala
trait UserService[F[_]] {
  def createUser(request: CreateUserRequest): F[Either[UserError, UserResponse]]
  def findUserById(id: UserId): F[Option[UserResponse]]
}
```

- Trait（"算法"，algebra）用领域名词命名：`UserService[F[_]]`。
- 具体解释器（interpreter/实现）命名，社区里常见几种流派：`UserServiceImpl`、`DefaultUserService`、`LiveUserService`（ZIO 生态更常见但 cats-effect 项目里也不少见）——**团队需要三选一并写入规范**，不要在同一个项目里混用多种风格。
- 类型参数统一用 `F[_]`，约束（typeclass constraint）就近声明在需要的地方，如 `def createUser[F[_]: Sync](...)` 或在 trait/class 级别声明 `class DefaultUserService[F[_]: Async](...)`。

### 17.4 资源管理与并发状态命名

- 需要获取/释放的资源（数据库连接池、HTTP 客户端）用 `Resource[F, A]` 建模，命名 `xxxResource`：`def dbResource: Resource[F, Transactor[F]]`。
- 并发可变状态用 `Ref[F, State]`，变量名体现"这是被并发安全管理的状态"，如 `Ref[F, Map[UserId, Int]]` 命名为 `userPointsCacheRef`（`Ref` 后缀提示这不是普通字段，操作需要走 `.get`/`.update` API）。

### 17.5 与其他章节的呼应

- 本章的 `UserError`/`Option` 判断标准，与〈十五 · 15.2 检索/过滤〉中"按 ID 查询可能查无此记录，属于合法缺失"的结论完全一致——这不是 Scala 特有的规则，只是 cats-effect 生态提供了更精确的类型工具（`Option` vs `Either`）把这个原则在类型层面强制表达出来。
- 与〈十四·14.3 Scala 范例〉的 `UserRepository.findByEmail` 返回类型呼应，建议网站在这两处内容之间加交叉链接。

---

## 十八、网站信息架构优化说明

> 随着内容从"命名规范"扩展到"命名规范 + 架构设计规范 + 语言生态专属实践"，原来扁平的一~八分类已经不够用，容易让读者迷失。这一章说明重构后的 IA（见〈三、网站信息架构〉最新版）背后的取舍，以及进一步的交互优化建议。

### 18.1 为什么要分组导航

- 原来的扁平列表混杂了"规则类内容"（命名）、"决策类内容"（设计原则）、"范例类内容"（多语言服务）、"工具类内容"（AI 提示词），读者很难通过标题猜到自己该点哪个。
- 重构后按**使用意图**分成 6 组（快速开始 / 命名规范 / 架构与设计原则 / 多语言范例 / 案例与工具 / 参考资料），对应读者的典型访问路径：
  - 新人第一次来 → 快速开始
  - 做 Code Review 时临时查一条规则 → 命名规范 或 案例库搜索
  - 做技术方案设计时 → 架构与设计原则
  - 需要抄一份可运行的分层代码结构 → 多语言范例
  - 想让 AI 帮忙审查代码 → AI 提示词工具箱

### 18.2 首页改造建议

- 首页不再是单纯的三张分类卡片，改为**按角色的快捷入口 + 全局搜索框**：
  - "我是新人" → 直达新人培训路径
  - "我在做 Code Review" → 直达命名反模式清单 + AI 提示词工具箱
  - "我在设计新接口/新表" → 直达 API 命名 + DB 命名 + 全链路操作设计参考
  - "我在做技术方案/架构评审" → 直达解耦与正交设计原则
- 首页保留一个"最近更新"模块，展示案例库最新新增的对比案例，让老用户有理由回访。

### 18.3 交互增强建议

- **决策树/流程图组件**：把〈17.1 Option vs Error ADT 判断标准〉做成一个可点击的交互式决策树（复用 Visualizer/diagram 能力），读者回答"这个缺失情况需不需要调用方特殊处理？"就能得到结论，比读表格更直观。
- **案例库支持多维筛选**：给每条对比案例打标签（语言：Java/Scala/Python/通用；主题：命名/架构/DB；层级：Endpoint/Service/Repository），案例库页面支持组合筛选，而不是只能线性翻页。
- **面包屑 + 页内目录**：由于层级变深（分组 → 大章 → 小节），每个内容页顶部需要面包屑导航，右侧需要"本页目录"锚点导航，避免长页面里迷失。
- **交叉引用高亮**：像〈17.5〉这种"与其他章节呼应"的引用，建议做成可悬浮预览的内链（hover 卡片显示目标章节摘要），减少来回跳转成本。

### 18.4 对交付物清单的补充

- [ ] 首页按角色的快捷入口 + 全局搜索
- [ ] 决策树交互组件（至少覆盖 Option vs Error ADT 场景）
- [ ] 案例库多维标签筛选（语言 × 主题 × 层级）
- [ ] 全站面包屑 + 页内目录锚点
- [ ] 章节间交叉引用的悬浮预览
