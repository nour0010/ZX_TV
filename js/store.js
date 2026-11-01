/* التخزين المحلي (localStorage): قائمتي، شفتها، تقييماتي */
window.ZXStore = (() => {
  const KEY = "zxtv:v1";

  const read = () => {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; }
  };
  const write = (s) => {
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* التخزين ممنوع أو ممتلئ */ }
    window.dispatchEvent(new CustomEvent("zx:store"));
  };
  const state = () => {
    const s = read();
    s.list = s.list || {};
    s.watched = s.watched || {};
    s.ratings = s.ratings || {};
    return s;
  };

  // نخزّن نسخة مصغّرة من الفلم حتى تشتغل صفحة قائمتي بدون إنترنت
  const snap = (m) => ({
    id: m.id, title: m.title, original: m.original, year: m.year, rating: m.rating,
    genres: m.genres, poster: m.poster, at: Date.now(),
  });

  const toggle = (bucket, m) => {
    const s = state();
    const on = !s[bucket][m.id];
    if (on) s[bucket][m.id] = snap(m); else delete s[bucket][m.id];
    write(s);
    return on;
  };
  const items = (bucket) =>
    Object.values(state()[bucket]).sort((a, b) => b.at - a.at);

  return {
    inList: (id) => !!state().list[id],
    inWatched: (id) => !!state().watched[id],
    toggleList: (m) => toggle("list", m),
    toggleWatched: (m) => toggle("watched", m),
    list: () => items("list"),
    watched: () => items("watched"),
    remove(bucket, id) { const s = state(); delete s[bucket][id]; write(s); },
    rating: (id) => state().ratings[id] || 0,
    setRating(id, n) {
      const s = state();
      if (n) s.ratings[id] = n; else delete s.ratings[id];
      write(s);
    },
  };
})();
