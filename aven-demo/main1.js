// Version "démo" de main1.js : mêmes comportements, avec des gardes pour les pages où certains éléments n'existent pas.
const $ = (s) => document.querySelector(s);
// Compte à rebours (date cible à adapter au prochain drop)
const targetDate = new Date("2027-01-01T00:00:00").getTime();
setInterval(() => {
  const diff = Math.max(0, targetDate - Date.now());
  const set = (id, v) => { const e = document.getElementById(id); if (e) e.innerText = String(v).padStart(2, "0"); };
  set("days", Math.floor(diff / 864e5)); set("hours", Math.floor((diff / 36e5) % 24));
  set("minutes", Math.floor((diff / 6e4) % 60)); set("seconds", Math.floor((diff / 1000) % 60));
}, 1000);
const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("show")));
document.querySelectorAll(".fade-up, .fade-left, .fade-right").forEach((el) => io.observe(el));
const filters = document.querySelectorAll(".filter");
filters.forEach((f) => f.addEventListener("click", (e) => {
  e.preventDefault(); filters.forEach((x) => x.classList.remove("active")); f.classList.add("active");
  document.querySelectorAll(".product").forEach((p) => (p.style.display = f.dataset.filter === "all" || p.dataset.continent === f.dataset.filter ? "block" : "none"));
}));
const cartEl = $("#avenCart"), ov = $("#overlayCart");
const setCart = (on) => { cartEl && cartEl.classList.toggle("active", on); ov && ov.classList.toggle("active", on); };
window.avenOpenCart = () => setCart(true);
$("#openCart") && $("#openCart").addEventListener("click", (e) => { e.preventDefault(); setCart(true); });
$("#closeCart") && $("#closeCart").addEventListener("click", () => setCart(false));
ov && ov.addEventListener("click", () => setCart(false));
