// minimal: highlight active rail nav item as you scroll.
(() => {
  const railLinks = Array.from(document.querySelectorAll('.rail-list a[data-section]'));
  if (!railLinks.length) return;

  const sections = railLinks
    .map(a => document.getElementById(a.dataset.section))
    .filter(Boolean);

  const byId = new Map(railLinks.map(a => [a.dataset.section, a]));

  const setActive = (id) => {
    railLinks.forEach(a => a.classList.toggle('active', a.dataset.section === id));
  };

  if (!('IntersectionObserver' in window)) {
    setActive(sections[0].id);
    return;
  }

  // pick the section whose top is closest to (but past) the viewport's upper third
  let visible = new Map();
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => visible.set(e.target.id, e.intersectionRatio));
    let best = { id: null, ratio: -1 };
    visible.forEach((ratio, id) => {
      if (ratio > best.ratio) best = { id, ratio };
    });
    if (best.id && byId.has(best.id)) setActive(best.id);
  }, {
    rootMargin: '-30% 0px -55% 0px',
    threshold: [0, 0.25, 0.5, 0.75, 1],
  });

  sections.forEach(s => io.observe(s));

  // initial
  setActive(sections[0].id);
})();
