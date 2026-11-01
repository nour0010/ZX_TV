/* مكوّنات الواجهة المشتركة: الهيدر، الفوتر، البطاقات، الصفوف، نافذة التريلر */
window.ZXUI = (() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const hue = (s) => {
    let h = 0;
    for (const c of String(s)) h = (h * 31 + c.codePointAt(0)) % 360;
    return h;
  };

  const debounce = (fn, ms) => {
    let t;
    return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
  };

  const runtime = (min) => {
    if (!min) return "";
    const h = Math.floor(min / 60), m = min % 60;
    return h ? `${h} س ${m ? m + " د" : ""}`.trim() : `${m} د`;
  };
  const rate = (m) => (m.rating ? m.rating.toFixed(1) : "—");

  /* سجل الأفلام اللي انعرضت — حتى نعرف نخزّنها عند الضغط على زر القائمة */
  const registry = {};
  const remember = (list) => list.forEach((m) => (registry[m.id] = m));

  /* البوستر: خلفية متدرجة بالاسم، والصورة فوقها (إذا فشلت تنحذف وتبقى الخلفية) */
  const poster = (m, cls = "") => `
    <div class="poster ${cls}" style="--h:${hue(m.original || m.title)}">
      <span class="pf-title" dir="auto">${esc(m.title)}</span>
      ${m.poster ? `<img src="${esc(m.poster)}" alt="" loading="lazy" decoding="async" onerror="this.remove()">` : ""}
    </div>`;

  const card = (m) => {
    remember([m]);
    const on = ZXStore.inList(m.id);
    return `
    <article class="card">
      <a class="card-link" href="movie.html?id=${encodeURIComponent(m.id)}" aria-label="${esc(m.title)}">
        ${poster(m)}
        <div class="card-body">
          <h3 class="card-title" dir="auto">${esc(m.title)}</h3>
          <div class="card-meta"><span>${esc(m.year)}</span><span class="rate">${icon("star", "fill")}${rate(m)}</span></div>
        </div>
      </a>
      <button class="card-add ${on ? "on" : ""}" data-id="${esc(m.id)}" aria-pressed="${on}"
        title="${on ? "شيله من قائمتي" : "ضيفه لقائمتي"}">${icon(on ? "check" : "plus")}</button>
    </article>`;
  };

  const grid = (movies) => `<div class="grid">${movies.map(card).join("")}</div>`;

  const row = ({ id, title, genre, movies }) => `
    <section class="row" aria-label="${esc(title)}">
      <div class="row-head">
        <h2>${genre ? `<a href="index.html?genre=${esc(genre)}">${esc(title)}</a>` : esc(title)}</h2>
        <div class="row-nav">
          <button type="button" data-scroll="1" aria-label="السابق">${icon("chevR")}</button>
          <button type="button" data-scroll="-1" aria-label="التالي">${icon("chevL")}</button>
        </div>
      </div>
      <div class="row-scroller" id="row-${esc(id)}">${movies.map(card).join("")}</div>
    </section>`;

  const skeletonRow = (n = 8) => `
    <section class="row"><div class="row-head"><h2 class="sk sk-title"></h2></div>
    <div class="row-scroller">${'<div class="card"><div class="poster sk"></div></div>'.repeat(n)}</div></section>`;

  /* ----------------------------- الهيدر والفوتر ----------------------------- */
  let searchHandler = null;

  const header = (active) => `
    <header class="nav" id="nav">
      <div class="nav-in">
        <a class="logo" href="index.html" aria-label="ZX-TV"><b>Z</b>X-TV</a>
        <nav class="links" id="navLinks" aria-label="التنقل">
          <a href="index.html" ${active === "home" ? 'aria-current="page"' : ""}>الرئيسية</a>
          <a href="index.html?view=all" ${active === "all" ? 'aria-current="page"' : ""}>كل الأفلام</a>
          <a href="mylist.html" ${active === "list" ? 'aria-current="page"' : ""}>قائمتي<span class="badge" id="listCount" hidden></span></a>
        </nav>
        <form class="nsearch" id="navSearch" role="search">
          ${icon("search")}
          <input id="navQ" type="search" placeholder="شنو تدور عليه؟" autocomplete="off" enterkeyhint="search" aria-label="بحث">
          <kbd aria-hidden="true">/</kbd>
        </form>
        <button class="burger" id="burger" type="button" aria-label="القائمة" aria-expanded="false" aria-controls="navLinks">${icon("menu")}</button>
      </div>
    </header>`;

  const footer = () => `
    <footer class="foot">
      <div><b class="logo-sm"><i>Z</i>X-TV</b> — مشروع للتعلّم والتجربة. الموقع يعرض معلومات الأفلام والتريلرات فقط.</div>
      ${ZXApi.usingTmdb ? '<div class="muted">هذا الموقع يستخدم TMDB API لكنه غير مدعوم أو معتمد من TMDB.</div>' : '<div class="muted">البيانات الحالية تجريبية (كتالوج محلي).</div>'}
    </footer>`;

  const updateBadge = () => {
    const n = ZXStore.list().length, b = $("#listCount");
    if (!b) return;
    b.textContent = n; b.hidden = !n;
  };

  const mountChrome = (active) => {
    document.body.insertAdjacentHTML("afterbegin", header(active));
    document.body.insertAdjacentHTML("beforeend", footer());

    const nav = $("#nav"), burger = $("#burger"), form = $("#navSearch"), input = $("#navQ");

    const onScroll = () => nav.classList.toggle("scrolled", scrollY > 20);
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    burger.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", open);
      burger.innerHTML = icon(open ? "close" : "menu");
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = input.value.trim();
      if (searchHandler) searchHandler(q);
      else location.href = "index.html" + (q ? "?q=" + encodeURIComponent(q) : "");
    });
    input.addEventListener("input", debounce(() => searchHandler && searchHandler(input.value.trim()), 250));

    addEventListener("keydown", (e) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
      if (e.key === "/" && !typing && !e.ctrlKey && !e.metaKey) { e.preventDefault(); input.focus(); }
    });

    updateBadge();
    addEventListener("zx:store", updateBadge);
  };

  const bindSearch = (fn) => { searchHandler = fn; };
  const setSearchValue = (v) => { const i = $("#navQ"); if (i) i.value = v || ""; };

  /* ------------------------------ تنبيه صغير ------------------------------ */
  let toastTimer;
  const toast = (msg) => {
    let t = $("#toast");
    if (!t) { t = document.createElement("div"); t.id = "toast"; t.setAttribute("role", "status"); document.body.append(t); }
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
  };

  /* ----------------------------- نافذة التريلر ----------------------------- */
  let lastFocus = null;
  const closeModal = () => {
    const m = $("#modal");
    if (!m) return;
    m.remove();
    document.body.classList.remove("noscroll");
    lastFocus && lastFocus.focus && lastFocus.focus();
  };

  const openTrailer = (m) => {
    closeModal();
    lastFocus = document.activeElement;
    const q = encodeURIComponent(`${m.original || m.title} ${m.year || ""} trailer`);
    const body = m.trailer
      ? `<div class="video-wrap"><iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(m.trailer)}?autoplay=1&rel=0"
           title="تريلر ${esc(m.title)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div>`
      : `<div class="modal-empty"><p>ما مضاف تريلر لهذا الفلم بعد.</p>
           <a class="btn" href="https://www.youtube.com/results?search_query=${q}" target="_blank" rel="noopener">${icon("external")}دوّر عليه بيوتيوب</a></div>`;
    document.body.insertAdjacentHTML("beforeend", `
      <div class="modal" id="modal" role="dialog" aria-modal="true" aria-label="تريلر ${esc(m.title)}">
        <div class="modal-box">
          <button class="modal-x" type="button" aria-label="إغلاق">${icon("close")}</button>
          ${body}
        </div>
      </div>`);
    document.body.classList.add("noscroll");
    const modal = $("#modal");
    $(".modal-x", modal).focus();
    modal.addEventListener("click", (e) => { if (e.target === modal || e.target.closest(".modal-x")) closeModal(); });
  };
  addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

  /* ----------------------- أحداث عامة (تفويض أحداث) ----------------------- */
  document.addEventListener("click", (e) => {
    const add = e.target.closest(".card-add");
    if (add) {
      e.preventDefault();
      const m = registry[add.dataset.id];
      if (!m) return;
      toast(ZXStore.toggleList(m) ? "انضاف لقائمتك" : "انشال من قائمتك");
      return;
    }
    const sc = e.target.closest("[data-scroll]");
    if (sc) {
      const scroller = $(".row-scroller", sc.closest(".row"));
      // الصفحة RTL: القيمة السالبة = التمرير نحو اليسار (التالي)
      scroller.scrollBy({ left: Number(sc.dataset.scroll) * scroller.clientWidth * 0.85, behavior: "smooth" });
    }
  });

  /* تحديث أزرار البطاقات لما تتغير القائمة (من أي صفحة/تبويب) */
  const syncCards = () =>
    $$(".card-add").forEach((b) => {
      const on = ZXStore.inList(b.dataset.id);
      b.classList.toggle("on", on);
      b.setAttribute("aria-pressed", on);
      b.title = on ? "شيله من قائمتي" : "ضيفه لقائمتي";
      b.innerHTML = icon(on ? "check" : "plus");
    });
  addEventListener("zx:store", syncCards);
  addEventListener("storage", () => { syncCards(); updateBadge(); });

  return { $, $$, esc, hue, runtime, rate, poster, card, grid, row, skeletonRow, remember,
           mountChrome, bindSearch, setSearchValue, toast, openTrailer, closeModal };
})();
