/* صفحة تفاصيل الفلم */
(() => {
  const { $, esc, hue, runtime, rate } = ZXUI;
  const app = $("#app");
  const id = new URLSearchParams(location.search).get("id");

  ZXUI.mountChrome("movie");

  const notFound = (msg) => {
    document.title = "ما لقيت الفلم — ZX-TV";
    app.innerHTML = `<div class="wrap page-top"><div class="empty">
      <p>${msg}</p><a class="btn primary" href="index.html">ارجع للرئيسية</a></div></div>`;
  };

  // الرابط لازم يكون مطلق: المسار النسبي داخل متغيّر CSS ينحسب من مجلد css/ مو من الصفحة
  const cssUrl = (u) => `url("${encodeURI(new URL(u, location.href).href).replace(/"/g, "%22")}")`;

  const stars = (n) =>
    [1, 2, 3, 4, 5].map((i) =>
      `<button type="button" class="star ${i <= n ? "on" : ""}" data-star="${i}" role="radio" aria-checked="${i === n}" aria-label="${i} من 5">${icon("star", i <= n ? "fill" : "")}</button>`
    ).join("");

  const actions = (m) => {
    const inList = ZXStore.inList(m.id), seen = ZXStore.inWatched(m.id);
    return `
      <button class="btn primary" type="button" id="btnTrailer">${icon("play", "fill")}شوف التريلر</button>
      <button class="btn ghost ${inList ? "active" : ""}" type="button" id="btnList" aria-pressed="${inList}">${icon(inList ? "check" : "bookmark")}${inList ? "بقائمتي" : "ضيفه لقائمتي"}</button>
      <button class="btn ghost ${seen ? "active" : ""}" type="button" id="btnSeen" aria-pressed="${seen}">${icon(seen ? "check" : "eye")}${seen ? "شفته" : "علّمه شفته"}</button>
      <button class="btn icon-only ghost" type="button" id="btnShare" aria-label="شارك">${icon("share")}</button>`;
  };

  const render = ({ movie: m, similar }) => {
    ZXUI.remember([m, ...similar]);
    document.title = `${m.title} — ZX-TV`;
    const bg = m.backdrop || m.poster;
    const style = `--h:${hue(m.original || m.title)};${bg ? `--bg:${cssUrl(bg)}` : ""}`;
    const facts = [
      m.year && `<span>${icon("calendar")}${esc(m.year)}</span>`,
      m.runtime && `<span>${icon("clock")}${esc(runtime(m.runtime))}</span>`,
      `<span class="rate">${icon("star", "fill")}<bdi dir="ltr">${rate(m)}<small>/10</small></bdi></span>`,
    ].filter(Boolean).join("");

    app.innerHTML = `
      <section class="detail ${m.backdrop ? "wide" : ""}" style="${esc(style)}">
        <div class="hero-bg"></div>
        <div class="detail-in">
          <div class="detail-poster">${ZXUI.poster(m)}</div>
          <div class="detail-text">
            <h1 dir="auto">${esc(m.title)}</h1>
            ${m.original && m.original !== m.title ? `<div class="orig" dir="ltr">${esc(m.original)}</div>` : ""}
            <div class="meta">${facts}</div>
            <div class="tags">${m.genres.map((g) => `<a href="index.html?genre=${esc(g)}">${esc(ZXApi.genreName(g))}</a>`).join("")}</div>
            <p class="overview">${esc(m.overview) || "ما كو ملخص متوفر لهذا الفلم."}</p>
            <dl class="credits">
              ${m.director ? `<div><dt>الإخراج</dt><dd dir="auto"><bdi>${esc(m.director)}</bdi></dd></div>` : ""}
              ${m.cast && m.cast.length ? `<div><dt>التمثيل</dt><dd><bdi>${m.cast.map(esc).join("، ")}</bdi></dd></div>` : ""}
            </dl>
            <div class="actions" id="actions">${actions(m)}</div>
            <div class="myrate"><span>تقييمك</span><div class="stars" id="stars" role="radiogroup" aria-label="تقييمك">${stars(ZXStore.rating(m.id))}</div></div>
          </div>
        </div>
      </section>

      ${m.video ? `<section class="wrap player"><h2>شغّل الفلم</h2>
        <video controls preload="metadata" ${m.poster ? `poster="${esc(m.poster)}"` : ""} src="${esc(m.video)}"></video></section>` : ""}

      <div class="wrap">
        ${similar.length ? ZXUI.row({ id: "similar", title: "أفلام تشبهه", movies: similar }) : ""}
      </div>`;

    const refresh = () => { $("#actions").innerHTML = actions(m); $("#stars").innerHTML = stars(ZXStore.rating(m.id)); };

    app.onclick = async (e) => {
      if (e.target.closest("#btnTrailer")) return ZXUI.openTrailer(m);
      if (e.target.closest("#btnList")) { ZXUI.toast(ZXStore.toggleList(m) ? "انضاف لقائمتك" : "انشال من قائمتك"); return refresh(); }
      if (e.target.closest("#btnSeen")) { ZXUI.toast(ZXStore.toggleWatched(m) ? "علّمته شفته" : "شلت علامة المشاهدة"); return refresh(); }
      const st = e.target.closest("[data-star]");
      if (st) {
        const n = Number(st.dataset.star);
        ZXStore.setRating(m.id, ZXStore.rating(m.id) === n ? 0 : n);
        return refresh();
      }
      if (e.target.closest("#btnShare")) {
        const data = { title: m.title, text: `${m.title} على ZX-TV`, url: location.href };
        try {
          if (navigator.share) await navigator.share(data);
          else { await navigator.clipboard.writeText(location.href); ZXUI.toast("انسخ الرابط"); }
        } catch { /* المستخدم لغى المشاركة */ }
      }
    };
  };

  /* ----------------------------- تحميل ----------------------------- */
  if (!id) { notFound("ما حددت أي فلم."); return; }

  app.innerHTML = `<div class="wrap page-top"><div class="detail-in"><div class="detail-poster"><div class="poster sk"></div></div>
    <div class="detail-text"><div class="sk sk-title"></div><div class="sk sk-line"></div><div class="sk sk-line"></div><div class="sk sk-line short"></div></div></div></div>`;

  ZXApi.get(id)
    .then((data) => (data ? render(data) : notFound("هذا الفلم مو موجود.")))
    .catch(() => notFound("صار خلل بتحميل الفلم. تأكد من الإنترنت وجرّب مرة ثانية."));
})();
