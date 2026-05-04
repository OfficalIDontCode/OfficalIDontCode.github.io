// minimal vanilla js: tab <-> scroll sync, mobile explorer drawer, folder collapse.
(() => {
  const scroll = document.getElementById('scroll');
  const explorer = document.getElementById('explorer');
  const explorerToggle = document.querySelector('.explorer-toggle');
  const scrim = document.getElementById('scrim');
  const tabs = [...document.querySelectorAll('.tabbar .tab')];
  const treeFiles = [...document.querySelectorAll('.tree-row.file')];

  // mobile explorer drawer ------------------------------------------------
  function openExplorer() {
    explorer.classList.add('open');
    scrim.classList.add('open');
    scrim.hidden = false;
    explorerToggle.setAttribute('aria-expanded', 'true');
  }
  function closeExplorer() {
    explorer.classList.remove('open');
    scrim.classList.remove('open');
    scrim.hidden = true;
    explorerToggle.setAttribute('aria-expanded', 'false');
  }
  explorerToggle?.addEventListener('click', () => {
    explorer.classList.contains('open') ? closeExplorer() : openExplorer();
  });
  scrim?.addEventListener('click', closeExplorer);

  // close drawer on file click (mobile only)
  document.addEventListener('click', (e) => {
    const a = e.target.closest('.tree-row.file, .tab');
    if (a && window.matchMedia('(max-width: 720px)').matches) closeExplorer();
  });

  // tree folder collapse --------------------------------------------------
  document.querySelectorAll('.tree-folder').forEach(btn => {
    btn.addEventListener('click', (e) => {
      // only the folder row itself, not nested clicks on children
      if (e.target !== btn && !btn.contains(e.target)) return;
      const open = btn.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
      const caret = btn.querySelector('.caret');
      if (caret) caret.textContent = open ? '▾' : '▸';
      const list = btn.parentElement.querySelector('.tree-children');
      if (list) list.style.display = open ? '' : 'none';
    });
  });

  // smooth-scroll the inner editor area, since <html> doesn't scroll here
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      const top = el.offsetTop - 8;
      scroll.scrollTo({ top, behavior: 'smooth' });
      history.replaceState(null, '', '#' + id);
    });
  });

  // active tab + active file highlight on scroll --------------------------
  const targets = [...document.querySelectorAll('.doc[id], article[id]')];
  const byId = new Map(targets.map(t => [t.id, t]));

  function setActive(id) {
    tabs.forEach(t => t.classList.toggle('active', t.dataset.target === id));
    treeFiles.forEach(f => f.classList.toggle('active', f.dataset.target === id));
  }

  // every project article gets folded under the primal-islands tab so the
  // top tab strip stays short. file-tree entries match exactly.
  const tabIds = new Set(tabs.map(t => t.dataset.target));
  const projectIds = ['grand-theft-city','codedefender','oink','paradox','research','projects'];
  function tabFor(id) {
    if (tabIds.has(id)) return id;
    if (projectIds.includes(id)) return 'primal-islands';
    return id;
  }

  // pick whichever section's top edge is closest to (but <=) the trigger line
  // (a fifth of the way down the scroll viewport). simple, no IO race quirks.
  function updateActive() {
    const trigger = scroll.scrollTop + scroll.clientHeight * 0.2;
    let current = targets[0];
    for (const t of targets) {
      if (t.offsetTop <= trigger) current = t;
      else break;
    }
    setActive(tabFor(current.id));
    for (const t of treeFiles) t.classList.toggle('active', t.dataset.target === current.id);
  }
  scroll.addEventListener('scroll', () => requestAnimationFrame(updateActive), { passive: true });
  window.addEventListener('resize', updateActive, { passive: true });
  window.addEventListener('load', updateActive);
  updateActive();

  // jump-to-hash on load (and again after images settle, since they reflow)
  function jumpToHash() {
    if (!location.hash) return;
    const el = byId.get(location.hash.slice(1));
    if (el) scroll.scrollTo({ top: el.offsetTop - 8, behavior: 'auto' });
  }
  requestAnimationFrame(jumpToHash);
  window.addEventListener('load', () => { jumpToHash(); updateActive(); });
})();
