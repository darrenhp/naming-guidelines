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
};
