/* =========================================================================
 * data.js —— 全站内容数据源（数据驱动渲染）
 * 所有页面正文、对比表格、案例、速查表、参考资料、提示词、题库都在此定义。
 * 新增/修改内容只需改这里，无需构建。
 * 命名约定：JS 变量驼峰；本文件对象键用小驼峰；字符串内示例用 TypeScript。
 * ========================================================================= */

window.SITE_DATA = {
  site: {
    brand: "命名规范指南",
    tagline:
      "面向工程师的代码 / REST API / 数据库命名规范速查与深入理解站点——用对比示例讲清「为什么」。",
    intro:
      "本站把分散在《代码大全》《编写可读代码的艺术》以及 Google / Microsoft / Airbnb 等业界规范中的命名经验，提炼成「一句话原则 + 反例正例对比 + 真实示例」的双层结构：既能在 5 秒内扫到结论，也能在 10 秒内理解原理。",
  },

  /* =======================================================================
   * 三大分类：代码命名(10节) / API 命名(8节) / 数据库命名(5节)
   * 每节：id(用于 hash 路由) / title / principle(加粗一句话) / why(可折叠原理)
   *      / tables(对比表) / examples(语言示例) / refs(引用来源)
   * table.type: "three" -> {bad, good, note};  "four" -> {group, bad, good, note}
   * ===================================================================== */
  categories: [
    /* ---------------------- 一、代码命名规范 ---------------------- */
    {
      id: "code",
      title: "代码命名规范",
      icon: "💻",
      summary: "变量、函数、类、布尔、常量、集合、缩写、作用域与反模式清单。",
      sections: [
        {
          id: "code-basics",
          title: "1. 命名基本原则",
          principle:
            "命名要暴露意图、保持全局一致、并用作用域决定长度；好名字让代码读起来像散文。",
          why:
            "《代码大全》第 11 章的核心观点是：变量名是代码自注释的第一手段，名字越能说明「为什么存在 / 做什么」，阅读者就越不需要翻上下文。《编写可读代码的艺术》第 1 章进一步强调「把信息装进名字里」——能用名字讲清的，就不要靠注释补。一致性则降低团队认知负担：同一概念在全代码库必须只有一个词来表达。",
          tables: [
            {
              type: "three",
              columns: ["❌ 反例", "✅ 正例", "说明"],
              rows: [
                { bad: "x", good: "userCount", note: "极短变量名仅限极短循环体；出了作用域必须自解释" },
                { bad: "getUser / Fetch_Order", good: "getUser / fetchOrder（全站统一驼峰）", note: "风格不统一比风格本身更伤可读性" },
                { bad: "recieveCount", good: "receiveCount", note: "拼写错误会让搜索与全局替换失效" },
                { bad: "userList 与 yonghuMing 混用", good: "统一用英文：users / userName", note: "中英混用让团队无法共享词汇表" },
                { bad: "client / customer / user 指同一人", good: "选定一个术语（如 user）贯穿全站", note: "同义词混用制造隐蔽的重复逻辑" },
                { bad: 'isAdmin = "true"（字符串）', good: "isAdmin: boolean = true", note: "类型与命名要匹配，别用字符串伪装布尔" },
              ],
            },
          ],
          examples: [
            {
              lang: "typescript",
              caption: "好名字让代码几乎不需要注释",
              code:
                "// 意图一目了然，读起来像句子\n" +
                "const activeUserCount = users.filter((u) => u.isActive).length;\n" +
                "\n" +
                "// 反例（仅示意，对照上方表格）:\n" +
                "// const n = u.filter((x) => x.a).length;",
            },
          ],
          refs: ["《代码大全》第11章「变量名的力量」", "《编写可读代码的艺术》第1章"],
        },
        {
          id: "code-variable",
          title: "2. 变量命名",
          principle:
            "变量名应暴露意图，长度与作用域成反比，避免无意义噪音词。",
          why:
            "《代码大全》第 11 章指出，变量名应当回答「这个值是什么 / 为什么存在」。像 data、info、temp、flag 这类「万能词」没有携带任何领域信息，读者必须继续往下读才能明白用途。《编写可读代码的艺术》第 2 章建议：作用域越大的变量，名字越要完整，因为读它的人离它的定义越远。",
          tables: [
            {
              type: "three",
              columns: ["❌ 反例", "✅ 正例", "说明"],
              rows: [
                { bad: "d", good: "elapsedDays", note: "单字母变量无法表达意图，仅限极短循环体内使用" },
                { bad: "data / info / temp", good: "userProfile / retryCount", note: "「万能词」未传达任何领域信息" },
                { bad: "list1", good: "activeUserIds", note: "数字后缀是命名思考不足的信号" },
                { bad: "flag", good: "isEmailVerified", note: "应说明「是什么状态」而非「这是个标志」" },
                { bad: "getUserInfo2", good: "getUserInfoWithOrders", note: "数字后缀掩盖了两个函数真正的语义差异" },
                { bad: "theList", good: "pendingOrders", note: "冠词/代词不具备区分度" },
                { bad: "usrNm", good: "userName", note: "非通用缩写增加阅读成本" },
                { bad: "maxNum", good: "maxRetryCount", note: "说明「什么的最大值」，避免歧义" },
              ],
            },
          ],
          examples: [
            {
              lang: "typescript",
              caption: "用领域词代替万能词",
              code:
                "// 反例\n" +
                "const data = load();\n" +
                "const temp = data.items[0];\n" +
                "\n" +
                "// 正例\n" +
                "const orderBatch = loadOrderBatch();\n" +
                "const firstOrder = orderBatch.items[0];",
            },
          ],
          refs: ["《代码大全》第11章", "《编写可读代码的艺术》第2章"],
        },
        {
          id: "code-function",
          title: "3. 函数/方法命名",
          principle:
            "函数名 = 动词 + 名词，准确描述「做什么」而不是「怎么做」；避免名不副实。",
          why:
            "《编写可读代码的艺术》第 2 章强调：函数名应当包含「更多信息」，让名字能替代注释。最关键的一条是「名副其实」——若名字承诺只读（getX），实际却有写库副作用，就是欺骗性命名，会误导调用方。《代码大全》也建议用强动词精确表达动作，避免 handle / process 这类等于没说的万能词。",
          tables: [
            {
              type: "three",
              columns: ["❌ 反例", "✅ 正例", "说明"],
              rows: [
                { bad: "getUser()（内部会写库）", good: "createOrGetUser() / fetchAndPersistUser()", note: "函数名承诺了只读，实际有副作用，属于欺骗性命名" },
                { bad: "handleData()", good: "parseCsvToOrders()", note: "handle/process 是万能词，等于没说" },
                { bad: "doIt()", good: "sendConfirmationEmail()", note: "名字必须能替代注释" },
                { bad: "check(user)", good: "validateUserAge(user)", note: "说明检查的具体维度" },
                { bad: "stop()", good: "cancelSubscription()", note: "描述业务动作而非泛化动词" },
                { bad: "calc()", good: "calculateMonthlyInterest()", note: "完整单词，减少认知负担" },
                { bad: "isUserValid()（返回错误列表）", good: "validateUser() 返回 Error[]", note: "命名要与返回类型语义一致" },
              ],
            },
          ],
          examples: [
            {
              lang: "typescript",
              caption: "动词 + 名词，且名副其实",
              code:
                "// 反例：名字像只读，实际会落库\n" +
                "function getUser(id: string) { /* 内部 INSERT ... */ }\n" +
                "\n" +
                "// 正例：名字如实反映副作用\n" +
                "function createOrGetUser(id: string): User {\n" +
                "  const existing = userRepo.find(id);\n" +
                "  return existing ?? userRepo.insert({ id });\n" +
                "}",
            },
          ],
          refs: ["《编写可读代码的艺术》第2章", "《代码大全》第11章"],
        },
        {
          id: "code-class",
          title: "4. 类/接口/类型命名",
          principle:
            "类名用名词/名词短语表达职责，避免 Manager/Helper/Util 等万能词；接口命名跟随语言社区惯例。",
          why:
            "《代码大全》第 11 章提醒：类名应当明确它「负责什么」。Manager、Helper、Util 这类词不携带任何业务含义，使用它们往往意味着职责还没想清楚，最终变成「垃圾桶类」。类型/接口名则应让使用者一眼看懂它能做什么；是否加 I 前缀取决于语言社区惯例（如 C# 常用 I 前缀，Java/TypeScript 通常不推荐）。",
          tables: [
            {
              type: "four",
              columns: ["类别", "❌ 反例", "✅ 正例", "说明"],
              rows: [
                { group: "类名", bad: "Manager / Helper / Util", good: "OrderPaymentReconciler", note: "万能类名会变成「垃圾桶类」" },
                { group: "常量", bad: "MAX = 100", good: "MAX_LOGIN_ATTEMPTS = 100", note: "常量必须自解释" },
                { group: "集合(数组)", bad: "userList（存的是 IDs）", good: "userIds", note: "类型后缀应准确，List 不代表内容" },
                { group: "Map", bad: "map", good: "userIdToOrderCount", note: "Map 命名建议 keyToValue 模式" },
                { group: "枚举", bad: "Status { A, B, C }", good: "OrderStatus { PENDING, PAID, SHIPPED }", note: "枚举值需自解释业务含义" },
                { group: "接口", bad: "IUserService（Java 中不推荐 I 前缀）", good: "UserService", note: "视语言社区惯例而定，需在站点注明「语言差异」" },
                { group: "类型别名", bad: "DataObj", good: "UserProfilePayload", note: "避免 Obj 类万能词" },
              ],
            },
          ],
          examples: [
            {
              lang: "typescript",
              caption: "类型与接口用名词短语表达职责",
              code:
                "// 反例\n" +
                "class UserManager { /* 什么都管 */ }\n" +
                "\n" +
                "// 正例\n" +
                "interface UserService {\n" +
                "  getUserById(id: string): User;\n" +
                "}\n" +
                "class OrderPaymentReconciler {\n" +
                "  reconcile(orders: Order[]): void;\n" +
                "}",
            },
          ],
          refs: ["《代码大全》第11章", "《编写可读代码的艺术》第3章"],
        },
        {
          id: "code-boolean",
          title: "5. 布尔量命名",
          principle:
            "布尔变量/函数名应能直接放入 if 语句朗读成一句通顺的话，使用 is/has/can/should 前缀。",
          why:
            "《编写可读代码的艺术》第 1 章举例：好的布尔名读起来像断言。把 is / has / can / should 放在前面，能让 `if (user.isEmailVerified)` 直接读成自然语言。避免使用名词（status）或裸动词（check），也避免双重否定（hasNoError / notEmpty），因为 `if (!hasNoError)` 极难快速理解。",
          tables: [
            {
              type: "three",
              columns: ["❌ 反例", "✅ 正例", "说明"],
              rows: [
                { bad: "status", good: "isActive", note: "status 是名词，无法判断真假语义" },
                { bad: "check", good: "isValid", note: "动词裸词不表达「检查结果」" },
                { bad: "visible", good: "isVisible", note: "缺少 is 前缀，读起来像名词" },
                { bad: "notEmpty", good: "isEmpty（取反使用）", note: "避免双重否定 if (!isNotEmpty)" },
                { bad: "hasNoError", good: "hasError", note: "同上，双重否定难以阅读" },
                { bad: "enable", good: "isEnabled", note: "动词原形容易与「启用它」的命令混淆" },
                { bad: "flag_delete", good: "isDeleted", note: "避免下划线与拼音式缩写混用" },
              ],
            },
          ],
          examples: [
            {
              lang: "typescript",
              caption: "布尔名能直接读成 if 断言",
              code:
                "const user = { isEmailVerified: false, hasActiveSubscription: true };\n" +
                "\n" +
                "// 读起来像句子\n" +
                "if (user.isEmailVerified && user.hasActiveSubscription) {\n" +
                "  grantAccess(user);\n" +
                "}",
            },
          ],
          refs: ["《编写可读代码的艺术》第1章"],
        },
        {
          id: "code-constant",
          title: "6. 常量/枚举命名",
          principle:
            "常量全大写 + 下划线（或跟随语言约定）；枚举值自解释业务含义，禁止裸魔法数字。",
          why:
            "《代码大全》第 11 章建议：常量名应当让读代码的人「不用看赋值就能明白用途」。裸数字（如 `if (code === 200)`）是魔法数字，含义写在作者脑子里而非代码里；用命名常量或枚举替代，既自解释也便于全局修改。枚举值本身要表达业务语义，而不是 A/B/C 这种占位符。",
          tables: [
            {
              type: "three",
              columns: ["❌ 反例", "✅ 正例", "说明"],
              rows: [
                { bad: "const T = 3", good: "const MAX_RETRY = 3", note: "常量必须自解释用途" },
                { bad: "const status = 1", good: "const OrderStatus = { PENDING: 'PENDING' }", note: "用枚举表达离散状态" },
                { bad: 'const URL = "..."', good: "const PAYMENT_GATEWAY_BASE_URL = '...'", note: "URL 也要说明它属于哪一类" },
                { bad: "if (code === 200)", good: "if (code === HttpStatus.OK)", note: "避免魔法数字，用命名常量" },
                { bad: "const pi = 3.14", good: "const PI = 3.1415926535", note: "数学常量全大写是行业惯例" },
                { bad: "enum { READ, WRITE }", good: "enum Permission { READ, WRITE }", note: "枚举本身要命名，值才有上下文" },
              ],
            },
          ],
          examples: [
            {
              lang: "typescript",
              caption: "枚举替代魔法数字",
              code:
                "enum OrderStatus {\n" +
                "  PENDING = 'PENDING',\n" +
                "  PAID = 'PAID',\n" +
                "  SHIPPED = 'SHIPPED',\n" +
                "}\n" +
                "\n" +
                "const order = { status: OrderStatus.PAID };\n" +
                "if (order.status === OrderStatus.PAID) ship(order);",
            },
          ],
          refs: ["《代码大全》第11章"],
        },
        {
          id: "code-collection",
          title: "7. 集合类型命名（数组/Map/Set）",
          principle:
            "集合命名表达内容而非容器类型；数组用复数名词，Map 用 keyToValue 模式，Set 用复数名词。",
          why:
            "《编写可读代码的艺术》第 2 章指出：在名字里塞入冗余的类型信息（如 list / array 后缀）没有价值，因为类型系统已经知道它是数组。更有用的是表达「里面装的是什么」——数组用复数名词（users），Map 用 keyToValue（userIdToOrder），这样读代码的人立刻知道如何取值。",
          tables: [
            {
              type: "three",
              columns: ["❌ 反例", "✅ 正例", "说明"],
              rows: [
                { bad: "userList", good: "users", note: "复数名词已表达集合，无需 List 后缀" },
                { bad: "map", good: "userIdToOrder", note: "Map 用 keyToValue 模式自解释" },
                { bad: "set", good: "activeUserIds", note: "Set 同样用复数名词表达内容" },
                { bad: "arr", good: "orderItems", note: "arr 完全不表达内容" },
                { bad: "listOfNames", good: "names", note: "of 冗余，复数即可" },
                { bad: "mapUser", good: "userById", note: "明确 key(ById) 与 value(user)" },
              ],
            },
          ],
          examples: [
            {
              lang: "typescript",
              caption: "用内容而非容器命名集合",
              code:
                "const userIds: string[] = ['u1', 'u2'];\n" +
                "const userById = new Map<string, User>();\n" +
                "\n" +
                "for (const id of userIds) {\n" +
                "  const user = userById.get(id);\n" +
                "  if (user) process(user);\n" +
                "}",
            },
          ],
          refs: ["《编写可读代码的艺术》第2章"],
        },
        {
          id: "code-abbreviation",
          title: "8. 缩写与单位命名",
          principle:
            "只在团队约定内使用通用缩写；变量名含数值时必须标注单位。",
          why:
            "《代码大全》第 11 章的结论是：缩写只在「广为人知」时才可接受（如 id、url、http），自创或局部缩写（usr、Nm、cnt）会强行提高阅读门槛。另一类是带数值的变量，若不标单位（price、timeout），读者永远要猜是「元还是分」「秒还是毫秒」——把单位写进名字能消灭一类隐蔽 bug。",
          tables: [
            {
              type: "three",
              columns: ["❌ 反例", "✅ 正例", "说明"],
              rows: [
                { bad: "usrNm", good: "userName", note: "非通用缩写增加成本" },
                { bad: "cnt", good: "count", note: "count 并不长，无需缩写" },
                { bad: "tmp", good: "tempFile / 避免临时变量", note: "tmp 仅在极短作用域可接受" },
                { bad: "amt", good: "amount", note: "保持完整单词" },
                { bad: "price（单位不明）", good: "priceCents", note: "金额务必显式标注单位" },
                { bad: "timeout", good: "requestTimeoutMs", note: "标注毫秒，消除歧义" },
                { bad: "len", good: "length", note: "除非极短作用域，用完整词" },
              ],
            },
          ],
          examples: [
            {
              lang: "typescript",
              caption: "把单位写进名字",
              code:
                "// 反例：3 是秒还是毫秒？\n" +
                "const timeout = 3;\n" +
                "\n" +
                "// 正例\n" +
                "const requestTimeoutMs = 3000;\n" +
                "const priceCents = 1999; // 壹拾玖元玖角玖分",
            },
          ],
          refs: ["《代码大全》第11章"],
        },
        {
          id: "code-scope",
          title: "9. 作用域与命名长度的关系",
          principle:
            "作用域越小，名字越可短；作用域越大（公共 API / 全局），名字越要完整自解释。",
          why:
            "《代码大全》第 11 章提出一个重要规律：变量名的长度应当和作用域大小成正比。循环里的 `i`、`for` 体内的 `tmp` 读者一眼就能看懂；但全局配置、模块级导出、公共函数参数离使用者很远，必须用完整名字（appConfig、sourceText、targetLocale），否则没人知道它从哪来、是什么。",
          tables: [
            {
              type: "three",
              columns: ["❌ 反例", "✅ 正例", "说明"],
              rows: [
                { bad: "const cfg（全局）", good: "const appConfig", note: "全局名必须自解释" },
                { bad: "for (i ...) 可读", good: "for (let i ...) 保留短名", note: "极短循环体短名是可接受的" },
                { bad: "function fn(a, b)", good: "function translate(text, locale)", note: "函数参数离调用方远，要完整" },
                { bad: "const err（模块级）", good: "const lastParseError", note: "模块级变量需说明含义" },
                { bad: "class 成员 u", good: "class 成员 currentUser", note: "成员会被多处访问，要清晰" },
                { bad: "闭包内 tmp 用几行", good: "闭包内 tmp 可接受", note: "作用域极小且寿命短时可短名" },
              ],
            },
          ],
          examples: [
            {
              lang: "typescript",
              caption: "作用域决定长度",
              code:
                "// 全局 / 公共：完整名\n" +
                "const appConfig = loadConfig();\n" +
                "function translate(text: string, locale: string): string { /* ... */ }\n" +
                "\n" +
                "// 局部短作用域：短名无妨\n" +
                "for (let i = 0; i < items.length; i++) {\n" +
                "  const item = items[i];\n" +
                "}",
            },
          ],
          refs: ["《代码大全》第11章"],
        },
        {
          id: "code-antipattern",
          title: "10. 常见反模式清单（Anti-pattern Checklist）",
          principle:
            "把高频命名反模式列成清单，Code Review 时逐条核查，比凭感觉更有效。",
          why:
            "把「不该出现」的命名集中成可勾选清单，能让 Review 从主观判断变成客观核对。《编写可读代码的艺术》整本书的基调就是「用具体、可执行的规则替代模糊的「写清楚」」。以下是代码侧最常踩的坑，建议作为 PR 模板的自查项。",
          tables: [
            {
              type: "three",
              columns: ["❌ 反例", "✅ 正例", "说明"],
              rows: [
                { bad: "user1, user2", good: "用集合(users)或语义名(firstUser, fallbackUser)", note: "数字后缀掩盖真实差异" },
                { bad: "yongHuMing", good: "userName", note: "拼音命名难以被非母语者/工具检索" },
                { bad: "dataHandle", good: "parseData", note: "动词名词顺序应是「动 + 名」" },
                { bad: "strName", good: "name", note: "匈牙利前缀在现代语言里冗余" },
                { bad: "id（遮蔽外层 id）", good: "orderId（避免遮蔽）", note: "变量遮蔽会引发隐蔽 bug" },
                { bad: "status（当布尔用）", good: "isActive", note: "名词不能当布尔读" },
                { bad: "usrCnt", good: "userCount", note: "缩写过度同样降低可读性" },
              ],
            },
          ],
          examples: [
            {
              lang: "typescript",
              caption: "Code Review 自查示例",
              code:
                "// 反模式：数字后缀 + 拼音 + 万能词\n" +
                "const yh1 = getData();\n" +
                "const yh2 = handle(yh1);\n" +
                "\n" +
                "// 正例\n" +
                "const primaryUser = fetchPrimaryUser();\n" +
                "const enrichedUser = enrichProfile(primaryUser);",
            },
          ],
          refs: ["《编写可读代码的艺术》全书基调", "《代码大全》第11章"],
        },
      ],
    },

    /* ---------------------- 二、API 设计命名规范 ---------------------- */
    {
      id: "api",
      title: "API 设计命名规范（REST）",
      icon: "🔗",
      summary: "URL 路径、HTTP 方法、Query、Body 字段、状态码、版本、动作端点与反模式。",
      sections: [
        {
          id: "api-url",
          title: "1. URL 路径设计",
          principle:
            "URL 使用名词复数表示资源集合，用层级表达从属关系，动词只出现在非 CRUD 的「控制器式」端点里。",
          why:
            "Google AIP-122 与 Microsoft REST API Guidelines 都强调：URL 应当标识「资源」而非「动作」，动作由 HTTP 方法承担。资源用复数名词（users）表达集合语义，从属资源用路径层级（/users/{id}/orders）表达，过滤条件放进 query 而非拼进路径。业界在「单/复数」上有分歧，但共识是：一旦选定就要全站统一。",
          tables: [
            {
              type: "three",
              columns: ["❌ 反例", "✅ 正例", "说明"],
              rows: [
                { bad: "/getUser?id=1", good: "GET /users/1", note: "动词不应出现在 URL 中，HTTP 方法已表达动作" },
                { bad: "/user", good: "/users", note: "资源集合统一使用复数，全站保持一致" },
                { bad: "/users/1/getOrders", good: "GET /users/1/orders", note: "从属资源用路径层级表达" },
                { bad: "/deleteUser/1", good: "DELETE /users/1", note: "避免动词 + ID 混合" },
                { bad: "/UserOrders", good: "/users/{userId}/orders", note: "避免大驼峰，路径统一小写中划线/斜杠" },
                { bad: "/users_list", good: "/users", note: "不需要 _list 后缀，复数已表达列表语义" },
                { bad: "/user-Info/1", good: "/users/1", note: "混合大小写与下划线不一致，统一 kebab-case" },
                { bad: "/api/v1/getAllActiveUsers", good: "GET /api/v1/users?status=active", note: "过滤条件应放入 query，而非编码进路径" },
              ],
            },
          ],
          examples: [
            {
              lang: "http",
              caption: "资源导向的 URL 设计",
              code:
                "GET    /api/v1/users\n" +
                "GET    /api/v1/users/42\n" +
                "GET    /api/v1/users/42/orders\n" +
                "POST   /api/v1/users/42/orders\n" +
                "DELETE /api/v1/users/42",
            },
          ],
          refs: ["Google AIP-122 Resource Names", "Microsoft REST API Guidelines"],
        },
        {
          id: "api-method",
          title: "2. HTTP 方法与语义映射",
          principle:
            "HTTP 方法表达动作语义，URL 只承载资源；同一资源的不同动作靠方法区分。",
          why:
            "REST 的核心契约是「方法语义」：GET 只读且安全、POST 建、PUT 整体替换、PATCH 局部更新、DELETE 删。把写操作伪装进 GET（如 /users/delete/1）既破坏缓存与预取，也违反浏览器/代理的安全假设。Microsoft REST API Guidelines 对方法与幂等性有系统约定，建议团队对齐。",
          tables: [
            {
              type: "three",
              columns: ["❌ 反例", "✅ 正例", "说明"],
              rows: [
                { bad: "POST /users/1（用于更新）", good: "PATCH /users/1", note: "更新要用 PATCH/PUT，而非 POST 复用" },
                { bad: "GET /users/1（却删数据）", good: "DELETE /users/1", note: "GET 必须是安全的，禁止做写" },
                { bad: "PUT /users（当批量创建）", good: "POST /users（批量）", note: "PUT 语义是整体替换单资源" },
                { bad: "DELETE /users?filter=...", good: "谨慎批量删，优先单资源 DELETE", note: "批量删破坏幂等，需显式确认" },
                { bad: "GET /users/delete/1", good: "DELETE /users/1", note: "禁止用 GET 做写操作" },
                { bad: "自定义 XHTTP 方法", good: "用标准方法或动作端点", note: "非标准方法破坏通用客户端" },
              ],
            },
          ],
          examples: [
            {
              lang: "http",
              caption: "方法语义对照",
              code:
                "POST   /users          # 创建\n" +
                "GET    /users/42       # 读取（安全、幂等）\n" +
                "PUT    /users/42       # 整体替换（幂等）\n" +
                "PATCH  /users/42       # 局部更新\n" +
                "DELETE /users/42       # 删除（幂等）",
            },
          ],
          refs: ["Microsoft REST API Guidelines", "Google AIP-122"],
        },
        {
          id: "api-query",
          title: "3. Query 参数命名",
          principle:
            "Query 参数用完整单词，分页/排序/过滤语义分离；数组参数风格全站统一。",
          why:
            "Query 参数是接口契约的一部分，缩写（p、s）会让调用方必须查文档；相反 page、pageSize、sortBy、order 自解释。排序的「字段」与「方向」应分离（sortBy=createdAt&order=desc），避免 magic number。关于「数组参数」业界有两派（?ids=1,2,3 逗号分隔 vs ?id=1&id=2 重复键），没有对错，关键是团队选定一种并写入规范、全站强制统一。",
          tables: [
            {
              type: "three",
              columns: ["❌ 反例", "✅ 正例", "说明"],
              rows: [
                { bad: "?p=2&s=20", good: "?page=2&pageSize=20", note: "缩写降低可读性，参数名需完整单词" },
                { bad: "?sort=1", good: "?sortBy=createdAt&order=desc", note: "排序字段与方向分离，避免 magic number" },
                { bad: "?filter=active", good: "?status=active", note: "明确过滤的字段名，而非笼统的 filter" },
                { bad: "?from=...&to=...", good: "?startDate=...&endDate=...", note: "语义更清晰，避免 from/to 跨接口含义不一致" },
                { bad: "?ids=1,2,3 与 ?id=1&id=2 混用", good: "团队二选一并写入规范", note: "数组参数风格需全站强制统一（两派均可）" },
                { bad: "?q=foo", good: "?keyword=foo（或团队约定 search）", note: "搜索参数命名也需统一" },
              ],
            },
          ],
          examples: [
            {
              lang: "http",
              caption: "分页 + 排序 + 过滤",
              code:
                "GET /api/v1/users?page=2&pageSize=20&sortBy=createdAt&order=desc&status=active\n" +
                "# 数组参数（以「逗号分隔」一派为例）：\n" +
                "GET /api/v1/users?ids=u1,u2,u3",
            },
          ],
          refs: ["JSON:API 规范（分页/排序）", "Microsoft REST API Guidelines"],
        },
        {
          id: "api-body",
          title: "4. 请求/响应 Body 字段命名",
          principle:
            "Body 字段大小写风格全站唯一；时间字段加 At 后缀；布尔用真实布尔类型。",
          why:
            "字段大小写没有绝对标准，但「混用」是绝对错误。JS 生态普遍 camelCase，Python/Ruby 生态普遍 snake_case——选一种写进规范首条并全程一致。时间字段统一加 At（createdAt）避免与布尔 created 混淆；布尔字段用真实 boolean 而非字符串 'true'；顶层建议用信封结构（data/meta）约定，避免裸 data 满天飞。",
          tables: [
            {
              type: "three",
              columns: ["❌ 反例", "✅ 正例", "说明"],
              rows: [
                { bad: "混用 user_name 与 userName", good: "统一 camelCase 或统一 snake_case", note: "大小写风格必须全局唯一，写入规范首条" },
                { bad: "data（顶层裸字段）", good: '{ "user": {...} } 或 { "data":..., "meta":... }', note: "顶层结构需要有约定的信封(envelope)规范" },
                { bad: "errmsg", good: "errorMessage", note: "避免不规范缩写" },
                { bad: 'is_deleted: "true"（字符串）', good: "isDeleted: true（布尔类型）", note: "类型与命名要匹配，不要用字符串表示布尔" },
                { bad: "created（歧义）", good: "createdAt（ISO8601 时间戳）", note: "时间字段统一加 At 后缀" },
                { bad: "user_type_id: 3 无文档", good: 'userType: "ADMIN" 或附枚举说明', note: "优先语义化枚举而非裸魔法数字" },
              ],
            },
          ],
          examples: [
            {
              lang: "json",
              caption: "统一的 Body 字段风格（camelCase 示例）",
              code:
                "{\n" +
                '  "id": "u42",\n' +
                '  "userName": "alice",\n' +
                '  "isActive": true,\n' +
                '  "createdAt": "2024-01-15T09:30:00Z",\n' +
                '  "userType": "ADMIN"\n' +
                "}",
            },
          ],
          refs: ["Google AIP-190 Naming Conventions", "JSON:API 规范"],
        },
        {
          id: "api-status",
          title: "5. 状态码与错误码命名规范",
          principle:
            "HTTP 状态码表达传输层结果，业务错误码用稳定字符串枚举并配文档。",
          why:
            "HTTP 状态码（200/404/500）只回答「传输层发生了什么」；业务语义（订单不存在、余额不足）必须靠独立的 errorCode 表达，且 errorCode 应是稳定、可读的字符串枚举（ORDER_NOT_FOUND），而不是随版本漂移的魔法数字。Microsoft 与 Google 的指南都建议错误体结构统一（code/message/详情），以便客户端程序化处理。",
          tables: [
            {
              type: "three",
              columns: ["❌ 反例", "✅ 正例", "说明"],
              rows: [
                { bad: "code: 0 表示成功", good: "HTTP 200 + 业务 errorCode", note: "别用业务码覆盖 HTTP 语义" },
                { bad: 'err: "出错啦"', good: 'errorCode: "ORDER_NOT_FOUND"', note: "错误码要稳定、可读、可程序化判断" },
                { bad: 'status: "ok"', good: "HTTP 状态码 + 结构化 error 对象", note: "状态与错误分离" },
                { bad: "数字错误码 5001 无文档", good: "errorCode 枚举 + 字典表/文档", note: "魔法数字无法被调用方理解" },
                { bad: "message 中英混写", good: "message 统一语言 + errorCode 定位", note: "message 给人看，errorCode 给程序看" },
                { bad: "把业务码塞进 HTTP 状态码", good: "HTTP 表传输，errorCode 表业务", note: "两者职责分离，互不替代" },
              ],
            },
          ],
          examples: [
            {
              lang: "json",
              caption: "结构化错误体",
              code:
                "{\n" +
                '  "error": {\n' +
                '    "code": "ORDER_NOT_FOUND",\n' +
                '    "message": "订单不存在或已删除",\n' +
                '    "details": { "orderId": "o999" }\n' +
                "  }\n" +
                "}",
            },
          ],
          refs: ["Microsoft REST API Guidelines（错误模型）", "Google AIP-190"],
        },
        {
          id: "api-version",
          title: "6. 版本控制命名",
          principle:
            "API 版本优先放在 URL 路径前缀或请求头，向后兼容地演进，禁止破坏式变更混入旧版本。",
          why:
            "版本解决「已上线的客户端不能突然坏掉」的问题。最主流的做法是把主版本放进路径前缀（/api/v1），直观且易调试；也有团队用请求头（X-API-Version）保持 URL 干净。无论哪种，都要避免「同一版本里做破坏性字段改名」。子版本（v1.2）通常没必要，细节演进用「弃用 + 新增字段」代替。两派都可行，团队选定一种全站统一。",
          tables: [
            {
              type: "three",
              columns: ["❌ 反例", "✅ 正例", "说明"],
              rows: [
                { bad: "/v1/users 与 /users 混用", good: "统一 /api/v1/...", note: "版本前缀要全局一致" },
                { bad: "?v=2（放 query）", good: "/api/v2（放路径）", note: "路径版本更直观、易缓存" },
                { bad: "/v1.2（子版本）", good: "/v1（细节用弃用注解）", note: "主版本即可，子版本增加复杂度" },
                { bad: "无版本直接改字段", good: "加版本避免破坏客户端", note: "破坏性变更必须走新版本" },
                { bad: "/20240101（日期版本）", good: "/v1（语义版本）", note: "语义版本更直观" },
                { bad: "路径版本与头版本并存", good: "选一种全站统一", note: "双轨会带来歧义" },
              ],
            },
          ],
          examples: [
            {
              lang: "http",
              caption: "路径版本示例",
              code:
                "GET /api/v1/users\n" +
                "GET /api/v2/users   # v2 引入 breaking change，v1 继续服务老客户端",
            },
          ],
          refs: ["Microsoft REST API Guidelines（版本）", "Google AIP（兼容性）"],
        },
        {
          id: "api-action",
          title: "7. 特殊动作接口命名（非 CRUD）",
          principle:
            "当操作无法映射为标准 CRUD 时，允许在资源后追加名词化的动作子资源，但要克制使用。",
          why:
            "并非所有业务都能优雅地塞进 CRUD（如「激活账号」「取消订单」「发送邮件」）。Google AIP 的建议是：优先用 query 参数表达（搜索用 ?name=），实在不行再在资源后追加一个「名词化的动作子资源」（/activation、/cancellation），避免裸动词（doActivate）。动词子路径（/activate）也可用，但必须全站统一风格。核心原则：动作端点越少越好。",
          tables: [
            {
              type: "three",
              columns: ["❌ 反例", "✅ 正例", "说明"],
              rows: [
                { bad: "POST /users/1/doActivate", good: "POST /users/1/activation", note: "用「名词化的动作资源」代替裸动词" },
                { bad: "POST /activateUser/1", good: "POST /users/1/activate", note: "若团队接受动词子路径，需全站统一放在资源之后" },
                { bad: "POST /orders/1/cancelOrder", good: "POST /orders/1/cancellation", note: "避免动词与资源名重复冗余" },
                { bad: "GET /searchUsersByName", good: "GET /users?name=xxx", note: "搜索优先用 query 参数而非专用路径" },
                { bad: "POST /sendResetPasswordEmail", good: "POST /password-resets", note: "把「发送重置邮件」建模为创建「重置请求」资源" },
              ],
            },
          ],
          examples: [
            {
              lang: "http",
              caption: "动作端点 vs 资源建模",
              code:
                "POST /users/42/activation        # 激活（名词化子资源）\n" +
                "POST /password-resets            # 创建重置请求（资源建模）\n" +
                "GET  /users?name=alice&status=active",
            },
          ],
          refs: ["Google AIP（自定义方法）", "Microsoft REST API Guidelines"],
        },
        {
          id: "api-antipattern",
          title: "8. 常见反模式清单",
          principle:
            "把高频 API 命名反模式列成清单，接口设计评审时逐条核查。",
          why:
            "API 是团队之间最持久的契约，命名错误会放大十倍。把常见坑固化成评审清单，能让「接口设计评审」可勾选、可复用，而不是每次靠资深工程师凭记忆挑刺。",
          tables: [
            {
              type: "three",
              columns: ["❌ 反例", "✅ 正例", "说明"],
              rows: [
                { bad: "/getUser", good: "GET /users/{id}", note: "动词不应入路径" },
                { bad: "/UserOrders", good: "/users/{id}/orders", note: "避免大驼峰，路径统一小写" },
                { bad: "userName 与 user_name 混用", good: "统一一种大小写", note: "Body 字段风格必须唯一" },
                { bad: "用 GET 做写", good: "改用 POST/PUT/DELETE", note: "GET 必须安全" },
                { bad: "数组参数不统一", good: "全站定一种风格", note: "团队约定优先" },
                { bad: "错误码用魔法数字", good: "稳定字符串枚举", note: "可程序化判断" },
                { bad: "/a/b/c/d/e 过度嵌套", good: "扁平化，必要时用 query", note: "过深层级难维护" },
              ],
            },
          ],
          examples: [
            {
              lang: "http",
              caption: "评审前后对照",
              code:
                "# 反模式\n" +
                "GET /api/getUserOrderList?uid=42\n" +
                "# 正例\n" +
                "GET /api/v1/users/42/orders",
            },
          ],
          refs: ["Google AIP-190", "Microsoft REST API Guidelines"],
        },
      ],
    },

    /* ---------------------- 三、数据库表/字段命名 ---------------------- */
    {
      id: "db",
      title: "数据库命名规范",
      icon: "🗄️",
      summary: "表名、字段名、索引/约束/视图、枚举值与状态字段、反模式清单。",
      sections: [
        {
          id: "db-table",
          title: "1. 表命名",
          principle:
            "表名使用小写 + 下划线（snake_case），统一单数或复数（业界两派均有，需团队选定并全站统一），避免类型前缀污染。",
          why:
            "SQL 世界普遍用 snake_case（小写 + 下划线），这与多数 SQL 关键字风格一致，也避免大小写在跨平台（MySQL 大小写敏感 vs PostgreSQL 不敏感）上的坑。最富争议的是「单/复数」：单数派（user）认为「一张表 = 一类实体」，复数派（users）认为「表 = 行的集合」。两派都合理，本站建议团队明确选定一种并全站执行，而不是混用。SQL Style Guide（Simon Holywell）与 Google/Airbnb 均倾向复数，但更重要的永远是「统一」。",
          tables: [
            {
              type: "three",
              columns: ["❌ 反例", "✅ 正例", "说明"],
              rows: [
                { bad: "Tbl_User", good: "users（或统一 user）", note: "不需要 Tbl_ 类前缀，且大小写统一小写" },
                { bad: "UserOrderRelation", good: "user_orders（中间表）", note: "多对多中间表建议 表A_表B 或体现业务含义" },
                { bad: "data1 / tmp_user", good: "明确业务含义的表名", note: "禁止临时表进入正式 schema" },
                { bad: "user_info_new", good: "users（通过迁移脚本替换旧表）", note: "禁止用 _new/_old/_bak 后缀长期存在" },
                { bad: "t_user_login_log", good: "user_login_logs", note: "避免无意义的类型编码前缀（匈牙利命名遗留）" },
              ],
            },
          ],
          examples: [
            {
              lang: "sql",
              caption: "表命名（以「复数派」为例）",
              code:
                "CREATE TABLE users (\n" +
                "  id            BIGINT PRIMARY KEY,\n" +
                "  user_name     VARCHAR(64) NOT NULL\n" +
                ");\n" +
                "\n" +
                "-- 多对多中间表：表A_表B\n" +
                "CREATE TABLE user_roles (\n" +
                "  user_id BIGINT NOT NULL,\n" +
                "  role_id BIGINT NOT NULL\n" +
                ");",
            },
          ],
          refs: ["SQL Style Guide（Simon Holywell）", "Google Cloud API Design Guide"],
        },
        {
          id: "db-column",
          title: "2. 字段命名",
          principle:
            "主键统一 id，外键为 关联表单数_id，时间加 _at，布尔 is_/has_ 前缀，金额标注单位。",
          why:
            "字段命名规则的目标是可预测：任何工程师看到 user_id 就知道它是 users 表的外键；看到 created_at 就知道是时间；看到 is_active 就知道是布尔。金额类字段最容易被坑——price 到底是元还是分？建议显式写成 price_cents 或搭配 currency 字段。主键统一叫 id（而非 uid/userId），外键才带表名单数前缀，能彻底消除「哪个是主键哪个是外键」的猜测。",
          tables: [
            {
              type: "four",
              columns: ["类别", "❌ 反例", "✅ 正例", "说明"],
              rows: [
                { group: "主键", bad: "uid / userId（不统一）", good: "全站统一 id", note: "主键统一叫 id，外键才带前缀" },
                { group: "外键", bad: "uid", good: "user_id", note: "外键 = 引用表单数名 + _id" },
                { group: "时间", bad: "time / date", good: "created_at / updated_at / deleted_at", note: "统一后缀 _at，软删除统一 deleted_at" },
                { group: "布尔", bad: "active（int 0/1 无提示）", good: "is_active（boolean）", note: "与代码层布尔命名呼应" },
                { group: "金额", bad: "price（不清楚单位）", good: "price_cents + currency 字段", note: "涉及金额务必显式标注单位/精度" },
                { group: "状态枚举", bad: "status（数字 1/2/3 无注释）", good: "status + 应用层枚举映射/字典表", note: "字段名一致但需配合注释或字典" },
                { group: "计数", bad: "num / cnt", good: "retry_count / login_count", note: "完整单词，_count 后缀统一" },
              ],
            },
          ],
          examples: [
            {
              lang: "sql",
              caption: "字段命名示例",
              code:
                "CREATE TABLE orders (\n" +
                "  id            BIGINT PRIMARY KEY,\n" +
                "  user_id       BIGINT NOT NULL,        -- 外键 -> users.id\n" +
                "  is_paid       BOOLEAN DEFAULT FALSE,  -- 布尔 is_ 前缀\n" +
                "  price_cents   INTEGER NOT NULL,       -- 金额带单位\n" +
                "  currency      CHAR(3) DEFAULT 'CNY',\n" +
                "  created_at    TIMESTAMP NOT NULL DEFAULT NOW(),\n" +
                "  updated_at    TIMESTAMP NOT NULL DEFAULT NOW()\n" +
                ");",
            },
          ],
          refs: ["SQL Style Guide（Simon Holywell）", "《代码大全》第11章（单位命名）"],
        },
        {
          id: "db-index",
          title: "3. 索引/约束/视图命名",
          principle:
            "索引/约束命名带类型前缀可追溯：idx_ 普通索引、uk_ 唯一索引、fk_ 外键、ck_ 检查、v_ 视图。",
          why:
            "当慢查询来了，DBA 第一件事就是 EXPLAIN 看命中了哪个索引。如果索引叫 index1，根本无从判断它建在哪些字段上。用 `idx_表名_字段名` 的命名，能让索引/约束「自描述」：看到 uk_users_email 就知道是唯一约束、作用在 users.email。视图用 v_ 前缀与基表区分，序列用 seq_ 前缀，都让 schema 更易读、更易维护。",
          tables: [
            {
              type: "three",
              columns: ["❌ 反例", "✅ 正例", "说明"],
              rows: [
                { bad: "index1", good: "idx_users_email", note: "idx_表名_字段名 格式，可追溯" },
                { bad: "uk1", good: "uk_users_email（唯一约束）", note: "前缀区分索引类型" },
                { bad: "fk_1", good: "fk_orders_user_id", note: "外键命名体现「从哪个表的哪个字段来」" },
                { bad: "ck1", good: "ck_orders_amount_positive", note: "检查约束用 ck_ 前缀" },
                { bad: "view1", good: "v_active_orders（视图）", note: "视图用 v_ 前缀与基表区分" },
                { bad: "seq1", good: "seq_order_id（序列）", note: "序列用 seq_ 前缀" },
                { bad: "pk_users（冗余）", good: "主键默认命名即可，或 pk_users", note: "主键通常无需显式命名，要命名则用 pk_ 前缀" },
              ],
            },
          ],
          examples: [
            {
              lang: "sql",
              caption: "可追溯的索引与约束命名",
              code:
                "CREATE UNIQUE INDEX uk_users_email ON users (email);\n" +
                "CREATE INDEX idx_orders_user_id ON orders (user_id);\n" +
                "ALTER TABLE orders\n" +
                "  ADD CONSTRAINT fk_orders_user_id\n" +
                "  FOREIGN KEY (user_id) REFERENCES users (id);\n" +
                "CREATE VIEW v_active_orders AS\n" +
                "  SELECT * FROM orders WHERE is_paid = TRUE;",
            },
          ],
          refs: ["SQL Style Guide（Simon Holywell）"],
        },
        {
          id: "db-enum",
          title: "4. 枚举值与状态字段设计",
          principle:
            "状态字段用有文档的枚举（应用层或 CHECK），禁止裸数字；命名表达业务语义。",
          why:
            "数据库里的 `status` 存 1/2/3 是最经典的「当时省事、日后还债」反模式——没人记得 2 是「已支付」还是「已发货」。正确做法是用有文档的枚举：要么应用层维护映射表、要么数据库用 ENUM/CHECK 约束限制取值、要么用外键指向字典表。字段名本身要表达业务（order_state 而非 state），让读 schema 的人立刻知道这是什么状态。",
          tables: [
            {
              type: "three",
              columns: ["❌ 反例", "✅ 正例", "说明"],
              rows: [
                { bad: "status INT 1/2/3 无注释", good: "status + 枚举映射表 / CHECK", note: "裸数字状态无法被理解" },
                { bad: "type TINYINT 无注释", good: "user_type + 字典表", note: "类型也要有文档" },
                { bad: "flag INT", good: "is_deleted BOOLEAN", note: "布尔语义用布尔类型" },
                { bad: "state VARCHAR 任意字符串", good: "order_state 受约束枚举", note: "状态取值应被约束" },
                { bad: "level 0/1/2", good: "priority ENUM('LOW','MED','HIGH')", note: "优先级用枚举" },
                { bad: "gender 0/1", good: "gender 枚举 / NULL", note: "语义化而非魔法数字" },
              ],
            },
          ],
          examples: [
            {
              lang: "sql",
              caption: "受约束的状态字段",
              code:
                "CREATE TYPE order_status AS ENUM ('PENDING', 'PAID', 'SHIPPED', 'DONE');\n" +
                "\n" +
                "CREATE TABLE orders (\n" +
                "  id      BIGINT PRIMARY KEY,\n" +
                "  status  order_status NOT NULL DEFAULT 'PENDING'\n" +
                ");\n" +
                "\n" +
                "-- 或用 CHECK 约束（兼容更多数据库）\n" +
                "ALTER TABLE orders\n" +
                "  ADD CONSTRAINT ck_orders_status\n" +
                "  CHECK (status IN ('PENDING','PAID','SHIPPED','DONE'));",
            },
          ],
          refs: ["SQL Style Guide（Simon Holywell）", "《代码大全》第11章"],
        },
        {
          id: "db-antipattern",
          title: "5. 常见反模式清单",
          principle:
            "把高频数据库命名反模式列成清单，建表/改表评审时逐条核查。",
          why:
            "数据库的命名错误成本最高——它牵动 ORM 映射、查询、报表，且改起来要迁移数据。把常见坑固化成评审清单，配合迁移脚本审查，能在「建表 PR」阶段就拦住大部分问题。",
          tables: [
            {
              type: "three",
              columns: ["❌ 反例", "✅ 正例", "说明"],
              rows: [
                { bad: "Tbl_User", good: "users", note: "去掉类型前缀，统一小写" },
                { bad: "uid 作主键", good: "id", note: "主键统一叫 id" },
                { bad: "time 时间字段", good: "created_at", note: "时间统一 _at 后缀" },
                { bad: "t_user_login_log", good: "user_login_logs", note: "去掉无意义编码前缀" },
                { bad: "user_info_new", good: "迁移替换，不用 _new 长期存在", note: "_new/_old 不能留在生产 schema" },
                { bad: "data1 临时表进生产", good: "独立命名空间/tmp_ 并清理", note: "临时表需隔离与清理机制" },
                { bad: "status 数字无注释", good: "配枚举文档", note: "状态字段必须有字典" },
              ],
            },
          ],
          examples: [
            {
              lang: "sql",
              caption: "建表评审前后",
              code:
                "-- 反模式\n" +
                "CREATE TABLE Tbl_User (uid INT, time DATETIME);\n" +
                "-- 正例\n" +
                "CREATE TABLE users (\n" +
                "  id         BIGINT PRIMARY KEY,\n" +
                "  created_at TIMESTAMP NOT NULL DEFAULT NOW()\n" +
                ");",
            },
          ],
          refs: ["SQL Style Guide（Simon Holywell）"],
        },
      ],
    },
  ],

  /* =======================================================================
   * 四、速查表（Cheat Sheet）—— 打印/另存 PDF 用
   * ===================================================================== */
  cheatSheet: [
    {
      group: "通用原则",
      icon: "⚡",
      items: [
        "好名字暴露意图，读起来像散文；坏名字逼人读上下文。",
        "同一概念全代码库只用同一个词（user 不要又叫 client/customer）。",
        "禁止万能词：data / info / temp / flag / handle / manager / obj / tmp。",
        "作用域越大，名字越要完整；极短循环体短名可接受。",
        "缩写只在「广为人知」时可用（id / url / http），自创缩写要杜绝。",
      ],
    },
    {
      group: "代码命名速记",
      icon: "💻",
      items: [
        "变量：意图 + 单位（priceCents, requestTimeoutMs），数字后缀是坏味道。",
        "函数：动词 + 名词，且名副其实（getX 不能偷偷写库）。",
        "布尔：is / has / can / should 前缀，能直接读进 if 语句。",
        "常量：全大写下划线（MAX_LOGIN_ATTEMPTS），禁止魔法数字。",
        "集合：数组用复数（users），Map 用 keyToValue（userIdToOrder）。",
        "类：名词短语表职责，拒绝 Manager / Helper / Util 垃圾桶类。",
      ],
    },
    {
      group: "REST API 速记",
      icon: "🔗",
      items: [
        "URL 用名词复数表资源，动词交给 HTTP 方法。",
        "从属资源用层级：/users/{id}/orders；过滤放 query。",
        "Body 字段大小写全站唯一（camelCase 或 snake_case，二选一）。",
        "时间字段加 At（createdAt），布尔用真实 boolean。",
        "Query 用完整词：page / pageSize / sortBy / order / status。",
        "错误用稳定字符串 errorCode（ORDER_NOT_FOUND），别用魔法数字。",
        "版本放路径前缀 /api/v1；非 CRUD 动作克制使用名词化子资源。",
      ],
    },
    {
      group: "数据库命名速记",
      icon: "🗄️",
      items: [
        "表名 snake_case，单/复数团队选定一种全站统一。",
        "主键统一 id；外键 = 关联表单数_id（user_id）。",
        "时间字段 _at（created_at / updated_at / deleted_at）。",
        "布尔 is_ / has_ 前缀（is_active）；金额带单位（price_cents）。",
        "索引 idx_表名_字段名；唯一 uk_；外键 fk_；检查 ck_；视图 v_。",
        "状态字段禁止裸数字，用枚举 / CHECK / 字典表并配文档。",
      ],
    },
  ],

  /* =======================================================================
   * 五、参考资料（业界规范外链，见计划第十二章，已校验）
   * ===================================================================== */
  references: [
    {
      group: "代码命名 / 通用编码风格",
      items: [
        {
          name: "Google Style Guides（多语言总入口）",
          desc: "Google 官方各语言编码规范总目录，含命名章节。",
          url: "https://google.github.io/styleguide/",
          scene: "需要「权威、跨语言统一」的命名基线时，作为团队规范起点。",
        },
        {
          name: "Airbnb JavaScript Style Guide",
          desc: "业界最流行的 JS/React 风格指南之一，命名规则详尽。",
          url: "https://github.com/airbnb/javascript",
          scene: "前端/Node 团队定 JS/TS 命名与代码风格时首选参考。",
        },
        {
          name: "《代码大全》作者 Steve McConnell 官网",
          desc: "可查书籍章节目录与勘误。",
          url: "https://stevemcconnell.com/",
          scene: "想追溯「变量名的力量」等观点的原始出处与章节时。",
        },
      ],
    },
    {
      group: "REST API 设计命名",
      items: [
        {
          name: "Google Cloud API Design Guide（AIP）",
          desc: "Google 内部长期使用的 API 设计规范，命名章节系统。",
          url: "https://docs.cloud.google.com/apis/design",
          scene: "资源导向、gRPC/REST 双栈团队设计 API 时的系统参考。",
        },
        {
          name: "AIP-190 Naming Conventions",
          desc: "Google AIP 体系中专门讲命名的一篇。",
          url: "https://google.aip.dev/190",
          scene: "确定字段命名、缩写、枚举值风格时直接对照。",
        },
        {
          name: "AIP-122 Resource Names",
          desc: "专讲资源命名（URL 路径设计）。",
          url: "https://google.aip.dev/122",
          scene: "设计 /users/{id}/orders 这类资源路径时对照。",
        },
        {
          name: "Microsoft REST API Guidelines",
          desc: "微软跨团队 REST API 设计规范，HTTP 方法与字段命名细。",
          url: "https://github.com/microsoft/api-guidelines",
          scene: "企业级 / Azure 风格 API、错误模型与方法语义参考。",
        },
        {
          name: "JSON:API 规范",
          desc: "响应体结构、字段命名、分页参数命名的社区标准。",
          url: "https://jsonapi.org/",
          scene: "需要「标准化响应信封 + 分页/排序参数」时采用。",
        },
      ],
    },
    {
      group: "数据库命名",
      items: [
        {
          name: "SQL Style Guide（Simon Holywell）",
          desc: "广泛引用的 SQL/数据库对象命名风格指南，含表名/字段名/索引前缀约定。",
          url: "https://www.sqlstyle.guide/",
          scene: "定 snake_case 表/字段、idx_/uk_/fk_ 索引前缀时的权威参考。",
        },
      ],
    },
  ],

  /* =======================================================================
   * 五点五、书籍推荐与章节映射（计划 IA 六）
   * ===================================================================== */
  books: [
    {
      title: "《代码大全》(Code Complete) · Steve McConnell",
      chapters: [
        "第 11 章「变量名的力量」：讨论变量名长度与作用域的反比关系、常见命名误区（含糊词、不同位置不同缩写），强调「名字是代码自注释的第一手段」。",
        "第 10 章「使用变量的一般事项」对变量初始化、作用域最小化与命名一致性亦有支撑性论述。",
      ],
    },
    {
      title: "《编写可读代码的艺术》(The Art of Readable Code) · Dustin Boswell & Trevor Foucher",
      chapters: [
        "第 1 章「代码应当易于理解」：提出「把信息装进名字里」——能用名字讲清的就不要靠注释。",
        "第 2 章「名字应当有更多信息」：用具体词替代模糊词（如用 detect 替代 check），避免名不副实。",
        "第 3 章「审美」中对对齐与一致性的讨论，与「全站命名风格统一」一脉相承。",
      ],
    },
  ],

  /* =======================================================================
   * 六、AI 提示词工具w箱（计划第十三章）
   * 占位符用 [xxx] 表示，页面上可输入/下拉替换生成「团队专属版」。
   * fields: 占位符 -> { type: 'text'|'select', options: [], label }
   * ===================================================================== */
  prompts: {
    naming: [
      {
        id: "prompt-a",
        title: "模板 A：变量 / 函数 / 类命名",
        meta: "用于让对话式 AI（Claude / ChatGPT）帮你起名或挑名字问题。",
        template:
          "我在写 [语言] 代码，需要给下面这个 [变量/函数/类] 起一个好名字。\n" +
          "它的作用是：[一句话描述业务含义/职责]。\n" +
          "所在上下文/作用域是：[函数内部局部变量 / 类的成员 / 模块级公共 API]。\n" +
          "请给出 3~5 个候选名字，并按「清晰度、简洁度、与团队现有命名风格的一致性」打分排序，\n" +
          "说明每个候选名字的优缺点，最后给出你最推荐的一个。\n" +
          "如果我提供的候选名字有歧义（比如万能词 data/info/temp/flag/handle/manager），\n" +
          "请直接指出问题并给出替代方案。",
        fields: {
          "[语言]": { type: "text", label: "语言" },
          "[变量/函数/类]": { type: "text", label: "命名对象" },
          "[一句话描述业务含义/职责]": { type: "text", label: "业务含义/职责" },
          "[函数内部局部变量 / 类的成员 / 模块级公共 API]": { type: "text", label: "作用域" },
        },
      },
      {
        id: "prompt-b",
        title: "模板 B：REST API 字段 / 路径命名",
        meta: "用于让 AI 帮你定 URL 路径与 Body 字段命名。",
        template:
          "我在设计一个 REST API，资源是 [资源名称]，字段/路径片段的业务含义是：[描述]。\n" +
          "请帮我确定命名，要求：\n" +
          "1. 路径使用小写 + 连字符风格，资源用复数名词；\n" +
          "2. Body 字段使用 [camelCase 或 snake_case]（团队现有约定，需与全站保持一致）；\n" +
          "3. 避免把动词写进 URL（除非是非 CRUD 的动作型端点）；\n" +
          "4. 对照 Google AIP 和 Microsoft REST API Guidelines 的常见做法给出参考。\n" +
          "请给出最终建议的完整路径/字段示例，并说明理由。",
        fields: {
          "[资源名称]": { type: "text", label: "资源名称" },
          "[描述]": { type: "text", label: "业务含义" },
          "[camelCase 或 snake_case]": {
            type: "select",
            label: "字段大小写",
            options: ["camelCase", "snake_case"],
          },
        },
      },
      {
        id: "prompt-c",
        title: "模板 C：数据库表 / 字段命名",
        meta: "用于让 AI 帮你设计表名、主键、外键、索引命名。",
        template:
          "我要设计一张数据库表，用途是：[用途是：]。\n" +
          "请按照以下约定给出表名、主键、外键、时间字段、状态字段、索引名的命名建议：\n" +
          "- 表名：小写 + 下划线，[单数或复数，团队约定]；\n" +
          "- 主键统一为 id；外键为 关联表单数_id；\n" +
          "- 时间字段统一 _at 后缀（created_at/updated_at/deleted_at）；\n" +
          "- 布尔字段统一 is_/has_ 前缀；\n" +
          "- 索引命名 idx_表名_字段名，唯一索引 uk_表名_字段名。\n" +
          "请输出一份 CREATE TABLE 的字段清单草案，并标注每个命名的依据。",
        fields: {
          "[用途是：]": { type: "text", label: "表用途" },
          "[单数或复数，团队约定]": {
            type: "select",
            label: "表名单/复数",
            options: ["单数", "复数"],
          },
        },
      },
    ],
    ruleFiles: [
      {
        id: "agents-md",
        title: "AGENTS.md 命名规范片段",
        meta: "放到仓库根目录，Codex / Cursor / Copilot / Gemini CLI 等可原生读取。",
        template:
          "## 命名规范（Naming Conventions）\n" +
          "\n" +
          "在生成或修改代码时，必须遵守以下命名规则，发现已有代码违反时应在 PR 中主动指出：\n" +
          "\n" +
          "### 代码命名\n" +
          "- 禁止使用无意义的万能词作为变量/函数名：data, info, temp, flag, handle, manager, obj, foo, tmp。\n" +
          "- 布尔变量/函数必须使用 is/has/can/should 前缀，且能直接放进 if 语句读成一句话。\n" +
          "- 函数名必须是「动词+名词」，且名字要与函数的真实副作用一致（只读函数不能叫 getX 却做写操作）。\n" +
          "- 禁止用数字后缀区分同类变量/函数（如 user1, user2, getUserInfo2）。\n" +
          "\n" +
          "### REST API 命名\n" +
          "- URL 路径只用名词复数表示资源集合，禁止在路径中出现动词（非 CRUD 动作端点除外，需用名词化的子资源表达）。\n" +
          "- Query 参数使用完整单词，禁止不常见缩写（如 p, s 代替 page, size）。\n" +
          "- Body 字段大小写风格全项目统一为 [camelCase]，禁止混用 snake_case。\n" +
          "- 时间字段统一使用 [xxxAt] 后缀并使用 ISO 8601 格式。\n" +
          "\n" +
          "### 数据库命名\n" +
          "- 表名统一使用小写 + 下划线（snake_case），[单数或复数，按团队约定二选一]。\n" +
          "- 主键统一叫 id；外键统一为 关联表单数_id。\n" +
          "- 布尔字段必须有 is_/has_ 前缀，禁止用 0/1 语义不明的字段名。\n" +
          "- 索引命名遵循 idx_表名_字段名，唯一索引 uk_表名_字段名。\n" +
          "\n" +
          "请在 Code Review 时，凡发现违反以上任意一条的命名，直接在对应代码行给出修改建议，并注明违反的具体规则。",
        fields: {
          "[camelCase]": {
            type: "select",
            label: "Body 字段大小写",
            options: ["camelCase", "snake_case"],
          },
          "[单数或复数，按团队约定二选一]": {
            type: "select",
            label: "表名单/复数",
            options: ["单数", "复数"],
          },
        },
      },
      {
        id: "cursor-mdc",
        title: ".cursor/rules/naming-conventions.mdc",
        meta: "Cursor 专用、按路径生效的规则文件（与 AGENTS.md 保持一致，建议脚本同步）。",
        template:
          "---\n" +
          "description: 命名规范检查规则，适用于所有代码与 API/DB 相关文件\n" +
          "alwaysApply: true\n" +
          "---\n" +
          "\n" +
          "# 命名规范强制规则\n" +
          "\n" +
          "（本文件内容与 AGENTS.md 中的「命名规范」部分保持一致，\n" +
          " 建议两个文件通过脚本自动同步，避免规则漂移。）\n" +
          "\n" +
          "当你生成新代码或编辑已有代码时：\n" +
          "1. 若发现变量/函数命名违反规则，在生成代码前先自我检查一遍并修正，无需等待用户指出。\n" +
          "2. 若在阅读到既有代码时发现命名问题，在你的回复末尾单独列出「发现的命名问题」清单，\n" +
          "   格式：`文件:行号 | 现有名字 | 问题 | 建议名字`。\n" +
          "3. 字段/资源命名风格全项目统一为 [camelCase]，表名风格按团队约定 [单数或复数，按团队约定二选一]。",
        fields: {
          "[camelCase]": {
            type: "select",
            label: "字段大小写",
            options: ["camelCase", "snake_case"],
          },
          "[单数或复数，按团队约定二选一]": {
            type: "select",
            label: "表名单/复数",
            options: ["单数", "复数"],
          },
        },
      },
    ],
    review: [
      {
        id: "review-once",
        title: "一次性 Code Review 提示词（粘贴即用）",
        meta: "临时对某个文件或某次 PR 做命名专项审查，不改动仓库配置。",
        template:
          "请只针对「命名质量」对本次改动/本文件做一轮专项 Code Review，不用管其他方面（性能、测试覆盖率等）。\n" +
          "\n" +
          "审查标准：\n" +
          "1. 变量/函数名是否暴露了真实意图，是否存在 data/info/temp/flag/manager 这类万能词；\n" +
          "2. 布尔量命名是否使用 is/has/can/should 前缀，能否直接读成一句通顺的 if 语句；\n" +
          "3. 函数名是否「名副其实」，是否存在名字承诺是只读但实际有副作用的情况；\n" +
          "4. 如果涉及 REST API：路径是否使用名词复数、是否有动词混入路径、字段大小写风格是否与项目现有风格一致；\n" +
          "5. 如果涉及数据库变更：表名/字段名/索引名是否符合 [团队规范链接或摘要]。\n" +
          "\n" +
          "请输出一张表格，包含以下列：文件:行号 | 现有命名 | 问题类型 | 建议命名 | 严重程度(高/中/低)。\n" +
          "表格之后，用一句话总结本次改动的整体命名质量。",
        fields: {
          "[团队规范链接或摘要]": { type: "text", label: "团队规范链接/摘要" },
        },
      },
    ],
  },

  /* =======================================================================
   * 七、新人培训路径（计划第十一章）
   * steps: 6 步；quiz: 自测题（反例 -> 让学员写正例）
   * ===================================================================== */
  onboarding: {
    steps: [
      { n: 1, title: "命名三大原则导读", form: "图文", time: "10 分钟", content: "读「代码命名规范 › 1. 命名基本原则」：意图暴露、一致性、作用域匹配长度。记住一句话：好名字让代码读起来像散文。" },
      { n: 2, title: "代码命名核心 8 条 + 对比表格通读", form: "交互式表格", time: "15 分钟", content: "依次浏览 code-variable / code-function / code-class / code-boolean / code-constant / code-collection / code-abbreviation / code-scope 的 ❌/✅ 表格。" },
      { n: 3, title: "REST API 命名核心 6 条 + 对比表格通读", form: "交互式表格", time: "15 分钟", content: "浏览 api-url / api-method / api-query / api-body / api-status / api-version 的对比表格，重点看 URL 与 Body 字段风格。" },
      { n: 4, title: "数据库命名核心 5 条 + 对比表格通读", form: "交互式表格", time: "10 分钟", content: "浏览 db-table / db-column / db-index / db-enum / db-antipattern，重点记 id / _id / _at / idx_ 等约定。" },
      { n: 5, title: "自测：给出反例，写出正例并说明理由", form: "互动题 quiz", time: "10 分钟", content: "下方 10 道自测题，每题给出反例代码片段，请在文本框写出你的正例；提交后查看参考答案与依据章节。" },
      { n: 6, title: "把速查表加入书签 / 团队 Wiki 置顶", form: "引导提示", time: "1 分钟", content: "打开「速查表」页，点「打印 / 另存 PDF」，把一页纸规范贴到浏览器书签或团队 Wiki 顶部。" },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "const d = order.created - order.started;",
        question: "变量 d 没暴露意图，且看不出单位。请给出更好的命名（说明它代表什么、单位是什么）。",
        answer: "应命名为 elapsedMs 或 durationSeconds 之类，暴露「时间差」并标注单位，例如：const elapsedMs = order.createdAt - order.startedAt;",
        basis: "代码命名 › 8. 缩写与单位命名（数值变量必须标注单位）",
      },
      {
        id: "q2",
        prompt: "function getUser(id) { /* 内部 INSERT 一条记录 */ }",
        question: "函数名承诺只读，实际有写库副作用。请给出名副其实的名字。",
        answer: "createOrGetUser(id) 或 fetchAndPersistUser(id)，让名字如实反映副作用。",
        basis: "代码命名 › 3. 函数/方法命名（名副其实，避免欺骗性命名）",
      },
      {
        id: "q3",
        prompt: "if (user.status) { ... }",
        question: "status 是名词，无法读成布尔判断。请改成能直接读进 if 的布尔命名。",
        answer: "if (user.isActive) { ... }，使用 is/has/can/should 前缀。",
        basis: "代码命名 › 5. 布尔量命名（is 前缀，能读成 if 断言）",
      },
      {
        id: "q4",
        prompt: "const userList = fetchUsers();",
        question: "userList 的 List 后缀冗余且未表达内容。请给出更好的名字。",
        answer: "const users = fetchUsers(); 复数名词已表达集合，无需 List 后缀。",
        basis: "代码命名 › 7. 集合类型命名（数组用复数名词）",
      },
      {
        id: "q5",
        prompt: "GET /getUser?id=1",
        question: "URL 里出现了动词 getUser。请改成资源导向的 REST 写法。",
        answer: "GET /users/1，动词交给 HTTP 方法（GET），资源用复数名词。",
        basis: "API 命名 › 1. URL 路径设计（名词复数 + 层级，动词交给方法）",
      },
      {
        id: "q6",
        prompt: "POST /users/1/doActivate",
        question: "路径里用了裸动词 doActivate。请给出名词化的动作端点写法。",
        answer: "POST /users/1/activation，用名词化的动作子资源代替裸动词。",
        basis: "API 命名 › 7. 特殊动作接口命名（名词化子资源，克制使用）",
      },
      {
        id: "q7",
        prompt: "响应体：{ \"user_name\": \"alice\", \"is_active\": true } 与另一接口 { \"userName\": \"bob\" } 混用。",
        question: "同一项目 Body 字段大小写风格不一致。请说明正确做法。",
        answer: "全项目统一一种风格（如统一 camelCase 或统一 snake_case），禁止混用。",
        basis: "API 命名 › 4. 请求/响应 Body 字段命名（大小写风格全站唯一）",
      },
      {
        id: "q8",
        prompt: "CREATE TABLE Tbl_User (uid INT, time DATETIME);",
        question: "表名带 Tbl_ 前缀、主键叫 uid、时间叫 time。请给出规范写法。",
        answer: "CREATE TABLE users (id BIGINT PRIMARY KEY, created_at TIMESTAMP); 主键统一 id，时间统一 _at 后缀，去掉类型前缀。",
        basis: "数据库命名 › 1. 表命名 / 2. 字段命名（id / created_at / 去前缀）",
      },
      {
        id: "q9",
        prompt: "ALTER TABLE orders ADD COLUMN status INT; -- 存 1/2/3 表示状态",
        question: "用裸数字表示状态，无人记得含义。请给出规范做法。",
        answer: "使用枚举 / CHECK 约束 / 字典表，例如 status order_status 或 CHECK (status IN ('PENDING','PAID','SHIPPED'))，并配文档。",
        basis: "数据库命名 › 4. 枚举值与状态字段设计（禁止裸数字状态）",
      },
      {
        id: "q10",
        prompt: "CREATE INDEX index1 ON users (email);",
        question: "索引叫 index1 无法追溯。请给出自描述的索引命名。",
        answer: "CREATE UNIQUE INDEX uk_users_email ON users (email); 唯一索引用 uk_表名_字段名。",
        basis: "数据库命名 › 3. 索引/约束/视图命名（uk_/idx_/fk_ 前缀可追溯）",
      },
    ],
  },

  /* =======================================================================
   * 多语言分层服务命名范例（第十四章）
   * 同一业务场景：创建用户(POST /users) + 查询用户(GET /users/{id})，
   * 创建时调用积分服务发放注册积分。Java / Scala / Python 三种社区风格对照。
   * 注意：字段大小写、异常后缀等差异是语言社区惯例，不是错误。
   * ===================================================================== */
  multiLang: {
    intro:
      "只讲抽象原则容易「知道但不会用」。本章用同一个业务场景——创建用户（POST /users）并查询用户（GET /users/{id}），创建时调用积分服务发放注册积分——分别在 Java (Spring Boot)、Scala (Akka HTTP)、Python (FastAPI) 三种技术栈中落地，展示「同一套命名原则，不同语言社区各自的表达方式」。请特别注意：字段大小写（camelCase vs snake_case）、异常后缀（Exception vs Error）等差异是语言社区惯例，而非错误。",
    layersTable: {
      columns: ["分层", "职责", "通用后缀/前缀惯例"],
      rows: [
        ["Endpoint / API 层", "接收 HTTP 请求、参数校验、调用 Service、组装响应", "xxxController / xxxRoutes / xxx_router"],
        ["Service 层", "业务逻辑编排，事务边界", "xxxService（接口）+ xxxServiceImpl（实现，或语言习惯的默认实现名）"],
        ["Storage / Repository 层", "数据库读写，屏蔽 SQL/ORM 细节", "xxxRepository / xxxDao"],
        ["RPC / Client 层", "调用其他微服务（HTTP/gRPC/Thrift）", "xxxClient"],
        ["DTO / Schema 层", "请求体、响应体、内部数据传输对象", "XxxRequest / XxxResponse / XxxDTO"],
        ["Test 层", "单元测试", "xxxTest / xxxSpec / test_xxx"],
      ],
    },
    languages: [
      {
        key: "java",
        label: "Java (Spring Boot)",
        heading: "14.2 Java 范例（Spring Boot 社区惯例）",
        structure:
          "com.example.userservice\n ├─ controller/UserController.java\n ├─ service/UserService.java\n ├─ service/impl/UserServiceImpl.java\n ├─ repository/UserRepository.java\n ├─ dto/CreateUserRequest.java\n ├─ dto/UserResponse.java\n ├─ client/PointsServiceClient.java   // RPC，调用积分服务\n └─ exception/EmailAlreadyExistsException.java",
        table: {
          columns: ["分层", "类名规范", "方法名规范", "参数名规范", "字段名规范", "依据"],
          rows: [
            ["Controller", "UserController（大驼峰 + Controller 后缀）", "createUser、getUserById（小驼峰，动词开头）", "@RequestBody CreateUserRequest request、@PathVariable Long userId", "—", "Spring 官方文档命名惯例；Google Java Style Guide"],
            ["Service", "接口 UserService，实现类 UserServiceImpl", "与接口方法名一致：createUser(CreateUserRequest request)、findUserById(Long userId)", "入参用完整业务名词，避免 req/param 这类缩写", "—", "同上"],
            ["Repository", "UserRepository extends JpaRepository<UserEntity, Long>", "Spring Data 派生查询：findByEmail、existsByEmail", "String email、Long userId", "—", "Spring Data JPA 命名规则（方法名即查询语义）"],
            ["Entity", "UserEntity（避免直接叫 User，与 DTO 区分开）", "getter/setter 或 Lombok 自动生成", "—", "id、email、createdAt、updatedAt（小驼峰，时间字段 At 结尾）", "Google Java Style Guide + 团队 DB 命名映射"],
            ["DTO", "请求 CreateUserRequest，响应 UserResponse", "—", "—", "与 JSON 字段保持 camelCase：email、userId、createdAt", "与〈5.8 Body 字段命名〉呼应"],
            ["RPC Client", "PointsServiceClient（接口）+ PointsServiceClientImpl 或直接用 Feign/gRPC Stub", "grantRegistrationPoints(Long userId)", "与被调用方 API 参数名保持语义一致，而非照抄内部字段名", "—", "与〈5.6 非 CRUD 动作端点命名〉呼应"],
            ["Exception", "EmailAlreadyExistsException（业务语义 + Exception 后缀）", "—", "—", "—", "Java 社区惯例：异常类名即错误语义"],
            ["Unit Test", "UserServiceTest（JUnit5，Test 后缀）", "createUser_shouldThrowException_whenEmailAlreadyExists() 或 BDD 风格 shouldThrowException_whenEmailAlreadyExists()", "—", "—", "JUnit5 社区惯例：方法_条件_预期结果 或 should...When..."],
          ],
        },
        codeHeading: "核心代码片段（体现命名一致性，非完整实现）",
        code: [
          "// controller/UserController.java",
          "@RestController",
          "@RequestMapping(\"/users\")",
          "public class UserController {",
          "",
          "    private final UserService userService;",
          "",
          "    @PostMapping",
          "    public ResponseEntity<UserResponse> createUser(@RequestBody CreateUserRequest request) {",
          "        UserResponse response = userService.createUser(request);",
          "        return ResponseEntity.status(HttpStatus.CREATED).body(response);",
          "    }",
          "",
          "    @GetMapping(\"/{userId}\")",
          "    public ResponseEntity<UserResponse> getUserById(@PathVariable Long userId) {",
          "        return userService.findUserById(userId)",
          "                .map(ResponseEntity::ok)",
          "                .orElseGet(() -> ResponseEntity.notFound().build());",
          "    }",
          "}",
          "",
          "// service/impl/UserServiceImpl.java",
          "@Service",
          "public class UserServiceImpl implements UserService {",
          "",
          "    private final UserRepository userRepository;",
          "    private final PointsServiceClient pointsServiceClient;",
          "",
          "    @Override",
          "    @Transactional",
          "    public UserResponse createUser(CreateUserRequest request) {",
          "        if (userRepository.existsByEmail(request.getEmail())) {",
          "            throw new EmailAlreadyExistsException(request.getEmail());",
          "        }",
          "        UserEntity savedUser = userRepository.save(UserEntity.from(request));",
          "        pointsServiceClient.grantRegistrationPoints(savedUser.getId());",
          "        return UserResponse.from(savedUser);",
          "    }",
          "}",
        ],
      },
      {
        key: "scala",
        label: "Scala (Akka HTTP)",
        heading: "14.3 Scala 范例（Akka HTTP + 社区风格指南）",
        structure:
          "com.example.userservice\n ├─ http/UserRoutes.scala          // Endpoint 层\n ├─ service/UserService.scala      // trait\n ├─ service/DefaultUserService.scala\n ├─ repository/UserRepository.scala   // trait\n ├─ repository/SlickUserRepository.scala\n ├─ client/PointsServiceClient.scala  // RPC\n ├─ model/User.scala               // 领域模型（case class）\n ├─ dto/CreateUserRequest.scala\n ├─ dto/UserResponse.scala\n └─ EmailAlreadyExistsException.scala",
        table: {
          columns: ["分层", "类型/命名规范", "方法名规范", "参数名规范", "字段名规范", "依据"],
          rows: [
            ["Endpoint (Routes)", "UserRoutes（大驼峰 + Routes 后缀，Akka HTTP 惯例）", "路由内处理函数小驼峰：createUser、getUserById", "—", "—", "Akka HTTP 官方示例惯例"],
            ["Service", "trait UserService，默认实现 DefaultUserService（Scala 社区偏好 Default/XxxImpl 均可，但同一项目需统一）", "createUser(request: CreateUserRequest): Future[UserResponse]", "小驼峰，类型显式标注", "—", "Scala 社区风格指南（如 Databricks Scala Style Guide）"],
            ["Repository", "trait UserRepository，具体实现 SlickUserRepository（技术栈名 + Repository）", "findByEmail(email: String): Future[Option[User]]", "—", "—", "方法名沿用 动词+By+字段，与 Java 侧呼应"],
            ["Domain Model", "case class User(id: Long, email: String, createdAt: Instant)（不可变 case class，字段即构造参数）", "—", "—", "字段小驼峰：id、email、createdAt", "Scala 惯用不可变数据建模，字段名与 DTO/DB 映射保持一致"],
            ["DTO", "case class CreateUserRequest(email: String)、case class UserResponse(userId: Long, email: String, createdAt: Instant)", "—", "—", "与 JSON 序列化后的 camelCase 保持一致（circe/play-json 自动命名）", "与〈5.8 Body 字段命名〉呼应"],
            ["RPC Client", "PointsServiceClient（trait）+ HttpPointsServiceClient（实现，技术手段前缀）", "grantRegistrationPoints(userId: Long): Future[Unit]", "—", "—", "与 Java 侧方法名保持跨语言一致"],
            ["Exception", "EmailAlreadyExistsException（继承 RuntimeException，语义化命名）", "—", "—", "—", "与 Java 命名惯例保持一致，跨语言团队协作更顺畅"],
            ["Unit Test", "UserServiceSpec（ScalaTest，Spec 后缀，区别于 Java 的 Test）", "行为描述：it should \"throw an exception when email already exists\" in { ... }", "—", "—", "ScalaTest 社区惯例：BDD 风格描述，比拼接方法名更贴近描述行为"],
          ],
        },
        codeHeading: "核心代码片段",
        code: [
          "// service/DefaultUserService.scala",
          "class DefaultUserService(",
          "    userRepository: UserRepository,",
          "    pointsServiceClient: PointsServiceClient",
          ")(implicit ec: ExecutionContext) extends UserService {",
          "",
          "  override def createUser(request: CreateUserRequest): Future[UserResponse] =",
          "    for {",
          "      exists <- userRepository.existsByEmail(request.email)",
          "      _ = if (exists) throw new EmailAlreadyExistsException(request.email)",
          "      savedUser <- userRepository.save(User.from(request))",
          "      _ <- pointsServiceClient.grantRegistrationPoints(savedUser.id)",
          "    } yield UserResponse.from(savedUser)",
          "",
          "  override def findUserById(userId: Long): Future[Option[UserResponse]] =",
          "    userRepository.findById(userId).map(_.map(UserResponse.from))",
          "}",
          "",
          "// test/UserServiceSpec.scala",
          "class UserServiceSpec extends AnyFlatSpec with Matchers {",
          "",
          "  \"UserService\" should \"throw an exception when email already exists\" in {",
          "    // given / when / then",
          "  }",
          "}",
        ],
      },
      {
        key: "python",
        label: "Python (FastAPI)",
        heading: "14.4 Python 范例（FastAPI + PEP 8 社区惯例）",
        structure:
          "app/\n ├─ api/routes/user.py          // Endpoint 层，router\n ├─ services/user_service.py    // Service 层\n ├─ repositories/user_repository.py  // Storage 层\n ├─ clients/points_service_client.py // RPC 层\n ├─ models/user.py             // ORM/领域模型\n ├─ schemas/user.py            // Pydantic 请求/响应模型\n └─ exceptions.py\n tests/\n └─ test_user_service.py",
        table: {
          columns: ["分层", "类型/命名规范", "函数名规范", "参数名规范", "字段名规范", "依据"],
          rows: [
            ["Endpoint (router)", "模块级变量 user_router = APIRouter()（文件/模块用 snake_case）", "路由处理函数 snake_case：create_user、get_user_by_id", "函数参数 snake_case：user_id: int，请求体用 Pydantic 模型类型标注", "—", "PEP 8；FastAPI 官方文档惯例"],
            ["Service", "类 UserService（PascalCase，类名遵循 PEP 8 类命名规则）", "方法 snake_case：create_user(self, request: CreateUserRequest) -> UserResponse", "同上", "—", "PEP 8"],
            ["Repository", "类 UserRepository", "find_by_email(self, email: str) -> Optional[User]、save(self, user: User) -> User", "—", "—", "PEP 8 + 社区惯例（方法名沿用 动词+by+字段）"],
            ["ORM Model", "类 User（SQLAlchemy 惯例，模型类通常不加 Entity  㐀后缀）", "—", "—", "字段 snake_case：id、email、created_at、updated_at", "SQLAlchemy 社区惯例 + PEP 8"],
            ["Schema (DTO)", "CreateUserRequest(BaseModel)、UserResponse(BaseModel)（PascalCase，Pydantic 惯例）", "—", "—", "字段默认 snake_case（user_id、created_at），对外 JSON 若需 camelCase，通过 Pydantic 的 alias_generator/Field(alias=...) 转换", "PEP 8 优先，同时兼容〈5.8〉里 Body 字段风格需全局统一"],
            ["RPC Client", "类 PointsServiceClient", "grant_registration_points(self, user_id: int) -> None", "—", "—", "与 Java/Scala 侧方法语义保持一致"],
            ["Exception", "EmailAlreadyExistsError（Python 社区偏好 Error 而非 Exception 作为自定义异常后缀）", "—", "—", "—", "PEP 8 及标准库惯例（如 ValueError、KeyError）"],
            ["Unit Test", "文件 test_user_service.py，函数 test_create_user_raises_error_when_email_exists", "函数名即 test_+行为+条件，snake_case，全小写", "—", "—", "pytest 社区惯例：test_ 前缀是发现测试的硬性要求"],
          ],
        },
        codeHeading: "核心代码片段",
        code: [
          "# services/user_service.py",
          "class UserService:",
          "    def __init__(self, user_repository: UserRepository, points_client: PointsServiceClient):",
          "        self._user_repository = user_repository",
          "        self._points_client = points_client",
          "",
          "    def create_user(self, request: CreateUserRequest) -> UserResponse:",
          "        if self._user_repository.exists_by_email(request.email):",
          "            raise EmailAlreadyExistsError(request.email)",
          "        saved_user = self._user_repository.save(User.from_request(request))",
          "        self._points_client.grant_registration_points(saved_user.id)",
          "        return UserResponse.from_model(saved_user)",
          "",
          "    def find_user_by_id(self, user_id: int) -> Optional[UserResponse]:",
          "        user = self._user_repository.find_by_id(user_id)",
          "        return UserResponse.from_model(user) if user else None",
          "",
          "",
          "# tests/test_user_service.py",
          "def test_create_user_raises_error_when_email_exists(user_service, mock_repository):",
          "    mock_repository.exists_by_email.return_value = True",
          "    with pytest.raises(EmailAlreadyExistsError):",
          "        user_service.create_user(CreateUserRequest(email=\"a@b.com\"))",
        ],
      },
    ],
    comparisonTable: {
      columns: ["分层/概念", "Java (Spring Boot)", "Scala (Akka HTTP)", "Python (FastAPI)"],
      rows: [
        ["Endpoint 类命名", "UserController", "UserRoutes", "user_router（模块级变量，非类）"],
        ["Service 接口/实现", "UserService / UserServiceImpl", "UserService（trait）/ DefaultUserService", "UserService（类，Python 无接口/实现区分，靠鸭子类型或 Protocol）"],
        ["存储层命名", "UserRepository（interface, Spring Data 派生查询）", "UserRepository（trait）/ SlickUserRepository", "UserRepository（类）"],
        ["RPC 客户端", "PointsServiceClient", "PointsServiceClient", "PointsServiceClient"],
        ["领域模型/Entity", "UserEntity", "case class User", "User（ORM 模型类）"],
        ["请求/响应 DTO", "CreateUserRequest / UserResponse", "CreateUserRequest / UserResponse（case class）", "CreateUserRequest / UserResponse（Pydantic BaseModel）"],
        ["字段大小写", "camelCase", "camelCase", "snake_case（对外 JSON 可用 alias 转 camelCase）"],
        ["自定义异常后缀", "...Exception", "...Exception", "...Error"],
        ["单元测试文件/类命名", "UserServiceTest（JUnit5）", "UserServiceSpec（ScalaTest）", "test_user_service.py（pytest，模块级）"],
        ["测试方法命名风格", "方法_条件_预期结果", "BDD 行为描述字符串（should ... in {}）", "test_行为_条件（snake_case 全小写）"],
      ],
    },
  },

  /* =======================================================================
   * 设计原则章节（第十五~十七章）：全链路操作 / 解耦正交 / cats-effect 生态
   * 引用《The Pragmatic Programmer》正交性、《代码大全》第5~6章、cats-effect 社区惯例，
   * 均转述并标注章节，禁止逐字摘抄。
   * ===================================================================== */
  designPrinciples: {
    chapters: [
      {
        id: "15",
        title: "十五、全链路操作设计参考",
        icon: "🔁",
        intro:
          "命名规范解决「叫什么」，这一章解决「该怎么设计」。对每种常见操作，从 Endpoint → Service → Storage 讲清楚职责划分、常见坑以及对应的命名落点，把前面的命名规则套用到真实设计决策里。",
        sections: [
          {
            num: "15.1",
            title: "创建 Create",
            principle:
              "创建接口用 POST /resources，建议支持幂等键防重复提交；Service 编排校验与副作用；Storage 插入并返回完整实体。",
            why:
              "「创建」最容易被设计成可重复点击两次产生两条记录的脆弱接口。把幂等责任（Idempotency-Key）、业务规则校验（唯一性/配额）、副作用编排（写库 + RPC + 发事件）清晰分层，分别落到 Endpoint / Service / Storage，是后续所有写操作的基础范式。参考《代码大全》第 5 章「设计中的层次」关于职责划分的论述。",
            table: {
              columns: ["层", "设计要点", "命名落点", "常见坑"],
              rows: [
                ["Endpoint", "POST /resources；建议支持 Idempotency-Key 请求头防重复提交", "方法名 createXxx；成功返回 201 Created + Location 响应头", "把创建接口设计成可被重复点击两次却产生两条记录"],
                ["Service", "校验业务规则（唯一性、配额），组装领域对象，编排副作用（写库 + RPC + 发事件）", "CreateXxxRequest → XxxResponse；如需要发领域事件命名为 XxxCreatedEvent", "把参数校验和业务规则校验混在一起，导致 Service 方法过长、职责不清晰"],
                ["Storage", "插入并返回生成的主键；唯一性约束建议数据库层也加一道（不要只信任应用层校验）", "save / insert，返回值命名为新建实体本身而非裸 ID", "只在应用层查重（先 SELECT 再 INSERT），并发场景下产生竞态条件，生成重复记录"],
                ["响应设计", "返回创建后的完整资源表示，而不是仅返回一个 ID", "—", "只返回 {\"id\": 123}，前端还要再发一次 GET 才能拿到完整数据，增加一次不必要的往返"],
              ],
            },
            refs: ["参考：《代码大全》第 5 章「设计中的层次」"],
          },
          {
            num: "15.2",
            title: "检索 / 过滤 Retrieve & Filter",
            principle:
              "单条查询与列表查询语义不同，命名和返回类型都要体现差异：按 ID 查用 findXxxById（返回 Option），列表搜索用 searchXxx / listXxx（返回分页集合）。",
            why:
              "「按主键查一条」和「按条件搜一批」在领域语义上完全不同：前者查无结果是「合法的缺失」，后者空列表是「正常结果」。把两者用不同方法名与返回类型区分，调用方就不会把「没查到」误当成「出错了」。过滤条件超过 2~3 个时应聚合为 XxxSearchCriteria / XxxFilter 对象，避免长参数列表反模式（呼应第一章）。",
            table: {
              columns: ["场景", "命名", "返回类型", "找不到时的行为"],
              rows: [
                ["按主键单条查询", "findXxxById / getXxxById", "Optional<Xxx> / Option[Xxx] / Xxx | None", "不是错误，是「合法的缺失」，交由调用方决定是否升级为错误（见十七章）"],
                ["条件过滤 / 搜索列表", "searchXxx / listXxx", "分页集合（Page<Xxx> 或自定义 {items, page, pageSize, totalCount}）", "空列表是正常结果，不应抛异常，也不应返回 404"],
              ],
            },
            notes: [
              "过滤参数对象化：条件超过 2~3 个时聚合为 XxxSearchCriteria / XxxFilter，例如 UserSearchCriteria{emailContains, status, createdAfter, pageRequest}。",
              "分页参数全站二选一并写入规范：page + pageSize（页码分页，适合管理后台跳页）或 cursor + limit（游标分页，适合大数据量频繁变化的列表，避免深分页性能问题）。",
              "过滤 vs 搜索的接口：简单精确匹配用 Query 参数（?status=active）；复杂全文检索建议单独开语义清晰的端点或用 POST /resources/search（请求体传复杂查询 DSL），避免把过长过滤条件塞进 URL。",
            ],
            code: [
              "public class UserSearchCriteria {",
              "    private String emailContains;",
              "    private UserStatus status;",
              "    private Instant createdAfter;",
              "    private PageRequest pageRequest; // page, pageSize, sortBy, order",
              "}",
            ],
            refs: ["参考：《代码大全》第 11 章「变量名的力量」（长参数列表反模式）", "参考：JSON:API 规范（include / 过滤参数）"],
          },
          {
            num: "15.3",
            title: "修改 Update（全量 vs 局部）",
            principle:
              "全量替换用 PUT /resources/{id} + updateXxx（幂等）；局部更新用 PATCH /resources/{id} + patchXxx / partialUpdateXxx（只提交变化字段）。",
            why:
              "PUT 要求提交完整资源表示，未提交的字段应视为置空，语义幂等；PATCH 只提交变化字段，减少误覆盖风险，适合移动端精细化更新。局部更新的 DTO 每个字段必须能区分「未传」与「传了 null」（Java/Scala 用 Optional/Option，Python 用 Unset 哨兵或 exclude_unset），否则无法表达「不想改这个字段」。在不可变数据风格（Scala case class）中，「更新」本质是「基于旧值构造新值」，命名上体现「生成新版本」而非「原地修改」。",
            table: {
              columns: ["方式", "HTTP 方法", "语义", "命名落点", "适用场景"],
              rows: [
                ["全量替换", "PUT /resources/{id}", "幂等，必须提交完整资源表示，未提交字段视为置空", "updateXxx(id, XxxRequest)", "客户端总是拿到完整对象后再整体提交（如表单编辑页）"],
                ["局部更新", "PATCH /resources/{id}", "只提交变化的字段", "patchXxx(id, XxxPatchRequest) 或 partialUpdateXxx", "移动端 / 精细化字段更新，减少误覆盖风险"],
              ],
            },
            notes: [
              "局部更新 DTO：每个字段用 Optional<T> / Option[T]（Java/Scala）或显式区分「未传」与「传了 null」（Python 可用 Unset 哨兵或 exclude_unset），否则无法区分「用户没传这个字段」和「用户想把它清空」。",
              "函数式建模下的更新：不可变数据中「更新」=「基于旧值构造新值」，命名体现「生成新版本」：val updatedUser = existingUser.copy(email = newEmail, updatedAt = Instant.now())。",
              "并发控制：需要乐观锁时实体加 version 字段（或 updatedAt 做 ETag），接口层通过 If-Match 传入版本号，冲突返回 409 Conflict，方法可命名为 updateXxxIfVersionMatches 或在 Service 内部统一处理，不必把「乐观锁」写进每个方法名（避免过度暴露实现细节）。",
            ],
            refs: ["参考：《代码大全》第 11 章（命名应表达意图，而非实现细节）"],
          },
          {
            num: "15.4",
            title: "删除 Delete（软删 / 硬删）",
            principle:
              "默认用软删除（deleteXxx，内部标记 deleted_at）；真正不可逆的清除用 purgeXxx / hardDeleteXxx，命名必须明确区别于普通删除。",
            why:
              "绝大多数业务资源应默认软删，保留可恢复性与审计能力，对外语义仍是「删除」。硬删除（真正执行 DELETE FROM）只在合规要求（如 GDPR 数据擦除）或后台清理中使用，且需要单独权限控制，命名上必须用 purge / hardDelete 明确提示「不可逆」。幂等性上，DELETE 已删除的资源再次调用建议仍返回 204 而非 404，具体选择写进规范并全站统一。",
            table: {
              columns: ["类型", "命名", "数据库表现", "使用建议"],
              rows: [
                ["软删除（默认推荐）", "deleteXxx（对外语义「删除」，内部实现是标记）", "deleted_at 置为当前时间，默认查询自动过滤 deleted_at IS NULL", "绝大多数业务资源应默认软删，保留可恢复性和审计能力"],
                ["硬删除", "purgeXxx / hardDeleteXxx（命名必须明确区别于普通删除，提示「不可逆」）", "真正执行 DELETE FROM", "只在合规要求（如 GDPR 数据擦除）或后台清理任务中使用，且需要单独的权限控制"],
              ],
            },
            notes: [
              "幂等性：DELETE /resources/{id} 对已被删除的资源再次调用，建议仍返回 204 No Content（幂等语义），而非 404；具体选择需写进团队规范并全站统一。",
              "级联删除的命名与设计：涉及关联资源级联删除时，在 Service 层显式编排（如 deleteUserAndCascadeOrders），不要仅依赖数据库外键 ON DELETE CASCADE 静默处理业务上重要的级联关系——至少保证这个决策在代码里「看得见」。",
            ],
            refs: ["参考：GDPR 数据擦除要求（硬删除的使用边界）"],
          },
          {
            num: "15.5",
            title: "关联关系查询 Relational Query",
            principle:
              "用批量预加载（findAllWithOrders）替代 N+1 循环查询；用组合 DTO 暴露所需字段；用 JSON:API 的 include 参数让客户端按需展开关联，避免「膨胀版」接口组合爆炸。",
            why:
              "N+1 查询（先查列表再循环查关联）是典型的性能反模式，应在 Repository 层提供批量 JOIN / 批量 IN 的预加载方法，并用命名区分「带关联数据」与「轻量版」（findAllWithOrders vs findAll），让调用方明确知道自己拿到的是什么。响应体应显式定义组合 DTO（只暴露需要的字段），不要直接序列化 ORM 实体（含懒加载代理）。为每种关联组合单独开接口会导致组合爆炸，宜用 include 参数由客户端声明需要展开的关联。",
            table: {
              columns: ["设计问题", "反模式", "推荐做法", "命名落点"],
              rows: [
                ["N+1 查询", "先查用户列表，再对每个用户循环查订单", "Repository 层提供批量预加载方法，一次性 JOIN 或批量 IN 查询", "findAllWithOrders（预加载版）区别于 findAll（精简版），让调用方明确知道自己拿到的是「带关联数据」还是「轻量版」"],
                ["响应体结构", "直接把 ORM 实体（含所有关联对象的懒加载代理）序列化返回", "显式定义组合 DTO，只暴露需要的字段", "UserWithOrdersResponse { user: UserResponse, orders: List<OrderSummary> }"],
                ["客户端按需展开关联数据", "每个关联关系都单独开一个「膨胀版」接口（getUserWithOrders、getUserWithOrdersAndPayments……组合爆炸）", "参考 JSON:API 的 include 查询参数惯例：GET /users/1?include=orders,payments，由客户端声明需要展开哪些关联", "Service / Repository 层对应提供可组合的加载方法，而非为每种组合单独写一个方法"],
              ],
            },
            refs: ["参考：JSON:API 规范（include 参数惯例）"],
          },
        ],
      },
      {
        id: "16",
        title: "十六、解耦与正交设计原则",
        icon: "🧩",
        intro:
          "命名让单个符号「说人话」，这一章讲模块与模块之间「互不拖累」——参考《The Pragmatic Programmer》关于「正交性」的论述，以及《代码大全》第 5~6 章关于设计与类的构建思想，转述为可直接落地的分层实践。",
        sections: [
          {
            num: "16.1",
            title: "分层单向依赖",
            principle:
              "依赖方向必须单向：Endpoint → Service → Repository/Client；Service 依赖 Repository 的接口/trait 而非具体实现类（依赖倒置）。",
            why:
              "强制单向依赖避免循环引用与「改一处牵全身」。Service 只依赖 Repository 的接口（依赖倒置，Dependency Inversion），具体实现通过依赖注入在启动时装配。直接收益：单元测试可用 Mock/Stub 替换 Repository，不需要真实数据库。",
            refs: ["参考：《The Pragmatic Programmer》——「Orthogonality」", "参考：《代码大全》第 5~6 章（设计与类的构建）"],
          },
          {
            num: "16.2",
            title: "正交性：模块之间互不知晓内部细节",
            principle:
              "判断标准：修改模块 A 的内部实现，是否需要连带修改模块 B？如果需要，说明两者不正交，存在不必要的耦合。",
            why:
              "正交的系统里，每个模块只对自己的职责负责，改动被限制在局部。耦合的征兆是「一个改动要同步改多处」。把 SQL 细节、存储技术、实现类、跨职责逻辑从上层剥离，让每一层只看见「下一层的契约」而非「下一层的实现细节」，是降低耦合的核心手段。",
            table: {
              columns: ["反例（耦合）", "正例（正交）", "说明"],
              rows: [
                ["UserService 里直接拼 SQL 字符串操作数据库", "UserService 只依赖 UserRepository 接口，SQL 细节完全封装在实现类内部", "Service 换用哪种存储技术（MySQL/Mongo/内存）不应影响业务逻辑代码"],
                ["UserController 直接依赖具体的 MySqlUserRepositoryImpl", "UserController 只依赖 UserService 接口，UserService 只依赖 UserRepository 接口", "每一层只知道「下一层的契约」，不知道「下一层的实现细节」"],
                ["一个函数既做参数校验，又做业务计算，还顺带写日志和发消息", "拆成职责单一的小函数：validate / calculate / persist / notify，由上层编排调用顺序", "每个小函数可以独立测试、独立复用、独立替换"],
              ],
            },
            refs: ["参考：《The Pragmatic Programmer》——「Orthogonality」"],
          },
          {
            num: "16.3",
            title: "端口与适配器（Ports & Adapters / 六边形架构）",
            principle:
              "领域核心（Domain / Service 业务逻辑）不应 import 任何框架相关类；HTTP Controller、Repository 实现、RPC Client 都是实现「端口」的「适配器」。",
            why:
              "当业务逻辑不依赖任何框架（Spring 的 @Component、数据库驱动、HTTP 客户端库），就可以脱离框架单独跑单元测试；替换 Web 框架或数据库时，领域层代码零改动。Controller / Repository / RPC Client 实现由领域层定义的接口（端口），是「插头与插座」的关系。",
            refs: ["参考：Alistair Cockburn 六边形架构（Ports & Adapters）"],
          },
          {
            num: "16.4",
            title: "Command / Query 分离（轻量级 CQRS）",
            principle:
              "即使不引入完整 CQRS 基础设施，也建议区分「读路径」与「写路径」：写用输入型 DTO，读用输出型 DTO，两者不必字段一一对应。",
            why:
              "写路径（Command）的 DTO 重点是校验完整性与业务规则（CreateXxxRequest）；读路径（Query）的 DTO 可按展示需要裁剪字段（XxxResponse / XxxSummary）。常见误区是「一个模型走天下」：同一个类既当数据库实体、又当请求体、又当响应体，导致任何一处改动互相牵连——这正是「不正交」的典型表现。",
            refs: ["参考：轻量级 CQRS（读写模型分离）"],
          },
          {
            num: "16.5",
            title: "可组合性：小函数优于大函数",
            principle:
              "优先编写无副作用、输入输出明确的小函数，通过组合构建复杂行为，而非写一个「做了十件事」的大函数。",
            why:
              "在 OOP 中体现为职责单一的方法 + 组合调用；在 FP（如 Scala + cats-effect）中体现为通过 for-comprehension / flatMap 链式组合多个小的 F[_] 计算（见十七章）。小函数的收益是可独立测试、复用、替换，且命名能精确表达单一意图。",
            refs: ["参考：《代码大全》第 6 章（子程序构建）"],
          },
        ],
      },
      {
        id: "17",
        title: "十七、cats-effect 生态专属设计规范",
        icon: "🐱",
        intro:
          "这一章面向使用 Scala + cats-effect（IO、Tagless Final 风格）的团队，重点回答一个高频困惑：错误到底该用 sealed trait 的 Error ADT 表示，还是用 Option 表示？以及这套生态里其他值得沉淀成规范的命名/设计惯例。",
        sections: [
          {
            num: "17.1",
            title: "Option vs Error ADT：判断标准",
            principle:
              "Option 表示「缺失是一种合法、预期内的状态」；Error ADT（通常配合 Either/EitherT）表示「需要调用方特殊处理、带有语义信息的失败」。",
            decisionTree: true,
            why:
              "一句话记忆：Option 回答「有没有」，Error ADT 回答「为什么不行、该怎么办」。当「没有」这件事本身需要被调用方特殊处理并展示明确原因时，就该从 Option 提升为 Error ADT。下方交互式决策树可帮你逐步判断。",
            table: {
              columns: ["场景", "用 Option 还是 Error ADT", "理由", "示例签名"],
              rows: [
                ["Repository 按主键查询，可能查无此记录", "Option", "查一条不存在的记录本身不是「失败」，是数据库的正常回答", "def findById(id: UserId): F[Option[User]]"],
                ["Service 层某个动作要求用户必须存在（否则无法继续）", "把 Option 提升为 Error ADT", "在此业务语境下，「用户不存在」变成需被调用方感知并处理（如返回 404）的失败分支", "EitherT.fromOptionF(repo.findById(id), UserError.UserNotFound)"],
                ["邮箱已被占用、参数格式非法、余额不足等业务规则校验失败", "Error ADT", "这些失败有明确语义，调用方（如 Controller）需据此映射不同 HTTP 状态码", "sealed trait UserError；case class EmailAlreadyExists(email: String) extends UserError"],
                ["领域模型里某个字段本身就是可选的（如用户中间名）", "Option", "这是数据建模层面的「可能没有这个值」，与错误处理无关", "case class User(id: UserId, email: String, middleName: Option[String])"],
                ["外部 RPC 调用超时 / 网络失败", "Error ADT（通常还需区分「可重试」与「不可重试」）", "需携带足够信息供上层决定重试策略、告警级别", "sealed trait PointsServiceError；case class Timeout(afterMs: Long) extends PointsServiceError"],
                ["多个字段同时校验，需一次性收集所有错误而非查到第一个就短路", "Error ADT + ValidatedNel（而非 Either）", "Either/EitherT 是短路语义；ValidatedNel 是累积语义，适合表单类校验", "def validate(req: CreateUserRequest): ValidatedNel[ValidationError, CreateUserRequest]"],
              ],
            },
            refs: ["参考：cats-effect 官方文档（Error 建模）", "参考：《Scala with Cats》Error handling 章节"],
          },
          {
            num: "17.2",
            title: "错误 ADT 的命名与组织规范",
            principle:
              "顶层设计 sealed trait XxxError，按领域（而非按层）划分；子类型用名词短语描述失败原因，父 trait 已带 Error 后缀故子类型不必重复。",
            why:
              "错误 ADT 应按领域划分（UserError、OrderError），而不是笼统一个全局 AppError（除非项目很小）。具体错误用 case class（需要携带上下文，如 email: String）或 case object（无附加信息，如 UserNotFound）。命名用名词短语描述失败原因，不要在子类型上重复 Error 后缀（父 trait 已叫 UserError，子类型直接叫 EmailAlreadyExists）。Controller 层用一个集中的 xxxErrorMapper 把 Error ADT 映射为 HTTP 状态码，避免每个 Controller 方法散落 match 语句。",
            code: [
              "sealed trait UserError extends Product with Serializable",
              "",
              "object UserError {",
              "  final case class EmailAlreadyExists(email: String) extends UserError",
              "  final case class InvalidEmailFormat(email: String) extends UserError",
              "  case object UserNotFound extends UserError",
              "}",
            ],
            refs: ["参考：cats-effect 社区惯例（Error ADT 组织）"],
          },
          {
            num: "17.3",
            title: "Tagless Final 与算法 / 解释器命名",
            principle:
              "Trait（「算法」algebra）用领域名词命名（UserService[F[_]]）；具体解释器命名三选一（UserServiceImpl / DefaultUserService / LiveUserService）并全站统一。",
            why:
              "定义 algebra 时用领域名词（UserService[F[_]]），方法签名返回 F[Either[UserError, UserResponse]] 等。解释器（interpreter/实现）命名社区常见几种流派：UserServiceImpl、DefaultUserService、LiveUserService（ZIO 生态更常见，cats-effect 项目也不少见）——团队需三选一并写入规范，不要在同一项目混用多种风格。类型参数统一用 F[_]，约束（typeclass constraint）就近声明在需要的地方（如 def createUser[F[_]: Sync] 或 class DefaultUserService[F[_]: Async]）。",
            code: [
              "trait UserService[F[_]] {",
              "  def createUser(request: CreateUserRequest): F[Either[UserError, UserResponse]]",
              "  def findUserById(id: UserId): F[Option[UserResponse]]",
              "}",
            ],
            refs: ["参考：Tagless Final 模式（algebra / interpreter 命名）"],
          },
          {
            num: "17.4",
            title: "资源管理与并发状态命名",
            principle:
              "需获取/释放的资源用 Resource[F, A] 建模，命名 xxxResource；并发可变状态用 Ref[F, State]，变量名带 Ref 后缀提示并发安全。",
            why:
              "数据库连接池、HTTP 客户端等需要获取/释放的资源用 Resource[F, A] 建模（def dbResource: Resource[F, Transactor[F]]）。并发可变状态用 Ref[F, State]，变量名体现「这是被并发安全管理的状态」，如 Ref[F, Map[UserId, Int]] 命名为 userPointsCacheRef——Ref 后缀提示这不是普通字段，操作需走 .get / .update API。",
            refs: ["参考：cats-effect Resource / Ref 文档"],
          },
          {
            num: "17.5",
            title: "与其他章节的呼应",
            principle:
              "本章的 Option / Error 判断标准与 15.2「按 ID 查询可能查无，属合法缺失」完全一致；建议在这两处内容之间加交叉链接。",
            why:
              "UserError / Option 的判断标准，与〈十五 · 15.2 检索/过滤〉「按 ID 查询可能查无此记录，属于合法缺失」的结论完全一致——这不是 Scala 特有的规则，只是 cats-effect 生态提供了更精确的类型工具（Option vs Either）在类型层面强制表达出来。与〈十四 · 14.3 Scala 范例〉的 UserRepository.findByEmail 返回类型也呼应，网站应在这些位置加交叉链接，减少读者来回跳转。",
            refs: ["呼应：〈十五 · 15.2 检索/过滤〉", "呼应：〈十四 · 14.3 Scala 范例〉"],
          },
        ],
      },
    ],
  },
};
