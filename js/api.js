/* طبقة البيانات — نفس الواجهة سواء الكتالوج المحلي أو TMDB
 *
 *  ZXApi.home()                      → { hero:[movie], sections:[{id,title,movies}] }
 *  ZXApi.browse({q,genre,sort,page}) → { movies, page, totalPages }
 *  ZXApi.get(id)                     → { movie, similar:[movie] }
 *
 *  شكل الفلم: { id,title,original,year,genres:[key],rating,runtime,director,cast:[],
 *               overview,poster,backdrop,trailer,video }
 */
window.ZXApi = (() => {
  const cfg = window.ZX_CONFIG || {};
  const GENRES = window.ZX_GENRES;
  const genreAr = Object.fromEntries(GENRES.map((g) => [g.key, g.ar]));
  const keyByTmdb = Object.fromEntries(GENRES.map((g) => [g.tmdb, g.key]));
  const tmdbByKey = Object.fromEntries(GENRES.map((g) => [g.key, g.tmdb]));
  const useTmdb = !!cfg.TMDB_KEY;

  /* تطبيع النص العربي/الإنجليزي للبحث */
  const norm = (s) =>
    String(s || "")
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[ً-ٰٟ]/g, "")
      .replace(/[أإآ]/g, "ا")
      .replace(/ى/g, "ي")
      .replace(/ة/g, "ه")
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .replace(/\s+/g, " ")
      .trim();

  /* ============================ الكتالوج المحلي ============================ */
  const local = (() => {
    const all = window.ZX_MOVIES || [];
    const byId = Object.fromEntries(all.map((m) => [m.id, m]));

    const sorters = {
      popular: (a, b) => all.indexOf(a) - all.indexOf(b),
      top: (a, b) => b.rating - a.rating,
      new: (a, b) => b.year - a.year,
      name: (a, b) => a.title.localeCompare(b.title, "ar"),
    };

    const filter = ({ q, genre, sort = "popular" }) => {
      const nq = norm(q);
      return all
        .filter((m) => !genre || m.genres.includes(genre))
        .filter((m) => {
          if (!nq) return true;
          const hay = norm([m.title, m.original, m.director, m.year, m.genres.map((g) => genreAr[g]).join(" ")].join(" "));
          return nq.split(" ").every((w) => hay.includes(w));
        })
        .sort(sorters[sort] || sorters.popular);
    };

    return {
      async home() {
        const sections = [
          { id: "new", title: "أحدث الأفلام", movies: filter({ sort: "new" }).slice(0, 12) },
          { id: "top", title: "الأعلى تقييماً", movies: filter({ sort: "top" }).slice(0, 12) },
        ];
        for (const key of ["action", "scifi", "animation", "drama", "horror", "thriller"]) {
          const movies = filter({ genre: key, sort: "top" });
          if (movies.length >= 3) sections.push({ id: key, title: genreAr[key], genre: key, movies });
        }
        const hero = all.filter((m) => m.rating >= 8.4).slice(0, 5);
        return { hero, sections };
      },
      async browse(opts) {
        return { movies: filter(opts), page: 1, totalPages: 1 };
      },
      async get(id) {
        const movie = byId[id];
        if (!movie) return null;
        const similar = all
          .filter((m) => m.id !== id)
          .map((m) => ({ m, score: m.genres.filter((g) => movie.genres.includes(g)).length }))
          .filter((x) => x.score > 0)
          .sort((a, b) => b.score - a.score || b.m.rating - a.m.rating)
          .slice(0, 12)
          .map((x) => x.m);
        return { movie, similar };
      },
    };
  })();

  /* ================================ TMDB ================================ */
  const tmdb = (() => {
    const IMG = "https://image.tmdb.org/t/p/";

    async function call(path, params = {}) {
      const u = new URL("https://api.themoviedb.org/3" + path);
      u.searchParams.set("api_key", cfg.TMDB_KEY);
      u.searchParams.set("language", cfg.LANG || "ar");
      for (const [k, v] of Object.entries(params)) u.searchParams.set(k, v);
      const r = await fetch(u);
      if (!r.ok) throw new Error("TMDB " + r.status);
      return r.json();
    }

    const map = (x) => ({
      id: "t" + x.id,
      title: x.title || x.original_title,
      original: x.original_title,
      year: (x.release_date || "").slice(0, 4),
      genres: (x.genre_ids || (x.genres || []).map((g) => g.id)).map((i) => keyByTmdb[i]).filter(Boolean),
      rating: x.vote_average ? Math.round(x.vote_average * 10) / 10 : 0,
      runtime: x.runtime || null,
      overview: x.overview || "",
      poster: x.poster_path ? IMG + "w342" + x.poster_path : null,
      backdrop: x.backdrop_path ? IMG + "w1280" + x.backdrop_path : null,
      director: null, cast: [], trailer: null,
    });

    const sortParams = (sort) => {
      const today = new Date().toISOString().slice(0, 10);
      if (sort === "top") return { sort_by: "vote_average.desc", "vote_count.gte": 500 };
      if (sort === "new") return { sort_by: "primary_release_date.desc", "primary_release_date.lte": today, "vote_count.gte": 30 };
      return { sort_by: "popularity.desc" };
    };

    const page = (d) => ({ movies: d.results.map(map), page: d.page, totalPages: Math.min(d.total_pages, 500) });

    return {
      async home() {
        const row = async (id, title, path, params) => ({ id, title, movies: (await call(path, params)).results.map(map).slice(0, 18) });
        const genreRow = (key) => row(key, genreAr[key], "/discover/movie", { with_genres: tmdbByKey[key], ...sortParams("popular") });
        const sections = await Promise.all([
          row("trending", "الأكثر رواجاً هذا الأسبوع", "/trending/movie/week"),
          row("now", "يُعرض الآن", "/movie/now_playing"),
          row("top", "الأعلى تقييماً", "/movie/top_rated"),
          ...["action", "scifi", "animation", "horror", "comedy"].map(genreRow),
        ]);
        sections.forEach((s) => { if (GENRES.some((g) => g.key === s.id)) s.genre = s.id; });
        const hero = sections[0].movies.filter((m) => m.backdrop && m.overview).slice(0, 5);
        return { hero, sections };
      },
      async browse({ q, genre, sort = "popular", page: p = 1 }) {
        if (q) return page(await call("/search/movie", { query: q, page: p }));
        const params = { page: p, ...sortParams(sort) };
        if (genre) params.with_genres = tmdbByKey[genre];
        return page(await call("/discover/movie", params));
      },
      async get(id) {
        const tid = String(id).replace(/^t/, "");
        const d = await call("/movie/" + tid, {
          append_to_response: "videos,credits,similar",
          include_video_language: "ar,en,null",
        });
        const movie = map(d);
        if (!movie.overview) {
          try { movie.overview = (await call("/movie/" + tid, { language: "en-US" })).overview || ""; } catch { /* بدون ملخص */ }
        }
        movie.director = (d.credits?.crew || []).filter((c) => c.job === "Director").map((c) => c.name).join(", ") || null;
        movie.cast = (d.credits?.cast || []).slice(0, 8).map((c) => c.name);
        const vids = (d.videos?.results || []).filter((v) => v.site === "YouTube");
        const pick = vids.find((v) => v.type === "Trailer" && v.official) || vids.find((v) => v.type === "Trailer") || vids[0];
        movie.trailer = pick ? pick.key : null;
        return { movie, similar: (d.similar?.results || []).map(map).slice(0, 12) };
      },
    };
  })();

  const impl = useTmdb ? tmdb : local;
  return {
    usingTmdb: useTmdb,
    genres: GENRES,
    genreName: (key) => genreAr[key] || key,
    home: () => impl.home(),
    browse: (o) => impl.browse(o),
    get: (id) => impl.get(id),
  };
})();
