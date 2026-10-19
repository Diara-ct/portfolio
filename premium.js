(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover)").matches;
  const bar = document.createElement("div"); bar.className = "progress"; document.body.prepend(bar);
  const header = document.querySelector(".site-header");
  const photo = document.querySelector(".hx-photo img");
  const tl = document.querySelector(".timeline");
  const onScroll = () => {
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    header && header.classList.toggle("scrolled", y > 40);
    if (photo && !reduce && y < innerHeight) photo.style.transform = `translateY(${y * 0.12}px)`;
    if (tl) { const r = tl.getBoundingClientRect(); tl.style.setProperty("--p", Math.min(1, Math.max(0, (innerHeight * 0.65 - r.top) / r.height))); }
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  const hx = document.querySelector(".hx");
  const spot = document.querySelector(".hx-spot");
  if (hx && spot && fine && !reduce) {
    hx.addEventListener("pointermove", (e) => {
      const r = hx.getBoundingClientRect();
      spot.style.setProperty("--mx", e.clientX - r.left + "px"); spot.style.setProperty("--my", e.clientY - r.top + "px");
      if (photo) photo.style.marginLeft = (e.clientX / innerWidth - 0.5) * -18 + "px";
    });
  }
  if (fine && !reduce) {
    document.addEventListener("pointermove", (e) => {
      const t = e.target.closest && e.target.closest(".tilt");
      if (!t) return;
      const r = t.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      t.style.transform = `perspective(900px) rotateX(${-y * 5}deg) rotateY(${x * 6}deg) translateY(-4px)`;
    });
    document.addEventListener("pointerout", (e) => { const t = e.target.closest && e.target.closest(".tilt"); if (t) t.style.transform = ""; });
    document.querySelectorAll(".btn, .cv-btn").forEach((b) => {
      b.addEventListener("pointermove", (e) => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px, ${(e.clientY - r.top - r.height / 2) * 0.25}px)`; });
      b.addEventListener("pointerleave", () => (b.style.transform = ""));
    });
  }
  document.querySelectorAll(".card, .skill-card, .tl-item, .panel").forEach((c) => c.classList.add("tilt"));
})();
