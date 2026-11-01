/* أيقونات SVG (stroke) — الاستخدام: icon('play') */
(() => {
  const P = {
    search:   '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
    menu:     '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close:    '<path d="M6 6l12 12M18 6L6 18"/>',
    play:     '<path d="M8 5.5v13l11-6.5-11-6.5z"/>',
    plus:     '<path d="M12 5v14M5 12h14"/>',
    check:    '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    bookmark: '<path d="M7 4h10a1 1 0 0 1 1 1v15l-6-4-6 4V5a1 1 0 0 1 1-1z"/>',
    info:     '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.01"/>',
    chevR:    '<path d="M9 5l7 7-7 7"/>',
    chevL:    '<path d="M15 5l-7 7 7 7"/>',
    clock:    '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    calendar: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M8 3v4M16 3v4"/>',
    share:    '<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.2 10.8l7.6-3.6M8.2 13.2l7.6 3.6"/>',
    eye:      '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    star:     '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.8 6.8 19.6l1-5.8L3.5 9.7l5.9-.9L12 3.5z"/>',
    film:     '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 4v16M16 4v16M4 9h4M4 15h4M16 9h4M16 15h4"/>',
    external: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    trash:    '<path d="M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13"/>',
  };
  window.icon = (name, cls = "") =>
    `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true">${P[name] || ""}</svg>`;
})();
