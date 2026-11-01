/* صفحة قائمتي: تبويبان — «أريد أشوفها» و«شفتها» */
(() => {
  const { $, $$ } = ZXUI;
  const app = $("#app");
  let tab = new URLSearchParams(location.search).get("tab") === "seen" ? "seen" : "list";

  ZXUI.mountChrome("list");
  document.title = "قائمتي — ZX-TV";

  const bucketOf = (t) => (t === "seen" ? "watched" : "list");

  const render = () => {
    const items = tab === "seen" ? ZXStore.watched() : ZXStore.list();
    const nList = ZXStore.list().length, nSeen = ZXStore.watched().length;
    ZXUI.remember(items);

    const empty = tab === "seen"
      ? "ما علّمت أي فلم كمشاهَد لهسه. افتح صفحة أي فلم واضغط «علّمه شفته»."
      : "قائمتك فاضية. اضغط على علامة + فوق أي فلم حتى يضاف هنا.";

    app.innerHTML = `
      <div class="wrap page-top">
        <div class="browse-head"><h1>قائمتي</h1></div>
        <div class="tabs" role="tablist">
          <button type="button" role="tab" aria-selected="${tab === "list"}" class="${tab === "list" ? "on" : ""}" data-tab="list">أريد أشوفها <span class="count">${nList}</span></button>
          <button type="button" role="tab" aria-selected="${tab === "seen"}" class="${tab === "seen" ? "on" : ""}" data-tab="seen">شفتها <span class="count">${nSeen}</span></button>
        </div>
        ${items.length
          ? `<div class="grid">${items.map((m) => `
              <div class="cell">
                ${ZXUI.card(m)}
                <button class="remove" type="button" data-remove="${ZXUI.esc(m.id)}">${icon("trash")}شيله</button>
              </div>`).join("")}</div>`
          : `<div class="empty"><p>${empty}</p><a class="btn primary" href="index.html?view=all">تصفّح الأفلام</a></div>`}
      </div>`;
  };

  app.addEventListener("click", (e) => {
    const t = e.target.closest("[data-tab]");
    if (t) { tab = t.dataset.tab; history.replaceState(null, "", tab === "seen" ? "?tab=seen" : "mylist.html"); return render(); }
    const r = e.target.closest("[data-remove]");
    if (r) { ZXStore.remove(bucketOf(tab), r.dataset.remove); ZXUI.toast("انشال"); }
  });

  // أي تغيير بالقائمة (من هنا أو تبويب ثاني) يعيد الرسم
  addEventListener("zx:store", render);
  addEventListener("storage", render);

  render();
})();
