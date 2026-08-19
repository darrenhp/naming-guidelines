/* =========================================================================
 * app.js —— 渲染与交互逻辑（原生 ES6，无依赖）
 * 职责：hash 路由、数据驱动渲染、全站搜索、深色模式、响应式菜单、
 *      案例库筛选、速查表打印、一键复制、AI 提示词占位符替换、Onboarding 自测。
 * 所有内容来自 window.SITE_DATA（data.js）。
 * 命名约定：JS 变量驼峰；与 data.js 字段保持一致。
 * ========================================================================= */
(function () {
  "use strict";

  var DATA = window.SITE_DATA;
  var app = document.getElementById("app");
  var searchInput = document.getElementById("search-input");
  var searchResults = document.getElementById("search-results");
  var sidebar = document.getElementById("sidebar");
  var sidebarOverlay = document.getElementById("sidebar-overlay");
  var hamburger = document.getElementById("hamburger");
  var themeToggle = document.getElementById("theme-toggle");
  var nav = document.getElementById("nav");
  var toast = document.getElementById("toast");

  var state = {
    searchTerm: "",
    pendingHighlight: "",
    casesCat: "all",
    casesQuery: "",
  };

  /* ---------------------- 工具函数 ---------------------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c];
    });
  }
  function escAttr(s) {
    return esc(s).replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function escapeForCode(s) {
    return String(s == null ? "" : s).replace(/[&<>]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c];
    });
  }
  function escapeRegExp(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  // 极简 TS/SQL/JSON 语法高亮（单遍正则，安全不破坏 HTML）
  var KW =
    "const|let|var|function|return|if|else|for|while|class|interface|enum|type|import|export|new|public|private|readonly|extends|implements|async|await|void|true|false|null|undefined|this|typeof|as|from|of|in|CREATE|TABLE|INDEX|VIEW|SELECT|FROM|WHERE|ON|ALTER|ADD|CONSTRAINT|FOREIGN|KEY|REFERENCES|PRIMARY|UNIQUE|CHECK|DEFAULT|NOT|BIGINT|VARCHAR|BOOLEAN|TIMESTAMP|INTEGER|CHAR|ENUM|NOW|AND|OR";
  function highlightCode(code) {
    var escaped = escapeForCode(code);
    var pattern = new RegExp(
      "(\\/\\/[^\\n]*)|('(?:[^'\\\\]|\\\\.)*'|\"(?:[^\"\\\\]|\\\\.)*\"|`(?:[^`\\\\]|\\\\.)*`)|\\b(" +
        KW +
        ")\\b",
      "g"
    );
    return escaped.replace(pattern, function (m, comment, str, kw) {
      if (comment) return '<span class="tok-comment">' + comment + "</span>";
      if (str) return '<span class="tok-string">' + str + "</span>";
      if (kw) return '<span class="tok-kw">' + kw + "</span>";
      return m;
    });
  }

  var toastTimer = null;
  function showToast(msg) {
    toast.textContent = msg;
    toast.hidden = false;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.hidden = true;
    }, 1600);
  }

  function copyText(text) {
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        showToast("已复制");
      } catch (e) {
        showToast("复制失败，请手动选择");
      }
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        function () {
          showToast("已复制");
        },
        function () {
          fallback();
        }
      );
    } else {
      fallback();
    }
  }

  /* ---------------------- 数据检索辅助 ---------------------- */
  function getCategory(catId) {
    for (var i = 0; i < DATA.categories.length; i++) {
      if (DATA.categories[i].id === catId) return DATA.categories[i];
    }
    return null;
  }
  function getSection(catId, secId) {
    var cat = getCategory(catId);
    if (!cat) return null;
    for (var i = 0; i < cat.sections.length; i++) {
      if (cat.sections[i].id === secId) return cat.sections[i];
    }
    return null;
  }

  function collectCases() {
    var cases = [];
    DATA.categories.forEach(function (cat) {
      cat.sections.forEach(function (sec) {
        (sec.tables || []).forEach(function (t) {
          (t.rows || []).forEach(function (r) {
            cases.push({
              catId: cat.id,
              catTitle: cat.title,
              secId: sec.id,
              secTitle: sec.title,
              group: r.group || "",
              bad: r.bad,
              good: r.good,
              note: r.note,
            });
          });
        });
      });
    });
    return cases;
  }

  /* ---------------------- 搜索索引 ---------------------- */
  var searchIndex = [];
  (function buildSearchIndex() {
    DATA.categories.forEach(function (cat) {
      cat.sections.forEach(function (sec) {
        var parts = [sec.title, sec.principle, sec.why || ""];
        (sec.tables || []).forEach(function (t) {
          t.rows.forEach(function (r) {
            if (t.type === "four") parts.push(r.group, r.bad, r.good, r.note);
            else parts.push(r.bad, r.good, r.note);
          });
        });
        (sec.refs || []).forEach(function (rf) {
          parts.push(rf);
        });
        searchIndex.push({
          catId: cat.id,
          catTitle: cat.title,
          secId: sec.id,
          secTitle: sec.title,
          text: parts.join(" ").toLowerCase(),
          snippet: sec.principle,
        });
      });
    });

    // 多语言范例页纳入搜索
    if (DATA.multiLang) {
      var mlParts = [DATA.multiLang.intro];
      mlParts.push(DATA.multiLang.layersTable.columns.join(" "));
      DATA.multiLang.layersTable.rows.forEach(function (r) {
        mlParts.push(r.join(" "));
      });
      DATA.multiLang.languages.forEach(function (l) {
        mlParts.push(l.heading, l.structure, l.code.join(" "));
        l.table.rows.forEach(function (r) {
          mlParts.push(r.join(" "));
        });
      });
      DATA.multiLang.comparisonTable.rows.forEach(function (r) {
        mlParts.push(r.join(" "));
      });
      searchIndex.push({
        catId: "multi-lang",
        catTitle: "多语言范例",
        secId: "",
        secTitle: "多语言分层服务命名范例",
        text: mlParts.join(" ").toLowerCase(),
        snippet: DATA.multiLang.intro,
      });
    }

    // 设计原则章节（十五~十七章）纳入搜索
    if (DATA.designPrinciples) {
      DATA.designPrinciples.chapters.forEach(function (ch) {
        ch.sections.forEach(function (sec) {
          var sp = [sec.num, sec.title, sec.principle, sec.why || ""];
          if (sec.table) {
            sp.push(sec.table.columns.join(" "));
            sec.table.rows.forEach(function (r) {
              sp.push(r.join(" "));
            });
          }
          if (sec.code) sp.push(sec.code.join(" "));
          if (sec.notes) sp.push(sec.notes.join(" "));
          searchIndex.push({
            catId: "design-" + ch.id,
            catTitle: ch.title,
            secId: sec.num,
            secTitle: sec.num + " " + sec.title,
            text: sp.join(" ").toLowerCase(),
            snippet: sec.principle,
          });
        });
      });
    }
  })();

  function runSearch(query) {
    var q = query.trim().toLowerCase();
    if (!q) {
      searchResults.hidden = true;
      searchResults.innerHTML = "";
      return;
    }
    var hits = searchIndex.filter(function (i) {
      return i.text.indexOf(q) !== -1;
    });
    if (!hits.length) {
      searchResults.hidden = false;
      searchResults.innerHTML =
        '<div class="sr-empty">没有匹配「' + esc(query) + "」的内容</div>";
      return;
    }
    var html = '<div class="sr-group">找到 ' + hits.length + " 个章节</div>";
    hits.forEach(function (h) {
      html +=
        '<a href="#/' +
        esc(h.catId) +
        "/" +
        esc(h.secId) +
        '">' +
        '<div class="sr-title">' +
        esc(h.catTitle) +
        " › " +
        esc(h.secTitle) +
        "</div>" +
        '<div class="sr-snippet">' +
        esc(h.snippet) +
        "</div></a>";
    });
    searchResults.hidden = false;
    searchResults.innerHTML = html;
  }

  /* ---------------------- 渲染：表格 / 章节 / 示例 ---------------------- */
  function renderTable(t) {
    var html = '<div class="table-scroll"><table class="cmp"><thead><tr>';
    t.columns.forEach(function (c) {
      html += "<th>" + esc(c) + "</th>";
    });
    html += "</tr></thead><tbody>";
    t.rows.forEach(function (r) {
      if (t.type === "four") {
        html +=
          "<tr><td>" +
          esc(r.group) +
          '</td><td class="cell-bad"><code>' +
          esc(r.bad) +
          '</code></td><td class="cell-good"><span class="cell-copy"><code>' +
          esc(r.good) +
          '</code><button class="copy-btn" type="button" aria-label="复制正例">复制</button></span></td><td>' +
          esc(r.note) +
          "</td></tr>";
      } else {
        html +=
          '<tr><td class="cell-bad"><code>' +
          esc(r.bad) +
          '</code></td><td class="cell-good"><span class="cell-copy"><code>' +
          esc(r.good) +
          '</code><button class="copy-btn" type="button" aria-label="复制正例">复制</button></span></td><td>' +
          esc(r.note) +
          "</td></tr>";
      }
    });
    html += "</tbody></table></div>";
    return html;
  }

  function renderExamples(examples) {
    if (!examples || !examples.length) return "";
    return examples
      .map(function (ex) {
        return (
          '<pre class="code-block"><code>' +
          highlightCode(ex.code) +
          "</code></pre>" +
          (ex.caption ? '<div class="code-caption">' + esc(ex.caption) + "</div>" : "")
        );
      })
      .join("");
  }

  // 通用多列表格（列名动态，不做 ❌/✅ 着色），用于多语言范例页
  function renderPlainTable(t) {
    var html = '<div class="table-scroll"><table class="cmp"><thead><tr>';
    t.columns.forEach(function (c) {
      html += "<th>" + esc(c) + "</th>";
    });
    html += "</tr></thead><tbody>";
    t.rows.forEach(function (r) {
      html += "<tr>";
      for (var i = 0; i < t.columns.length; i++) {
        html += "<td>" + esc(r[i] == null ? "" : r[i]) + "</td>";
      }
      html += "</tr>";
    });
    html += "</tbody></table></div>";
    return html;
  }

  /* ---------------------- 渲染：多语言分层服务范例 ---------------------- */
  function renderMultiLang() {
    var ml = DATA.multiLang;
    var html =
      '<div class="page-head"><h1>🌐 多语言分层服务命名范例</h1>' +
      '<p class="muted">' + esc(ml.intro) + "</p></div>";

    html += '<h2 class="section-title">14.1 统一分层结构与职责</h2>';
    html += renderPlainTable(ml.layersTable);

    html += '<h2 class="section-title">14.2–14.4 三语言范例（Tab 切换）</h2>';
    html += '<div class="lang-tabs" id="lang-tabs">';
    ml.languages.forEach(function (lang, i) {
      html +=
        '<button class="lang-tab' +
        (i === 0 ? " active" : "") +
        '" data-lang="' +
        esc(lang.key) +
        '">' +
        esc(lang.label) +
        "</button>";
    });
    html += '</div><div id="lang-panels">';
    ml.languages.forEach(function (lang, i) {
      html +=
        '<div class="lang-panel' +
        (i === 0 ? " active" : "") +
        '" data-lang="' +
        esc(lang.key) +
        '">';
      html += '<h3>' + esc(lang.heading) + "</h3>";
      html +=
        '<div class="code-block tree"><pre><code>' +
        esc(lang.structure) +
        "</code></pre></div>";
      html += renderPlainTable(lang.table);
      html +=
        '<h4 class="sub-title">' + esc(lang.codeHeading) + "</h4>";
      html += renderExamples([{ code: lang.code.join("\n"), caption: "" }]);
      html += "</div>";
    });
    html += "</div>";

    html += '<h2 class="section-title">14.5 三语言横向对照表</h2>';
    html += renderPlainTable(ml.comparisonTable);

    app.innerHTML = html;

    var tabs = app.querySelectorAll(".lang-tab");
    tabs.forEach(function (t) {
      t.addEventListener("click", function () {
        var key = t.getAttribute("data-lang");
        tabs.forEach(function (x) {
          x.classList.remove("active");
        });
        t.classList.add("active");
        app.querySelectorAll(".lang-panel").forEach(function (p) {
          p.classList.toggle("active", p.getAttribute("data-lang") === key);
        });
      });
    });
    afterRender();
    closeSidebar();
  }

  /* ---------------------- 渲染：设计原则章节（十五~十七章） ---------------------- */
  function renderDesign(chapterId) {
    var chapter = null;
    DATA.designPrinciples.chapters.forEach(function (c) {
      if (c.id === chapterId) chapter = c;
    });
    if (!chapter) {
      app.innerHTML = notFound("未找到设计原则章节：" + esc(chapterId || ""));
      afterRender();
      closeSidebar();
      return;
    }
    var html =
      '<div class="page-head"><h1>' +
      esc(chapter.icon) + " " + esc(chapter.title) +
      '</h1><p class="muted">' + esc(chapter.intro) + "</p></div>";
    chapter.sections.forEach(function (sec) {
      html += '<section class="content-section" id="sec-' + esc(sec.num) + '">';
      html +=
        '<h2 class="section-title">' +
        esc(sec.num) + " " + esc(sec.title) + "</h2>";
      html += '<div class="principle">' + esc(sec.principle) + "</div>";
      if (sec.why) {
        html +=
          '<details class="why"><summary>为什么（点开看原理与出处）</summary><p>' +
          esc(sec.why) + "</p></details>";
      }
      if (sec.table) html += renderPlainTable(sec.table);
      if (sec.code && sec.code.length) {
        html += renderExamples([{ code: sec.code.join("\n"), caption: "" }]);
      }
      if (sec.notes && sec.notes.length) {
        html += '<ul class="notes">';
        sec.notes.forEach(function (n) {
          html += "<li>" + esc(n) + "</li>";
        });
        html += "</ul>";
      }
      if (sec.decisionTree) html += renderDecisionTree();
      if (sec.refs) html += renderRefs(sec.refs);
      html += "</section>";
    });
    app.innerHTML = html;
    if (chapterId === "17") bindDecisionTree();
    afterRender();
    closeSidebar();
  }

  /* 17.1 Option vs Error ADT 交互决策树（静态结构，交互由 bindDecisionTree 绑定） */
  function renderDecisionTree() {
    return (
      '<div class="decision-tree" id="dt-option-error">' +
      '<h4 class="dt-title">🤔 交互决策树：这个字段 / 失败该用 Option 还是 Error ADT？</h4>' +
      '<div class="dt-node" id="dt-q1">' +
      '<p class="dt-q">这个「缺失 / 失败」情况，调用方<strong>需不需要特殊处理</strong>（展示原因、映射错误码、决定重试）？</p>' +
      '<div class="dt-opts">' +
      '<button class="dt-btn" data-branch="opt">不需要，只是数据上「可能没有」</button>' +
      '<button class="dt-btn" data-branch="err">需要（是「失败」，要带语义）</button>' +
      "</div></div>" +
      '<div class="dt-node" id="dt-q2" style="display:none">' +
      '<p class="dt-q">需要一次性<strong>收集所有错误</strong>（而非查到第一个就停）吗？</p>' +
      '<div class="dt-opts">' +
      '<button class="dt-btn" data-branch="validated">是（表单类多字段校验）</button>' +
      '<button class="dt-btn" data-branch="either">否（遇第一个错误即可短路）</button>' +
      "</div></div>" +
      '<div class="dt-result" id="dt-result"></div>' +
      "</div>"
    );
  }

  function bindDecisionTree() {
    var root = document.getElementById("dt-option-error");
    if (!root) return;
    var q2 = document.getElementById("dt-q2");
    var result = document.getElementById("dt-result");
    root.querySelectorAll(".dt-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var branch = btn.getAttribute("data-branch");
        if (branch === "opt") {
          showResult(
            "✅ 用 <strong>Option</strong>",
            "这只是数据建模层面的「可能没有」（如用户中间名、查无记录属合法缺失），与错误处理无关。",
            "def findById(id: UserId): F[Option[User]]"
          );
        } else if (branch === "err") {
          q2.style.display = "block";
          q2.scrollIntoView({ behavior: "smooth", block: "nearest" });
        } else if (branch === "validated") {
          showResult(
            "✅ 用 <strong>Error ADT + ValidatedNel</strong>",
            "Either / EitherT 是短路语义（遇第一个错误就停）；ValidatedNel 是累积语义，适合表单类多字段校验，一次性收集全部错误。",
            "def validate(req: CreateUserRequest): ValidatedNel[ValidationError, CreateUserRequest]"
          );
        } else if (branch === "either") {
          showResult(
            "✅ 用 <strong>Error ADT + Either / EitherT</strong>",
            "失败有明确语义，调用方（如 Controller）据此映射不同 HTTP 状态码；短路语义即可。",
            "sealed trait UserError; case class EmailAlreadyExists(email: String) extends UserError"
          );
        }
      });
    });
    function showResult(title, desc, code) {
      result.innerHTML =
        '<div class="dt-card"><h5>' +
        title +
        "</h5><p>" +
        desc +
        '</p><div class="code-block"><pre><code>' +
        esc(code) +
        '</code></pre></div><button class="dt-reset" id="dt-reset">↺ 重新选择</button></div>';
      result.scrollIntoView({ behavior: "smooth", block: "nearest" });
      var reset = document.getElementById("dt-reset");
      if (reset)
        reset.addEventListener("click", function () {
          q2.style.display = "none";
          result.innerHTML = "";
        });
    }
  }

  function renderRefs(refs) {
    if (!refs || !refs.length) return "";
    return (
      '<div class="refs">' +
      refs
        .map(function (r) {
          return '<span class="ref-chip">参考：' + esc(r) + "</span>";
        })
        .join("") +
      "</div>"
    );
  }

  function renderSection(cat, sec) {
    var html = "";
    html +=
      '<div class="page-head"><h1>' +
      esc(cat.title) +
      " › " +
      esc(sec.title) +
      "</h1></div>";
    html += '<div class="principle">' + esc(sec.principle) + "</div>";
    if (sec.why) {
      html +=
        '<details class="why"><summary>为什么（点开看原理与出处）</summary><p>' +
        esc(sec.why) +
        "</p></details>";
    }
    (sec.tables || []).forEach(function (t) {
      html += renderTable(t);
    });
    html += renderExamples(sec.examples);
    html += renderRefs(sec.refs);

    // 上一节 / 下一节
    var idx = cat.sections.indexOf(sec);
    html += '<div class="toolbar" style="margin-top:18px">';
    if (idx > 0) {
      var prev = cat.sections[idx - 1];
      html +=
        '<a class="filter-btn" href="#/' +
        esc(cat.id) +
        "/" +
        esc(prev.id) +
        '">← ' +
        esc(prev.title) +
        "</a>";
    }
    html +=
      '<a class="filter-btn" href="#/' +
      esc(cat.id) +
      '">返回 ' +
      esc(cat.title) +
      " 总览</a>";
    if (idx < cat.sections.length - 1) {
      var next = cat.sections[idx + 1];
      html +=
        '<a class="filter-btn" href="#/' +
        esc(cat.id) +
        "/" +
        esc(next.id) +
        '">' +
        esc(next.title) +
        " →</a>";
    }
    html += "</div>";
    return html;
  }

  function renderCategoryOverview(cat) {
    var html = "";
    html += '<div class="page-head"><h1>' + esc(cat.icon) + " " + esc(cat.title) + "</h1>";
    html += '<p class="muted">' + esc(cat.summary) + "</p></div>";
    html += '<div class="grid grid-2">';
    cat.sections.forEach(function (sec) {
      html +=
        '<a class="card cat-card" href="#/' +
        esc(cat.id) +
        "/" +
        esc(sec.id) +
        '"><h3>' +
        esc(sec.title) +
        "</h3><p>" +
        esc(sec.principle) +
        "</p></a>";
    });
    html += "</div>";
    return html;
  }

  /* ---------------------- 渲染：首页 ---------------------- */
  function renderHome() {
    var s = DATA.site;
    var html = "";
    html +=
      '<section class="hero"><h1>' +
      esc(s.brand) +
      "</h1><p class=\"lead\">" +
      esc(s.tagline) +
      "</p>" +
      '<p class="muted" style="max-width:680px;margin:14px auto 0">' +
      esc(s.intro) +
      "</p></section>";

    html +=
      '<p class="home-search-hint">🔎 全站搜索：使用顶部搜索框输入关键词（如「布尔命名」「REST URL」「Option」），可直达对应章节。</p>';

    html += '<h2 class="section-title">按你的角色直达</h2><div class="grid grid-2">';
    var roles = [
      { icon: "🎓", title: "我是新人", desc: "第一次来，1 小时速成命名规范与评审眼光。",
        links: [{ href: "#/onboarding", label: "新人培训路径" }, { href: "#/cheatsheet", label: "速查表" }, { href: "#/code", label: "代码命名" }] },
      { icon: "🔍", title: "我在做 Code Review", desc: "临时查一条反例规则，或让 AI 帮我把关。",
        links: [{ href: "#/cases", label: "反例案例库" }, { href: "#/toolbox", label: "AI 提示词工具箱" }, { href: "#/code", label: "命名规则" }] },
      { icon: "🛠️", title: "我在设计新接口 / 新表", desc: "需要命名 + 全链路操作的落地参考。",
        links: [{ href: "#/api", label: "API 命名" }, { href: "#/db", label: "数据库命名" }, { href: "#/design/15", label: "全链路操作设计" }] },
      { icon: "🏛️", title: "我在做技术方案 / 架构评审", desc: "关注解耦、正交与设计原则。",
        links: [{ href: "#/design/16", label: "解耦与正交" }, { href: "#/design/17", label: "cats-effect 规范" }, { href: "#/multi-lang", label: "多语言范例" }] },
    ];
    roles.forEach(function (r) {
      html +=
        '<div class="card role-card"><div class="cat-icon">' + esc(r.icon) + "</div><h3>" +
        esc(r.title) + "</h3><p>" + esc(r.desc) + '</p><div class="role-links">';
      r.links.forEach(function (l) {
        html += '<a class="chip" href="' + l.href + '">' + esc(l.label) + "</a>";
      });
      html += "</div></div>";
    });
    html += "</div>";

    html += '<h2 class="section-title">最近更新</h2><div class="recent">';
    var recent = [
      { href: "#/design/15", title: "十五、全链路操作设计参考", note: "Create / 检索过滤 / 修改 / 删除 / 关联查询的命名落点" },
      { href: "#/design/16", title: "十六、解耦与正交设计原则", note: "分层单向依赖 / 正交性 / 端口适配器 / 轻量 CQRS" },
      { href: "#/design/17", title: "十七、cats-effect 生态规范", note: "Option vs Error ADT（含交互决策树）/ Tagless Final / 资源管理" },
      { href: "#/multi-lang", title: "多语言分层服务命名范例", note: "Java / Scala / Python 同名原则不同表达" },
    ];
    recent.forEach(function (rc) {
      html +=
        '<a class="recent-item" href="' + rc.href + '"><strong>' + esc(rc.title) +
        "</strong><span>" + esc(rc.note) + "</span></a>";
    });
    html += "</div>";

    html += '<h2 class="section-title">六大导航组</h2><div class="grid grid-3">';
    var groups = [
      { icon: "🚀", title: "快速开始", desc: "新人培训路径 + 一页速查表，1 小时上手。", href: "#/onboarding", chips: ["新人培训", "速查表"] },
      { icon: "📛", title: "命名规范", desc: "代码 / API / 数据库，共 23 节正反例对比。", href: "#/code", chips: ["代码", "API", "数据库"] },
      { icon: "🏗️", title: "架构与设计原则", desc: "全链路操作 / 解耦正交 / cats-effect 规范。", href: "#/design/15", chips: ["全链路", "解耦正交", "cats-effect"] },
      { icon: "🌐", title: "多语言范例", desc: "Java / Scala / Python 同名原则不同表达。", href: "#/multi-lang", chips: ["Java/Scala/Python"] },
      { icon: "🧰", title: "案例与工具", desc: "聚合案例库 + AI 提示词工具箱。", href: "#/cases", chips: ["案例库", "AI 工具箱"] },
      { icon: "📚", title: "参考资料", desc: "书籍章节映射 + 业界一手规范外链。", href: "#/references", chips: ["参考链接"] },
    ];
    groups.forEach(function (g) {
      html +=
        '<a class="card cat-card" href="' + g.href + '"><div class="cat-icon">' + esc(g.icon) +
        "</div><h3>" + esc(g.title) + "</h3><p>" + esc(g.desc) + '</p><div class="role-links">';
      g.chips.forEach(function (c) {
        html += '<span class="chip">' + esc(c) + "</span>";
      });
      html += "</div></a>";
    });
    html += "</div>";
    return html;
  }

  /* ---------------------- 渲染：案例库 ---------------------- */
  function renderCasesTable() {
    var cases = collectCases().filter(function (c) {
      if (state.casesCat !== "all" && c.catId !== state.casesCat) return false;
      if (state.casesQuery) {
        var q = state.casesQuery.toLowerCase();
        var hay = (c.secTitle + " " + c.bad + " " + c.good + " " + c.note + " " + c.group).toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });
    if (!cases.length) {
      return '<div class="sr-empty">没有匹配的案例，试试调整筛选。</div>';
    }
    var catLabel = { code: "代码", api: "API", db: "数据库" };
    var html = '<div class="table-scroll"><table class="cmp"><thead><tr>' +
      "<th>类别</th><th>章节</th><th>❌ 反例</th><th>✅ 正例</th><th>说明</th>" +
      "</tr></thead><tbody>";
    cases.forEach(function (c) {
      html +=
        "<tr><td><span class=\"cat-tag\">" +
        esc(catLabel[c.catId] || c.catId) +
        "</span></td><td>" +
        esc(c.secTitle) +
        (c.group ? " · " + esc(c.group) : "") +
        '</td><td class="cell-bad"><code>' +
        esc(c.bad) +
        '</code></td><td class="cell-good"><span class="cell-copy"><code>' +
        esc(c.good) +
        '</code><button class="copy-btn" type="button" aria-label="复制正例">复制</button></span></td><td>' +
        esc(c.note) +
        "</td></tr>";
    });
    html += "</tbody></table></div>";
    return html;
  }

  function renderCases() {
    var html = '<div class="page-head"><h1>🧪 对比案例库</h1>' +
      '<p class="muted">汇总全站所有 ❌/✅ 对比条目，按类别筛选或关键字搜索。</p></div>';
    html += '<div class="toolbar">';
    var cats = [
      { key: "all", label: "全部" },
      { key: "code", label: "代码" },
      { key: "api", label: "API" },
      { key: "db", label: "数据库" },
    ];
    cats.forEach(function (c) {
      html +=
        '<button class="filter-btn' +
        (state.casesCat === c.key ? " active" : "") +
        '" data-cat="' +
        esc(c.key) +
        '">' +
        esc(c.label) +
        "</button>";
    });
    html +=
      '<input id="cases-search" type="search" placeholder="搜索反例/正例/说明…" value="' +
      escAttr(state.casesQuery) +
      '" /></div>';
    html += '<div id="cases-table">' + renderCasesTable() + "</div>";
    app.innerHTML = html;

    // 绑定筛选
    var filterBtns = app.querySelectorAll(".filter-btn[data-cat]");
    filterBtns.forEach(function (b) {
      b.addEventListener("click", function () {
        state.casesCat = b.getAttribute("data-cat");
        filterBtns.forEach(function (x) {
          x.classList.remove("active");
        });
        b.classList.add("active");
        document.getElementById("cases-table").innerHTML = renderCasesTable();
      });
    });
    var cs = document.getElementById("cases-search");
    cs.addEventListener("input", function () {
      state.casesQuery = cs.value;
      document.getElementById("cases-table").innerHTML = renderCasesTable();
    });
  }

  /* ---------------------- 渲染：速查表 ---------------------- */
  function renderCheatSheet() {
    var html = '<div class="page-head"><h1>📄 速查表（Cheat Sheet）</h1>' +
      '<p class="muted">一页纸核心规则，适合打印或另存为 PDF 贴在工位 / 团队 Wiki。</p></div>';
    html += '<button class="print-btn" type="button">🖨 打印 / 另存 PDF</button>';
    DATA.cheatSheet.forEach(function (g) {
      html += '<div class="cheat-group"><h3>' + esc(g.icon) + " " + esc(g.group) + "</h3><ul>";
      g.items.forEach(function (it) {
        html += "<li>" + esc(it) + "</li>";
      });
      html += "</ul></div>";
    });
    return html;
  }

  /* ---------------------- 渲染：参考资料 ---------------------- */
  function renderReferences() {
    var html = '<div class="page-head"><h1>📚 参考资料</h1>' +
      '<p class="muted">本站规范的两条思想来源与业界一手规范外链；内容以官方最新版本为准，请勿逐字依赖。</p></div>';

    if (DATA.books) {
      html += '<h2 class="section-title">📖 书籍推荐与章节映射</h2><div class="grid grid-2">';
      DATA.books.forEach(function (b) {
        html += '<div class="card"><h3>' + esc(b.title) + "</h3><ul>";
        b.chapters.forEach(function (c) { html += "<li>" + esc(c) + "</li>"; });
        html += "</ul></div>";
      });
      html += "</div>";
    }

    DATA.references.forEach(function (group) {
      html += '<h2 class="section-title">' + esc(group.group) + "</h2>";
      html += '<div class="grid grid-2">';
      group.items.forEach(function (item) {
        html +=
          '<div class="card ref-card"><h3>' +
          esc(item.name) +
          "</h3><p>" +
          esc(item.desc) +
          '</p><p class="ref-scene">核心适用场景：' +
          esc(item.scene) +
          '</p><a class="ref-link" href="' +
          escAttr(item.url) +
          '" target="_blank" rel="noopener noreferrer">' +
          esc(item.url) +
          "</a></div>";
      });
      html += "</div>";
    });
    html +=
      '<div class="disclaimer">免责声明：以下链接内容以官方最新版本为准，本站仅做归纳提炼，不代表逐字复述；外链可能随官方更新而变化，建议定期核对。</div>';
    return html;
  }

  /* ---------------------- 渲染：AI 工具箱 ---------------------- */
  function renderPromptCard(p) {
    function renderPreview(values) {
      var out = p.template;
      Object.keys(p.fields).forEach(function (token) {
        var v = values[token] || "";
        out = out.split(token).join(v || token);
      });
      return out;
    }
    var fieldsHtml = Object.keys(p.fields)
      .map(function (token) {
        var f = p.fields[token];
        var label = f.label || token;
        if (f.type === "select") {
          var opts = f.options
            .map(function (o) {
              return "<option>" + esc(o) + "</option>";
            })
            .join("");
          return (
            "<label>" +
            esc(label) +
            '<select data-token="' +
            escAttr(token) +
            '">' +
            opts +
            "</select></label>"
          );
        }
        return (
          "<label>" +
          esc(label) +
          '<input type="text" data-token="' +
          escAttr(token) +
          '" placeholder="' +
          escAttr(token) +
          '" /></label>'
        );
      })
      .join("");

    var html =
      '<div class="card prompt-card"><h3>' +
      esc(p.title) +
      '</h3><div class="prompt-meta">' +
      esc(p.meta) +
      '</div><div class="prompt-fields">' +
      fieldsHtml +
      '</div><div class="prompt-preview">' +
      esc(renderPreview({})) +
      '</div><div class="prompt-actions"><button class="copy-btn" type="button">复制团队专属版</button></div></div>';

    // 绑定字段实时更新预览
    setTimeout(function () {
      var card = app.querySelector('.prompt-card');
      // 精确绑定当前卡片：通过标题匹配
      var cards = app.querySelectorAll(".prompt-card");
      for (var i = 0; i < cards.length; i++) {
        if (cards[i].querySelector("h3").textContent === p.title) {
          bindPromptCard(cards[i], p, renderPreview);
          break;
        }
      }
    }, 0);
    return html;
  }

  function bindPromptCard(card, p, renderPreview) {
    var fieldsWrap = card.querySelector(".prompt-fields");
    var preview = card.querySelector(".prompt-preview");
    function update() {
      var values = {};
      var inputs = fieldsWrap.querySelectorAll("[data-token]");
      inputs.forEach(function (inp) {
        values[inp.getAttribute("data-token")] = inp.value;
      });
      preview.textContent = renderPreview(values);
    }
    fieldsWrap.addEventListener("input", update);
    fieldsWrap.addEventListener("change", update);
  }

  function renderToolbox() {
    var html = '<div class="page-head"><h1>🤖 AI 提示词工具箱</h1>' +
      '<p class="muted">把本站规范转译成可直接喂给 AI 的提示词与规则文件。把占位符替换成团队选择，生成「团队专属版」后一键复制。</p></div>';
    html +=
      '<div class="disclaimer">提示：规则文件只是让 AI 更快对齐团队标准，最终仍需要人工复核——AI 给出的命名建议不是绝对正确答案。</div>';

    html += '<h2 class="section-title">13.1 用 AI 起名 / 找名字</h2>';
    DATA.prompts.naming.forEach(function (p) {
      html += renderPromptCard(p);
    });
    html += '<h2 class="section-title">13.2 喂给 Cursor / Codex / Claude Code 的规则文件</h2>';
    DATA.prompts.ruleFiles.forEach(function (p) {
      html += renderPromptCard(p);
    });
    html += '<h2 class="section-title">13.3 一次性 Code Review 提示词</h2>';
    DATA.prompts.review.forEach(function (p) {
      html += renderPromptCard(p);
    });
    return html;
  }

  /* ---------------------- 渲染：Onboarding ---------------------- */
  function renderOnboarding() {
    var ob = DATA.onboarding;
    var html = '<div class="page-head"><h1>🎓 新人培训路径</h1>' +
      '<p class="muted">面向新工程师的「1 小时速成」阅读顺序 + 交互自测。Tech Lead 可直接把本页甩给新人。</p></div>';
    html += '<ol class="onb-steps">';
    ob.steps.forEach(function (st) {
      var current = st.n === 5 ? " current" : "";
      html +=
        '<li class="onb-step' +
        current +
        '"><div class="onb-num">' +
        st.n +
        '</div><div class="onb-body"><h3>' +
        esc(st.title) +
        '</h3><div class="onb-time">' +
        esc(st.form) +
        " · 预计 " +
        esc(st.time) +
        '</div><p style="margin:6px 0 0">' +
        esc(st.content) +
        "</p></div></li>";
    });
    html += "</ol>";

    // 自测题
    html += '<h2 class="section-title">第 5 步 · 自测题（写出正例）</h2>';
    ob.quiz.forEach(function (q) {
      html +=
        '<div class="quiz" data-qid="' +
        escAttr(q.id) +
        '"><h4>' +
        esc(q.question) +
        '</h4><div class="quiz-code"><code>' +
        esc(q.prompt) +
        '</code></div><textarea placeholder="在这里写出你的正例命名…"></textarea>' +
        '<div class="quiz-actions"><button class="copy-btn quiz-submit" type="button" data-qid="' +
        escAttr(q.id) +
        '">提交并查看参考答案</button></div>' +
        '<div class="quiz-answer"><strong>参考答案：</strong><code>' +
        esc(q.answer) +
        '</code><div class="qa-ref">依据章节：' +
        esc(q.basis) +
        "</div></div></div>";
    });
    return html;
  }

  /* ---------------------- 路由 ---------------------- */
  function router() {
    searchResults.hidden = true;
    var hash = location.hash.replace(/^#\/?/, "");
    var parts = hash.split("/").filter(Boolean);
    var page = parts[0];
    var sub = parts[1];
    var html = "";

    if (!page || page === "home") {
      html = renderHome();
    } else if (page === "code" || page === "api" || page === "db") {
      if (sub) {
        var sec = getSection(page, sub);
        if (sec) {
          html = renderSection(getCategory(page), sec);
        } else {
          html = notFound("未找到章节：" + esc(page + "/" + sub));
        }
      } else {
        html = renderCategoryOverview(getCategory(page));
      }
    } else if (page === "cases") {
      app.innerHTML = ""; // 由 renderCases 自行填充并绑定
      renderCases();
      afterRender();
      closeSidebar();
      return;
    } else if (page === "cheatsheet") {
      html = renderCheatSheet();
    } else if (page === "references") {
      html = renderReferences();
    } else if (page === "toolbox") {
      html = renderToolbox();
    } else if (page === "onboarding") {
      html = renderOnboarding();
    } else if (page === "multi-lang") {
      renderMultiLang();
      return;
    } else if (page === "design") {
      renderDesign(sub);
      return;
    } else {
      html = notFound("未找到页面：" + esc(page));
    }

    app.innerHTML = html;
    afterRender();
    closeSidebar();
  }

  function notFound(msg) {
    return (
      '<div class="page-head"><h1>页面不存在</h1><p class="muted">' +
      msg +
      '</p><p><a href="#/home">← 返回首页</a></p></div>'
    );
  }

  function afterRender() {
    // 高亮搜索词
    if (state.pendingHighlight) {
      highlightInElement(app, state.pendingHighlight);
      state.pendingHighlight = "";
    }
    // 回到顶部
    window.scrollTo({ top: 0, behavior: "auto" });
    updateActiveNav();
  }

  function highlightInElement(root, term) {
    if (!term) return;
    var re = new RegExp("(" + escapeRegExp(term) + ")", "gi");
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        var p = node.parentElement;
        if (!p) return NodeFilter.FILTER_REJECT;
        if (p.closest("pre, .code-block, .prompt-preview, script, style"))
          return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    var targets = [];
    var n;
    while ((n = walker.nextNode())) targets.push(n);
    targets.forEach(function (node) {
      if (node.nodeValue.toLowerCase().indexOf(term.toLowerCase()) !== -1) {
        var span = document.createElement("span");
        span.innerHTML = node.nodeValue.replace(
          new RegExp("(" + escapeRegExp(term) + ")", "gi"),
          "<mark>$1</mark>"
        );
        node.parentNode.replaceChild(span, node);
      }
    });
  }

  /* ---------------------- 侧边导航 ---------------------- */
  function buildNav() {
    var html = "";
    // 按第十八章 IA：6 组（快速开始 / 命名规范 / 架构与设计原则 / 多语言范例 / 案例与工具 / 参考资料）
    var groups = [
      {
        title: "🚀 快速开始",
        links: [
          { href: "#/home", label: "首页" },
          { href: "#/onboarding", label: "新人培训路径" },
          { href: "#/cheatsheet", label: "速查表" },
        ],
      },
      { title: "📛 命名规范", cats: DATA.categories },
      {
        title: "🏗️ 架构与设计原则",
        links: [
          { href: "#/design/15", label: "十五、全链路操作设计" },
          { href: "#/design/16", label: "十六、解耦与正交设计" },
          { href: "#/design/17", label: "十七、cats-effect 规范" },
        ],
      },
      {
        title: "🌐 多语言范例",
        links: [{ href: "#/multi-lang", label: "多语言分层范例" }],
      },
      {
        title: "🧰 案例与工具",
        links: [
          { href: "#/cases", label: "对比案例库" },
          { href: "#/toolbox", label: "AI 提示词工具箱" },
        ],
      },
      {
        title: "📚 参考资料",
        links: [{ href: "#/references", label: "参考资料" }],
      },
    ];
    groups.forEach(function (g) {
      html += '<div class="nav-group"><div class="nav-title">' + esc(g.title) + "</div>";
      if (g.links) {
        g.links.forEach(function (l) {
          html += navLink(l.href, l.label);
        });
      }
      if (g.cats) {
        g.cats.forEach(function (cat) {
          html += '<a class="nav-link nav-cat" href="#/' + esc(cat.id) + '">' +
            esc(cat.icon) + " " + esc(cat.title) + "</a>";
          html += '<div class="nav-sub">';
          cat.sections.forEach(function (sec, i) {
            html += navLink(
              "#/" + esc(cat.id) + "/" + esc(sec.id),
              sec.title,
              String(i + 1)
            );
          });
          html += "</div>";
        });
      }
      html += "</div>";
    });
    nav.innerHTML = html;
  }

  /* ---------------------- 顶部 banner：仅 6 个导航组（对齐计划第三章 IA 顶层大纲） ---------------------- */
  function buildOutline() {
    var box = document.getElementById("outline-inner");
    if (!box) return;
    // 只保留顶层 6 组，不再把叶子章节（全链路/解耦/cats-effect 等）重复列在 banner，
    // 避免与左侧目录树口径冲突；每组链到该组主入口。
    var groups = [
      { title: "快速开始", match: "#/home #/onboarding #/cheatsheet", href: "#/onboarding" },
      { title: "命名规范", match: "#/code #/api #/db", href: "#/code" },
      { title: "架构与设计原则", match: "#/design", href: "#/design/15" },
      { title: "多语言范例", match: "#/multi-lang", href: "#/multi-lang" },
      { title: "案例与工具", match: "#/cases #/toolbox", href: "#/cases" },
      { title: "参考资料", match: "#/references", href: "#/references" },
    ];
    var html = "";
    groups.forEach(function (g) {
      html += '<a class="outline-link" href="' + g.href + '" data-match="' +
        escAttr(g.match) + '">' + esc(g.title) + "</a>";
    });
    box.innerHTML = html;
  }
  function updateOutlineActive() {
    var current = location.hash || "#/home";
    if (current === "") current = "#/home";
    var links = document.querySelectorAll(".outline-link");
    links.forEach(function (a) {
      var match = (a.getAttribute("data-match") || "").split(" ");
      var active = match.some(function (p) {
        return current === p || current.indexOf(p + "/") === 0;
      });
      a.classList.toggle("active", active);
    });
  }

  function navLink(href, label, num) {
    return (
      '<a class="nav-link" href="' +
      href +
      '">' +
      (num ? '<span class="nav-num">' + esc(num) + "</span>" : "") +
      "<span>" +
      esc(label) +
      "</span></a>"
    );
  }

  function updateActiveNav() {
    var current = location.hash || "#/home";
    if (current === "" ) current = "#/home";
    var links = nav.querySelectorAll(".nav-link");
    links.forEach(function (a) {
      var href = a.getAttribute("href");
      var active = href === current || current.indexOf(href + "/") === 0;
      a.classList.toggle("active", active);
    });
    updateOutlineActive();
  }

  /* ---------------------- 深色模式 ---------------------- */
  function applyTheme() {
    var saved = null;
    try {
      saved = localStorage.getItem("ng-theme");
    } catch (e) {}
    var theme = saved;
    if (!theme) {
      theme = window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    document.documentElement.setAttribute("data-theme", theme);
  }
  function toggleTheme() {
    var cur = document.documentElement.getAttribute("data-theme");
    var next = cur === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("ng-theme", next);
    } catch (e) {}
  }

  /* ---------------------- 响应式菜单 ---------------------- */
  function openSidebar() {
    sidebar.classList.add("open");
    sidebarOverlay.hidden = false;
    sidebarOverlay.classList.add("show");
    hamburger.setAttribute("aria-expanded", "true");
  }
  function closeSidebar() {
    sidebar.classList.remove("open");
    sidebarOverlay.hidden = true;
    sidebarOverlay.classList.remove("show");
    hamburger.setAttribute("aria-expanded", "false");
  }

  /* ---------------------- 事件绑定 ---------------------- */
  function bindTopbar() {
    searchInput.addEventListener("input", function () {
      state.searchTerm = searchInput.value;
      runSearch(searchInput.value);
    });
    searchInput.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        searchResults.hidden = true;
        searchInput.blur();
      }
    });
    searchResults.addEventListener("click", function (e) {
      var a = e.target.closest("a");
      if (a) {
        state.pendingHighlight = searchInput.value;
        searchResults.hidden = true;
      }
    });
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".search-wrap")) {
        searchResults.hidden = true;
      }
    });
    themeToggle.addEventListener("click", toggleTheme);
    hamburger.addEventListener("click", function () {
      if (sidebar.classList.contains("open")) closeSidebar();
      else openSidebar();
    });
    sidebarOverlay.addEventListener("click", closeSidebar);
  }

  function bindDelegated() {
    document.addEventListener("click", function (e) {
      // 复制按钮（表格正例 / 提示词预览）
      var copyBtn = e.target.closest(".copy-btn");
      if (copyBtn && !copyBtn.classList.contains("quiz-submit")) {
        var text = "";
        var cell = copyBtn.closest(".cell-copy");
        if (cell) {
          text = cell.querySelector("code").textContent;
        } else {
          var card = copyBtn.closest(".prompt-card");
          if (card) text = card.querySelector(".prompt-preview").textContent;
        }
        if (text) copyText(text);
        return;
      }
      // 自测题提交
      var qbtn = e.target.closest(".quiz-submit");
      if (qbtn) {
        var quiz = qbtn.closest(".quiz");
        if (quiz) {
          quiz.querySelector(".quiz-answer").classList.add("show");
          qbtn.disabled = true;
          qbtn.textContent = "已提交";
        }
        return;
      }
      // 打印
      if (e.target.closest(".print-btn")) {
        window.print();
        return;
      }
    });
  }

  /* ---------------------- 初始化 ---------------------- */
  function init() {
    if (!DATA) {
      app.innerHTML = '<div class="page-head"><h1>数据加载失败</h1><p>未能读取 assets/js/data.js，请确认文件存在。</p></div>';
      return;
    }
    buildNav();
    buildOutline();
    bindTopbar();
    bindDelegated();
    window.addEventListener("hashchange", router);
    applyTheme();
    router();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
