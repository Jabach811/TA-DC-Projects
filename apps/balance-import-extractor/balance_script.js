
// â”€â”€ HOME PAGE ENTRANCE ANIMATIONS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
(function(){
  function animateGroup(gridId, itemClass) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    const obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const items = grid.querySelectorAll('.' + itemClass);
          items.forEach(function(item) {
            const delay = parseInt(item.getAttribute('data-delay') || '0');
            setTimeout(function() { item.classList.add(itemClass === 'ql-tile' ? 'ql-visible' : 'hs-visible'); }, delay);
          });
          obs.disconnect();
        }
      });
    }, { threshold: 0.05 });
    obs.observe(grid);
  }

  // Run on home nav or on load
  function initHomeAnim() {
    // Reset first
    document.querySelectorAll('.ql-tile').forEach(function(el) { el.classList.remove('ql-visible'); });
    document.querySelectorAll('.hs-card').forEach(function(el) { el.classList.remove('hs-visible'); });
    setTimeout(function() {
      animateGroup('ql-grid', 'ql-tile');
      animateGroup('hs-grid', 'hs-card');
    }, 80);
  }

  // Hook into nav â€” patch after nav is defined
  const _origNav = window.nav;
  window.nav = function(id) {
    _origNav(id);
    if (id === 'home') initHomeAnim();
  };

  // Fire on initial load if home is active
  if (document.getElementById('page-home') && document.getElementById('page-home').classList.contains('active')) {
    initHomeAnim();
  }
})();
