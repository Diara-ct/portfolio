(() => {
  const root = document.getElementById("book"); if (!root) return;
  const CANVA = ""; // TODO : lien Canva de l'e-book
  if (CANVA) document.querySelectorAll("[data-canva]").forEach((a) => (a.href = CANVA));
  else document.querySelectorAll("[data-canva-row]").forEach((r) => (r.style.display = "none"));
  const N = 11, pages = Array.from({ length: N }, (_, i) => `assets/ebook/page-${String(i + 1).padStart(2, "0")}.jpg`);
  const label = { fr: "Fin de l'extrait · l'e-book complet est sur Canva", en: "End of the excerpt · the full e-book is on Canva", es: "Fin del extracto · el e-book completo está en Canva" };
  const lang = () => localStorage.getItem("portfolio-lang") || "fr";
  const stage = root.querySelector(".book-stage"), count = root.querySelector("#bcount");
  const prev = root.querySelector("#bprev"), next = root.querySelector("#bnext");
  const mobile = matchMedia("(max-width: 760px)");
  let cur = 0;

  function build() {
    stage.className = "book-stage" + (mobile.matches ? " single" : "");
    if (mobile.matches) {                          // mobile : une page à la fois
      stage.innerHTML = `<div class="sp"><img src="${pages[cur]}" alt="Page ${cur + 1}" /></div>`;
      count.textContent = `${cur + 1} / ${N}`; return;
    }
    // bureau : feuillets 3D. Feuillet k : recto = page 2k+1, verso = page 2k+2 (le dernier verso est la page de fin)
    const leaves = Math.ceil(N / 2);
    let h = '<div class="bk">';
    for (let k = 0; k < leaves; k++) {
      const front = pages[2 * k], back = pages[2 * k + 1];
      h += `<div class="leaf" data-k="${k}"><div class="face front"><img src="${front}" alt="Page ${2 * k + 1}" /></div><div class="face back">${back ? `<img src="${back}" alt="Page ${2 * k + 2}" />` : `<div class="endp"><span>Keyaa</span><small>${label[lang()] || label.fr}</small></div>`}</div></div>`;
    }
    stage.innerHTML = h + "</div>";
    stage.querySelectorAll(".face.front").forEach((f) => f.addEventListener("click", () => go(1)));
    stage.querySelectorAll(".face.back").forEach((f) => f.addEventListener("click", () => go(-1)));
    paint(false);
  }
  function paint(anim = true) {
    if (mobile.matches) { stage.querySelector("img").src = pages[cur]; count.textContent = `${cur + 1} / ${N}`; return; }
    const leaves = stage.querySelectorAll(".leaf"), n = leaves.length;
    const bk = stage.querySelector(".bk"); bk.dataset.state = cur === 0 ? "start" : cur === n ? "end" : "mid";
    leaves.forEach((l, k) => {
      const flipped = k < cur; l.classList.toggle("flipped", flipped);
      l.style.transitionDelay = "0s";
      setTimeout(() => (l.style.zIndex = flipped ? k + 1 : n - k), anim ? 450 : 0);
    });
    const a = 2 * cur, b = 2 * cur + 1;
    count.textContent = cur === 0 ? `1 / ${N}` : cur === n ? `${N} / ${N}` : `${a}–${b} / ${N}`;
  }
  function go(d) {
    const max = mobile.matches ? N - 1 : Math.ceil(N / 2);
    cur = Math.max(0, Math.min(max, cur + d)); paint();
  }
  prev.onclick = () => go(-1); next.onclick = () => go(1);
  addEventListener("keydown", (e) => { if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); });
  let sx = null; stage.addEventListener("touchstart", (e) => (sx = e.touches[0].clientX), { passive: true });
  stage.addEventListener("touchend", (e) => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1); sx = null; });
  mobile.addEventListener("change", () => { cur = 0; build(); });
  build();
})();
