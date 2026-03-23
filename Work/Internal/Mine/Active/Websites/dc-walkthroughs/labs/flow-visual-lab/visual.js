(function () {
  function byId(id) { return document.getElementById(id); }
  var ICONS = { Start:"ST", Vendor:"VN", Contact:"POC", Template:"TPL", Send:"OUT", Decision:"?", Meet:"MT", Email:"EM", Inbox:"IN", System:"SYS", Gate:"CHK", Validate:"VAL", Schedule:"SCH", Done:"OK", Method:"3X", Cash:"$", Map:"MAP", TIK:"TIK", P2:"P2", Workflow:"WF", Check:"QC", Query:"Q", Apply:"AP" };
  function toneClass(tone) { return "tone-" + tone; }
  function escapeHtml(text) { return String(text).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
  function connector(color) { return '<div class="connector ' + toneClass(color) + '"></div>'; }
  function nodeMarkup(node, sectionLabel) {
    var chips = node.chips ? '<div class="node-chips">' + node.chips.map(function (chip) { return '<span class="mini">' + chip + '</span>'; }).join("") + '</div>' : "";
    return '<article class="node ' + toneClass(node.tone) + '" data-title="' + escapeHtml(node.title) + '" data-step="' + escapeHtml(node.step) + '" data-section="' + escapeHtml(sectionLabel) + '" data-body="' + escapeHtml(node.body) + '">' +
      '<div class="node-icon">' + (ICONS[node.icon] || node.icon || ".") + '</div><div class="node-step">' + node.step + '</div><div class="node-title">' + node.title + '</div><div class="node-body">' + node.body + '</div>' + chips + '</article>';
  }
  function noteMarkup(note, sectionLabel) {
    return '<aside class="note ' + toneClass(note.tone) + '" data-title="' + escapeHtml(note.title) + '" data-step="Hint" data-section="' + escapeHtml(sectionLabel) + '" data-body="' + escapeHtml(note.body) + '"><div class="note-title">' + note.title + '</div><div class="note-body">' + note.body + '</div></aside>';
  }
  function branchMarkup(group, sectionLabel) {
    return '<div class="branch-grid">' + group.branches.map(function (branch) {
      var lane = branch.nodes.map(function (node, index) {
        var out = node.kind === "note" ? noteMarkup(node, sectionLabel) : nodeMarkup(node, sectionLabel);
        if (index < branch.nodes.length - 1) out += connector(branch.tone);
        return out;
      }).join("");
      return '<div class="branch ' + toneClass(branch.tone) + '"><div class="branch-label">' + branch.label + '</div><div class="lane">' + lane + '</div></div>';
    }).join("") + '</div>';
  }
  function sectionMarkup(section, index) {
    var items = section.items.map(function (item, itemIndex) {
      if (item.kind === "branch-group") return branchMarkup(item, section.label);
      if (item.kind === "note") return noteMarkup(item, section.label);
      var out = nodeMarkup(item, section.label);
      if (itemIndex < section.items.length - 1) out += connector(section.color);
      return out;
    }).join("");
    return '<section class="phase"><div class="phase-band"><div class="phase-bullet ' + toneClass(section.color) + '">' + (index + 1) + '</div><div class="phase-label">' + section.label + '</div><div class="phase-rule"></div></div><div class="lane">' + items + '</div></section>';
  }
  function countNodes(flow) {
    var count = 0;
    flow.sections.forEach(function (section) {
      section.items.forEach(function (item) {
        if (item.kind === "branch-group") item.branches.forEach(function (branch) { count += branch.nodes.length; });
        else count += 1;
      });
    });
    return count;
  }
  function applyFocus(focus) {
    var nodes = Array.prototype.slice.call(document.querySelectorAll(".node, .note, .branch"));
    nodes.forEach(function (el) { el.style.opacity = "1"; });
    if (focus === "all") return;
    nodes.forEach(function (el) {
      var keep = false;
      if (focus === "decision" && el.classList.contains("node") && /Decision|result|applies\?/i.test(el.getAttribute("data-title") || "")) keep = true;
      if (focus === "notes" && el.classList.contains("note")) keep = true;
      if (focus === "branches" && el.classList.contains("branch")) keep = true;
      el.style.opacity = keep ? "1" : ".28";
    });
  }
  function wireUp(config) {
    Array.prototype.slice.call(document.querySelectorAll(".node, .note")).forEach(function (el) {
      el.addEventListener("click", function () {
        Array.prototype.slice.call(document.querySelectorAll(".node.active")).forEach(function (node) { node.classList.remove("active"); });
        if (el.classList.contains("node")) el.classList.add("active");
        byId("inspector-body").innerHTML = '<div class="smalltag">' + el.getAttribute("data-step") + '</div><h3 style="margin:12px 0 8px;font-size:20px;">' + el.getAttribute("data-title") + '</h3><div class="sub"><strong>Section:</strong> ' + el.getAttribute("data-section") + '</div><div class="sub" style="margin-top:10px;">' + el.getAttribute("data-body") + '</div>';
      });
    });
    Array.prototype.slice.call(document.querySelectorAll(".flowpick")).forEach(function (btn) {
      btn.addEventListener("click", function () {
        renderPage(Object.assign({}, config, { defaultFlow: btn.getAttribute("data-flow") }));
      });
    });
    Array.prototype.slice.call(document.querySelectorAll(".filterbtn")).forEach(function (btn) {
      btn.addEventListener("click", function () {
        Array.prototype.slice.call(document.querySelectorAll(".filterbtn")).forEach(function (node) { node.classList.remove("active"); });
        btn.classList.add("active");
        applyFocus(btn.getAttribute("data-focus"));
      });
    });
  }
  function renderPage(config) {
    var data = window.DC_FLOW_VISUALS;
    var flow = data.flows.find(function (f) { return f.slug === config.defaultFlow; }) || data.flows[0];
    document.body.className = "theme-" + config.slug;
    byId("app").innerHTML = '<div class="shell"><div class="topbar"><div><strong>DC Flow Visual Lab</strong><div class="sub">Same workflow logic, different flow-chart language.</div></div><div style="display:flex;flex-wrap:wrap;gap:10px;"><a class="navlink" href="./index.html">Visual Hub</a>' + data.variants.map(function (variant) { return '<a class="navlink' + (variant.slug === config.slug ? ' active' : '') + '" href="./' + variant.slug + '.html">' + variant.name + '</a>'; }).join("") + '</div></div>' +
      '<section class="hero"><div><div class="eyebrow">' + config.family + ' Flow System</div><h1 class="title">' + config.name + '<em>.</em></h1><p class="sub">' + config.note + ' This lab focuses on arrows, icons, hints, branch blocks, section bands, quick-reference chips, and click-to-focus static flow behavior.</p><div class="meta"><span class="chip">' + config.mode + ' leaning</span><span class="chip">Static flow focus</span><span class="chip">Clickable nodes</span></div></div><div class="hero-side"><div class="hero-box"><strong>Visual Goal</strong><div class="sub">' + config.goal + '</div></div><div class="hero-box"><strong>Best Test Flow</strong><div class="sub">' + flow.title + '</div></div><div class="hero-box"><strong>Component Targets</strong><div class="sub">Nodes, connectors, branch labels, hint notes, icons, and quick-reference cues.</div></div></div></section>' +
      '<section class="layout"><aside class="sidebar"><h2>Flows</h2><div class="stack">' + data.flows.map(function (item) { return '<button class="flowpick' + (item.slug === flow.slug ? ' active' : '') + '" data-flow="' + item.slug + '">' + item.title + '</button>'; }).join("") + '</div><h2 style="margin-top:18px;">Focus</h2><div class="stack"><button class="filterbtn active" data-focus="all">All Elements</button><button class="filterbtn" data-focus="decision">Decision Nodes</button><button class="filterbtn" data-focus="notes">Hints & Notes</button><button class="filterbtn" data-focus="branches">Branch Blocks</button></div></aside>' +
      '<main class="canvas"><div class="canvas-head"><div><h2 class="canvas-title">' + flow.title + '</h2><p class="canvas-sub">' + flow.subtitle + ' ' + flow.summary + '</p></div><div class="meta"><span class="smalltag">' + flow.sections.length + ' phases</span><span class="smalltag">' + countNodes(flow) + ' visual stops</span></div></div><div id="flow-canvas">' + flow.sections.map(sectionMarkup).join("") + '</div></main>' +
      '<aside class="inspector"><h2>Inspector</h2><div id="inspector-body" class="sub">Click any node, note, or branch-card content to inspect how the visuals hold up for titles, hints, and quick-reference text.</div></aside></section></div>';
    wireUp(config);
  }
  function renderHub() {
    var data = window.DC_FLOW_VISUALS;
    byId("app").innerHTML = '<div class="shell"><div class="topbar"><div><strong>DC Flow Visual Lab</strong><div class="sub">A tighter lab focused on static-flow visuals instead of whole-page shells.</div></div><a class="navlink" href="../index.html">Original walkthroughs</a></div>' +
      '<section class="hero"><div><div class="eyebrow">Flow Diagram Sprint</div><h1 class="title">10 visual systems for nodes, arrows, hints, and branch layouts<em>.</em></h1><p class="sub">This pass is about the flow language itself: connector style, decision blocks, path labels, quick-reference notes, icons, and click-to-inspect behavior.</p><div class="meta"><span class="chip">Static flow focus</span><span class="chip">Branching stress-tested</span><span class="chip">Clickable prototypes</span></div></div><div class="hero-side"><div class="hero-box"><strong>Primary Test Cases</strong><div class="sub">Payroll for gate + merge behavior, Balance Import for multi-lane branching.</div></div><div class="hero-box"><strong>Why this pass</strong><div class="sub">You wanted the diagram treatment, not a whole homepage rethink.</div></div></div></section>' +
      '<section class="hub-section"><h2>Concepts</h2><div class="hub-grid">' + data.variants.map(function (variant) { return '<article class="hub-card"><div class="smalltag">' + variant.family + '</div><div class="hub-title">' + variant.name + '</div><p class="sub">' + variant.mode + ' leaning. Focused on static flow visuals and clickable inspection.</p><div class="meta"><a class="navlink" href="./' + variant.slug + '.html">Open concept</a></div></article>'; }).join("") + '</div></section></div>';
  }
  window.renderFlowVisualPage = renderPage;
  window.renderFlowVisualHub = renderHub;
}());
