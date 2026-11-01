/* الصفحة الرئيسية: هيرو + صفوف، أو وضع التصفّح (بحث / تصنيف / كل الأفلام) */
(() => {
  const { $, $$, esc, hue, runtime, rate } = ZXUI;
  const app = $("#app");
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------ الحالة من الرابط ------------------------------ */
  const readURL = () => {
    const p = new URLSearchParams(location.search);
    return { q: (p.get("q") || "").trim(), genre: p.get("genre") || "", sort: p.get("sort") || "popular", view: p.get("view") || "" };
  };
  const buildURL = (s) => {
    const p = new URLSearchParams();
    if (s.q) p.set("q", s.q);
    if (s.genre) p.set("genre", s.genre);
    if (s.sort && s.sort !== "popular") p.set("sort", s.sort);
    if (s.view && !s.q && !s.genre) p.set("view", s.view);
    const qs = p.toString();
    return "index.html" + (qs ? "?" + qs : "");
  };
  const isBrowse = (s) => !!(s.q || s.genre || s.view === "all");

  let state = readURL();
  let homeData = null;
  let seq = 0;               // لتجاهل الردود القديمة
  let heroTimer = null;

  const go = (patch, { replace = false } = {}) => {
    state = { ...state, ...patch };
    history[replace ? "replaceState" : "pushState"](null, "", buildURL(state));
    render();
  };

  /* ------------------------------ شريط التصنيفات ------------------------------ */
  const genreList = () =>
    ZXApi.usingTmdb ? ZXApi.genres : ZXApi.genres.filter((g) => window.ZX_MOVIES.some((m) => m.genres.includes(g.key)));

  const chips = (active) => `
    <nav class="chips" aria-label="التصنيفات">
      <a data-nav href="${buildURL({ view: "all" })}" class="chip ${!active ? "on" : ""}">الكل</a>
      ${genreList().map((g) => `<a data-nav href="${buildURL({ genre: g.key })}" class="chip ${active === g.key ? "on" : ""}">${esc(g.ar)}</a>`).join("")}
    </nav>`;

  /* ------------------------------ الهيرو ------------------------------ */
  // الرابط لازم يكون مطلق: المسار النسبي داخل متغيّر CSS ينحسب من مجلد css/ مو من الصفحة
  const cssUrl = (u) => `url("${encodeURI(new URL(u, location.href).href).replace(/"/g, "%22")}")`;

  const listBtn = (m) => {
    const on = ZXStore.inList(m.id);
    return `<button class="btn ghost" type="button" data-hero-list="${esc(m.id)}">${icon(on ? "check" : "plus")}${on ? "بقائمتي" : "ضيفه لقائمتي"}</button>`;
  };

  const heroHTML = (movies, i) => {
    const m = movies[i];
    const bg = m.backdrop || m.poster;
    const style = `--h:${hue(m.original || m.title)};${bg ? `--bg:${cssUrl(bg)}` : ""}`;
    const meta = [m.year, runtime(m.runtime)].filter(Boolean).map((x) => `<span>${esc(x)}</span>`).join("");
    return `
    <section class="hero ${m.backdrop ? "wide" : ""}" style="${esc(style)}" aria-roledescription="carousel" aria-label="أفلام مختارة">
      <div class="hero-bg"></div>
      <div class="hero-in">
        <div class="hero-text">
          <div class="kicker">فلم مختار</div>
          <h1 dir="auto">${esc(m.title)}</h1>
          <div class="meta">${meta}<span class="rate">${icon("star", "fill")}${rate(m)}</span></div>
          <div class="tags">${m.genres.slice(0, 3).map((g) => `<span>${esc(ZXApi.genreName(g))}</span>`).join("")}</div>
          <p class="hero-ov">${esc(m.overview)}</p>
          <div class="actions">
            <button class="btn primary" type="button" data-hero-trailer="${i}">${icon("play", "fill")}شوف التريلر</button>
            <a class="btn ghost" href="movie.html?id=${encodeURIComponent(m.id)}">${icon("info")}التفاصيل</a>
            ${listBtn(m)}
          </div>
        </div>
        <div class="hero-poster">${ZXUI.poster(m)}</div>
      </div>
      <div class="dots" role="tablist" aria-label="اختيار الفلم">
        ${movies.map((x, j) => `<button type="button" role="tab" aria-selected="${j === i}" aria-label="${esc(x.title)}" class="${j === i ? "on" : ""}" data-hero-dot="${j}"></button>`).join("")}
      </div>
    </section>`;
  };

  const mountHero = (movies) => {
    clearInterval(heroTimer);
    const holder = $("#hero");
    if (!holder || !movies.length) return;
    let i = 0, paused = false;
    const show = (n) => { i = (n + movies.length) % movies.length; holder.innerHTML = heroHTML(movies, i); };
    show(0);

    holder.onclick = async (e) => {
      const dot = e.target.closest("[data-hero-dot]");
      if (dot) return show(Number(dot.dataset.heroDot));
      const tr = e.target.closest("[data-hero-trailer]");
      if (tr) return openTrailerFor(movies[Number(tr.dataset.heroTrailer)]);
      const ls = e.target.closest("[data-hero-list]");
      if (ls) {
        const m = movies[i];
        ZXUI.toast(ZXStore.toggleList(m) ? "انضاف لقائمتك" : "انشال من قائمتك");
        ls.outerHTML = listBtn(m);
      }
    };
    holder.onmouseenter = holder.onfocusin = () => (paused = true);
    holder.onmouseleave = holder.onfocusout = () => (paused = false);
    if (!reduceMotion && movies.length > 1) heroTimer = setInterval(() => !paused && !document.hidden && show(i + 1), 8000);
  };

  /* التريلر: بالكتالوج المحلي موجود جاهز، وبـ TMDB نجيبه من التفاصيل */
  const openTrailerFor = async (m) => {
    if (!m.trailer && ZXApi.usingTmdb) {
      try { m = (await ZXApi.get(m.id)).movie; } catch { /* نفتح النافذة بدون تريلر */ }
    }
    ZXUI.openTrailer(m);
  };

  /* ------------------------------ الصفحة الرئيسية ------------------------------ */
  const renderHome = async (token) => {
    app.innerHTML = `<div id="hero" class="hero-holder"></div><div class="wrap">${chips("")}<div id="rows">${ZXUI.skeletonRow()}${ZXUI.skeletonRow()}</div></div>`;
    try {
      homeData = homeData || (await ZXApi.home());
    } catch (err) {
      if (token === seq) return showError(renderHome);
      return;
    }
    if (token !== seq) return;
    mountHero(homeData.hero);
    const mine = ZXStore.list();
    const sections = mine.length ? [{ id: "mylist", title: "قائمتي", movies: mine }, ...homeData.sections] : homeData.sections;
    $("#rows").innerHTML = sections.map(ZXUI.row).join("");
  };

  /* ------------------------------ وضع التصفّح ------------------------------ */
  let moreState = { page: 1, totalPages: 1 };

  const browseTitle = () => {
    if (state.q) return `نتائج البحث عن «${esc(state.q)}»`;
    if (state.genre) return esc(ZXApi.genreName(state.genre));
    return "كل الأفلام";
  };

  const sortSelect = () => {
    const opts = [["popular", ZXApi.usingTmdb ? "الأكثر رواجاً" : "المختارة"], ["top", "الأعلى تقييماً"], ["new", "الأحدث"]];
    if (!ZXApi.usingTmdb) opts.push(["name", "الاسم"]);
    return `<label class="sort">رتّب حسب
      <select id="sort">${opts.map(([v, t]) => `<option value="${v}" ${state.sort === v ? "selected" : ""}>${t}</option>`).join("")}</select></label>`;
  };

  const renderBrowse = async (token) => {
    clearInterval(heroTimer);
    app.innerHTML = `
      <div class="wrap page-top">
        <div class="browse-head">
          <h1>${browseTitle()}</h1>
          ${state.q ? "" : sortSelect()}
        </div>
        ${chips(state.genre)}
        <div id="results" aria-live="polite">${'<div class="grid">' + '<div class="card"><div class="poster sk"></div></div>'.repeat(10) + "</div>"}</div>
        <div class="more" id="more"></div>
      </div>`;
    $("#sort")?.addEventListener("change", (e) => go({ sort: e.target.value }, { replace: true }));

    let data;
    try {
      data = await ZXApi.browse({ q: state.q, genre: state.genre, sort: state.sort, page: 1 });
    } catch (err) {
      if (token === seq) showError(renderBrowse);
      return;
    }
    if (token !== seq) return;
    moreState = { page: data.page, totalPages: data.totalPages };

    const res = $("#results");
    if (!data.movies.length) {
      res.innerHTML = `<div class="empty">
        <p>ما لقيت شي${state.q ? ` بهذا الاسم` : ""}. جرّب كلمة ثانية أو شيل التصنيف.</p>
        <a data-nav class="btn ghost" href="${buildURL({ view: "all" })}">شوف كل الأفلام</a></div>`;
      return;
    }
    res.innerHTML = ZXUI.grid(data.movies);
    drawMore(token);
  };

  const drawMore = (token) => {
    const box = $("#more");
    if (!box) return;
    if (moreState.page >= moreState.totalPages) { box.innerHTML = ""; return; }
    box.innerHTML = `<button class="btn ghost" type="button" id="moreBtn">حمّل المزيد</button>`;
    $("#moreBtn").onclick = async (e) => {
      e.target.disabled = true; e.target.textContent = "ثواني...";
      try {
        const d = await ZXApi.browse({ q: state.q, genre: state.genre, sort: state.sort, page: moreState.page + 1 });
        if (token !== seq) return;
        moreState = { page: d.page, totalPages: d.totalPages };
        $(".grid", $("#results")).insertAdjacentHTML("beforeend", d.movies.map(ZXUI.card).join(""));
        drawMore(token);
      } catch {
        e.target.disabled = false; e.target.textContent = "صار خلل — جرّب مرة ثانية";
      }
    };
  };

  /* ------------------------------ أخطاء ------------------------------ */
  const showError = (retry) => {
    app.innerHTML = `<div class="wrap page-top"><div class="empty">
      <p>صار خلل بتحميل الأفلام. تأكد من الإنترنت${ZXApi.usingTmdb ? " ومن مفتاح TMDB بملف config.js" : ""}.</p>
      <button class="btn primary" type="button" id="retry">جرّب مرة ثانية</button></div></div>`;
    $("#retry").onclick = () => retry(seq);
  };

  /* ------------------------------ التشغيل ------------------------------ */
  function render() {
    const token = ++seq;
    ZXUI.setSearchValue(state.q);
    document.title = state.q ? `بحث: ${state.q} — ZX-TV` : state.genre ? `${ZXApi.genreName(state.genre)} — ZX-TV` : "ZX-TV — موقع أفلام";
    $$(".links a").forEach((a) => a.removeAttribute("aria-current"));
    const links = $$(".links a");
    const cur = isBrowse(state) ? links[1] : links[0];
    cur && cur.setAttribute("aria-current", "page");
    scrollTo({ top: 0 });
    return isBrowse(state) ? renderBrowse(token) : renderHome(token);
  }

  ZXUI.mountChrome(isBrowse(state) ? "all" : "home");

  // البحث الحي: نكتب فيبدّل الصفحة بدون إعادة تحميل
  ZXUI.bindSearch((q) => {
    if (q === state.q) return;
    go({ q, genre: "" }, { replace: !!state.q && !!q });
  });

  // التنقل الداخلي بدون إعادة تحميل (التصنيفات...)
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[data-nav]");
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
    e.preventDefault();
    const u = new URL(a.href);
    const p = u.searchParams;
    go({ q: "", genre: p.get("genre") || "", sort: state.sort, view: p.get("view") || "" });
  });
  addEventListener("popstate", () => { state = readURL(); render(); });

  // لما تتغير قائمتي نحدّث صف «قائمتي» بالرئيسية
  addEventListener("zx:store", () => {
    if (isBrowse(state) || !homeData) return;
    const old = $("#row-mylist"), mine = ZXStore.list();
    const rows = $("#rows");
    if (!rows) return;
    if (old) old.closest(".row").remove();
    if (mine.length) rows.insertAdjacentHTML("afterbegin", ZXUI.row({ id: "mylist", title: "قائمتي", movies: mine }));
  });

  render();
})();
