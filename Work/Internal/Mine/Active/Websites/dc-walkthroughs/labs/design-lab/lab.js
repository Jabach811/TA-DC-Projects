(function () {
  function byId(id) { return document.getElementById(id); }

  function renderVariantNav(currentSlug, variants) {
    return variants.map(function (variant) {
      var href = "./" + variant.slug + ".html";
      var cls = variant.slug === currentSlug ? "lab-pill active" : "lab-pill";
      return '<a class="' + cls + '" href="' + href + '">' + variant.id + " " + variant.name + "</a>";
    }).join("");
  }

  function renderFlowTabs(flows, activeSlug) {
    return flows.map(function (flow, index) {
      var cls = flow.slug === activeSlug ? "flow-tab active" : "flow-tab";
      return '<button class="' + cls + '" data-flow="' + flow.slug + '"><span>' + String(index + 1).padStart(2, "0") + " " + flow.tag + '</span><small>' + flow.stat + "</small></button>";
    }).join("");
  }

  function renderMetaChips(flow) {
    return [flow.tag, flow.stat, flow.branch, flow.phases.length + " phases"].map(function (item) {
      return '<span class="meta-chip">' + item + "</span>";
    }).join("");
  }

  function renderInteractive(flow) {
    var stepCount = 0;
    var phases = flow.phases.map(function (phase, phaseIndex) {
      var steps = phase.steps.map(function (step, stepIndex) {
        stepCount += 1;
        return '<div class="step-card' + (stepCount === 1 ? " active" : "") + '" data-step="' + stepCount + '">' +
          '<div class="step-top"><span class="step-index">STEP ' + String(stepCount).padStart(2, "0") + '</span><span class="meta-chip">' + (phaseIndex + 1) + "." + (stepIndex + 1) + "</span></div>" +
          '<div class="step-title">' + step + '</div>' +
          '<div class="step-note">Interactive prototypes in this lab keep the real flow logic visible while elevating the shell, branching clarity, and progress feel.</div>' +
        "</div>";
      }).join("");
      return '<section class="phase-card"><div class="phase-header"><div class="phase-name">' + phase.name + '</div><span class="meta-chip">' + phase.steps.length + ' steps</span></div><div class="phase-steps">' + steps + "</div></section>";
    }).join("");

    return '<div class="interactive-shell">' +
      '<div class="interactive-panel"><h3>Interaction Controls</h3><p>Use the choice chips to fake branch emphasis and progression while reviewing the visual direction.</p><div class="control-row"><button class="choice-chip active" data-mode="active">Active Step</button><button class="choice-chip" data-mode="complete">Complete State</button><button class="choice-chip" data-mode="branch">Branch Emphasis</button></div></div>' +
      '<div class="detail-card"><div class="detail-head"><div><h2 class="detail-title">' + flow.title + '</h2><p class="detail-subtitle">' + flow.summary + '</p></div><div class="hero-meta">' + renderMetaChips(flow) + '</div></div><div class="phase-track">' + phases + "</div></div>" +
    "</div>";
  }

  function renderStatic(flow) {
    var count = 0;
    var bands = flow.phases.map(function (phase) {
      count += 1;
      var items = phase.steps.map(function (step) { return "<li>" + step + "</li>"; }).join("");
      return '<div class="chapter-band"><div class="chapter-num">' + String(count).padStart(2, "0") + '</div><div class="chapter-copy"><h3>' + phase.name + "</h3><p>" + flow.summary + "</p><ul>" + items + "</ul></div></div>";
    }).join("");

    return '<div class="static-canvas"><div class="detail-head"><div><h2 class="detail-title">' + flow.title + '</h2><p class="detail-subtitle">' + flow.summary + '</p></div><div class="hero-meta">' + renderMetaChips(flow) + '</div></div><h2>Expanded Chapters</h2>' + bands + "</div>";
  }

  function applyInteractiveBehavior(root) {
    var cards = Array.prototype.slice.call(root.querySelectorAll(".step-card"));
    var chips = Array.prototype.slice.call(root.querySelectorAll(".choice-chip"));
    cards.forEach(function (card) {
      card.addEventListener("click", function () {
        cards.forEach(function (node) { node.classList.remove("active"); });
        card.classList.add("active");
      });
    });
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (node) { node.classList.remove("active"); });
        chip.classList.add("active");
        var mode = chip.getAttribute("data-mode");
        cards.forEach(function (card, index) {
          card.classList.remove("active");
          if ((mode === "active" && index === 0) || (mode === "complete" && index < 3) || (mode === "branch" && index === 3)) {
            card.classList.add("active");
          }
        });
      });
    });
  }

  function renderLabPage(config) {
    var data = window.DC_LAB;
    var app = byId("app");
    var activeFlow = data.flows.find(function (flow) { return flow.slug === config.defaultFlow; }) || data.flows[0];
    document.body.className = "theme-" + config.slug;

    app.innerHTML = '<div class="lab-shell">' +
      '<div class="lab-topbar"><div><strong>DC Walkthrough Design Lab</strong><div class="hero-body">10 parallel visual explorations built around the current 7-flow content map.</div></div><div class="lab-topbar-links"><a class="lab-pill" href="./index.html">Design Hub</a>' + renderVariantNav(config.slug, data.variants) + "</div></div>" +
      '<section class="lab-hero"><div class="hero-panel"><div class="hero-kicker">' + config.family + '</div><h1 class="hero-title">' + config.name + '<em>.</em></h1><p class="hero-body">' + config.note + ' The current walkthroughs already have strong procedural depth, so this concept focuses on shell, pace, hierarchy, and how static vs interactive states feel in-browser.</p><div class="hero-meta"><span class="meta-chip">' + config.mode + ' prototype</span><span class="meta-chip">7 flows preserved</span><span class="meta-chip">Original app untouched</span></div></div><div class="hero-stack"><div class="mini-card"><h3>Default Spotlight</h3><p>' + activeFlow.title + '</p></div><div class="mini-card"><h3>Why This Direction</h3><p>' + config.note + '</p></div><div class="mini-card"><h3>Design Intent</h3><p>Make procedure flows feel like premium product experiences instead of generic internal pages.</p></div></div></section>' +
      '<section class="layout-grid"><aside class="flow-list"><h2>Flows</h2><div class="flow-nav">' + renderFlowTabs(data.flows, activeFlow.slug) + '</div><div class="summary-card"><h3>Shared Content Map</h3><p>Every concept keeps the same family of walkthroughs while exploring different shells, pacing, and interaction patterns.</p><ul><li>Seven walkthrough families</li><li>Branching logic preserved</li><li>Static and interactive mix</li></ul></div></aside><main id="lab-canvas">' + (config.mode === "interactive" ? renderInteractive(activeFlow) : renderStatic(activeFlow)) + "</main></section>" +
    "</div>";

    Array.prototype.slice.call(app.querySelectorAll(".flow-tab")).forEach(function (tab) {
      tab.addEventListener("click", function () {
        var slug = tab.getAttribute("data-flow");
        var flow = data.flows.find(function (item) { return item.slug === slug; }) || data.flows[0];
        Array.prototype.slice.call(app.querySelectorAll(".flow-tab")).forEach(function (node) { node.classList.remove("active"); });
        tab.classList.add("active");
        byId("lab-canvas").innerHTML = config.mode === "interactive" ? renderInteractive(flow) : renderStatic(flow);
        if (config.mode === "interactive") applyInteractiveBehavior(byId("lab-canvas"));
      });
    });

    if (config.mode === "interactive") applyInteractiveBehavior(byId("lab-canvas"));
  }

  function renderHub() {
    var data = window.DC_LAB;
    var cards = data.variants.map(function (variant) {
      return '<article class="hub-card"><div class="hub-card-top"><span class="meta-chip">' + variant.id + '</span><span class="meta-chip">' + variant.mode + '</span></div><h3 class="hub-card-title">' + variant.name + '</h3><p>' + variant.family + " direction. " + variant.note + '</p><div class="hero-meta"><span class="meta-chip">7 flows</span><span class="meta-chip">fresh shell</span><span class="meta-chip">non-destructive</span></div><div class="hub-card-actions"><a class="button-link primary" href="./' + variant.slug + '.html">Open concept</a></div></article>';
    }).join("");

    var sources = data.inspirations.map(function (source) {
      return '<article class="source-card"><h3>' + source.source + '</h3><p><a href="' + source.url + '" target="_blank" rel="noreferrer">' + source.title + "</a></p><p>" + source.note + "</p></article>";
    }).join("");

    byId("app").innerHTML = '<div class="lab-shell">' +
      '<div class="hub-topbar"><div><strong>DC Walkthrough Design Lab</strong><div class="hero-body">A 10-concept redesign sprint for the walkthrough site.</div></div><div class="hub-topbar-links"><a class="hub-pill" href="../index.html">Original walkthroughs</a></div></div>' +
      '<section class="hub-hero"><div class="hero-panel"><div class="hero-kicker">Design Sprint</div><h1 class="hero-title">10 new visual systems for the walkthrough flows<em>.</em></h1><p class="hero-body">These concepts preserve the flow map from the existing single-file app while exploring stronger editorial, systems, glossy-product, warm-consulting, and immersive narrative directions.</p><div class="hero-meta"><span class="meta-chip">5 agent lanes</span><span class="meta-chip">10 prototypes</span><span class="meta-chip">7 original walkthroughs</span></div></div><div class="hero-stack"><div class="mini-card"><h3>Interactive Concepts</h3><p>02 The Review Room, 03 Control Mesh, 05 Neon Runway, 07 Workshop Wall, 09 Signal Constellation.</p></div><div class="mini-card"><h3>Static Concepts</h3><p>01 Ledger Noir, 04 Signal Ledger, 06 Aurora Product Deck, 08 Service Blueprint Ledger, 10 Casefile Drift.</p></div><div class="mini-card"><h3>Net Inspiration</h3><p>Built around current scrollytelling, timeline, onboarding, and decision-tree patterns found during research.</p></div></div></section>' +
      '<section class="hub-section"><h2>Concept Gallery</h2><div class="hub-grid">' + cards + '</div></section>' +
      '<section class="hub-section"><h2>Research Inputs</h2><div class="sources-grid">' + sources + '</div></section>' +
      '<div class="footer-note">Best next move: pick the 2-3 strongest directions, then we can merge the winning pieces into a polished replacement for the current walkthrough hub or into individual production-ready flow pages.</div>' +
    "</div>";
  }

  window.renderDCLabPage = renderLabPage;
  window.renderDCLabHub = renderHub;
}());
