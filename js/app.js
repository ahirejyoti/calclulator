(() => {
  'use strict';

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  /* Illustrative demo data — mirrors the numbers shown in the design. */
  const PROPERTIES = {
    cedar: { name: 'Cedar Court, Naupada',         tagline: 'Rail access without the budget stretch.', station: '8 min walk*',  work: '15 min drive*' },
    grove: { name: 'The Grove Residences, Mulund', tagline: 'Closer to Mumbai · less budget headroom', station: '11 min walk*', work: '24 min drive*' },
    palm:  { name: 'Palm Terraces, Airoli',        tagline: 'More space · longer workplace commute',   station: '12 min walk*', work: '32 min drive*' },
  };
  const SAVED_BASE = 6; // homes already saved before this session

  const saved   = new Set();
  const compare = new Set(Object.keys(PROPERTIES));

  /* ── Toast ── */
  const toast = $('#toast');
  let toastTimer;
  function showToast(message) {
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, 2600);
  }
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-toast]');
    if (trigger) showToast(trigger.dataset.toast);
  });

  /* ── Save (heart) ── */
  function renderSaved() {
    $('#saved-count').textContent = SAVED_BASE + saved.size;
    $$('[data-save]').forEach((btn) => {
      const on = saved.has(btn.dataset.save);
      btn.setAttribute('aria-pressed', on);
    });
  }
  $$('[data-save]').forEach((btn) => btn.addEventListener('click', () => {
    const id = btn.dataset.save;
    const label = PROPERTIES[id].name.split(',')[0];
    if (saved.has(id)) { saved.delete(id); showToast(`Removed ${label} from saved homes.`); }
    else               { saved.add(id);    showToast(`Saved ${label}.`); }
    renderSaved();
  }));

  /* ── Compare ── */
  function renderCompare() {
    const n = compare.size;
    $('#compare-count').textContent = n;
    $('#comparison-count').textContent = `${n} ${n === 1 ? 'home' : 'homes'} selected`;
    $$('[data-compare]').forEach((btn) => {
      const on = compare.has(btn.dataset.compare);
      btn.setAttribute('aria-pressed', on);
      const label = $('[data-compare-label]', btn);
      if (label) label.textContent = on ? 'In comparison' : 'Add to comparison';
    });
    $$('[data-col]').forEach((col) => { col.hidden = !compare.has(col.dataset.col); });
    $('#table-empty').hidden = n > 0;
  }
  $$('[data-compare]').forEach((btn) => btn.addEventListener('click', () => {
    const id = btn.dataset.compare;
    compare.has(id) ? compare.delete(id) : compare.add(id);
    renderCompare();
  }));

  /* ── Map pins ↔ selected location ── */
  function selectProperty(id) {
    const p = PROPERTIES[id];
    $$('[data-pin]').forEach((pin) => {
      const on = pin.dataset.pin === id;
      pin.classList.toggle('is-active', on);
      pin.setAttribute('aria-pressed', on);
    });
    $('#loc-name').textContent = p.name;
    $('#loc-tagline').textContent = p.tagline;
    $('#loc-station').textContent = p.station;
    $('#loc-work').textContent = p.work;
  }
  $$('[data-pin]').forEach((pin) => pin.addEventListener('click', () => selectProperty(pin.dataset.pin)));

  /* ── Search ── */
  $('#nl-search').addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Demo: matches shown are illustrative and don’t change with your search.');
  });
  $('#edit-preferences').addEventListener('click', () => {
    const input = $('#query');
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  });

  renderSaved();
  renderCompare();
})();
