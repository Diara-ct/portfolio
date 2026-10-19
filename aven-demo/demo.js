(() => {
  const KEY = "aven_demo_cart", P = window.AVEN_PRODUCTS;
  const get = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
  const put = (c) => { try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {} render(); };
  const eur = (n) => "€" + n.toFixed(2).replace(".", ",");
  function render() {
    const c = get(), ids = Object.keys(c).filter((i) => P[i]);
    document.querySelectorAll(".cart-count").forEach((e) => (e.textContent = ids.reduce((s, i) => s + c[i], 0)));
    const box = document.querySelector(".aven-cart-content"); let total = 0;
    if (box) box.innerHTML = ids.length ? ids.map((i) => { const p = P[i], sub = c[i] * p.price; total += sub;
      return `<div class="aven-cart-item-mini"><img src="${p.images[0]}"><div><p>${p.name}</p><small>x${c[i]}</small></div><span>${eur(sub)}</span></div>`; }).join("") : '<p class="empty">Panier vide</p>';
    const t = document.getElementById("cartTotal"); if (t) t.textContent = total.toFixed(2).replace(".", ",");
    const root = document.getElementById("shopRoot"); if (!root) return;
    if (!ids.length) { root.innerHTML = '<p class="aven-empty">Votre panier est vide.</p>'; return; }
    let tot = 0;
    const items = ids.map((i) => { const p = P[i], sub = c[i] * p.price; tot += sub;
      return `<div class="aven-cart-item"><img src="${p.images[0]}" class="aven-cart-img"><div class="aven-cart-info"><h3>${p.name}</h3><p>${eur(p.price)} · x${c[i]}</p><a href="#" class="aven-remove" data-id="${i}">Supprimer</a></div><div class="aven-cart-price">${sub.toFixed(2)}€</div></div>`; }).join("");
    root.innerHTML = `<div class="aven-cart-layout"><div class="aven-cart-left">${items}</div><div class="aven-cart-right"><h2>Résumé</h2><p>Total</p><h3>${eur(tot)}</h3><button class="aven-checkout" id="checkout">PROCÉDER AU PAIEMENT</button></div></div>`;
    root.querySelectorAll(".aven-remove").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); const k = get(); delete k[a.dataset.id]; put(k); }));
    document.getElementById("checkout").addEventListener("click", () => alert("Démo du portfolio : le paiement n'est pas disponible."));
  }
  // page produit
  const title = document.querySelector(".aven-title");
  if (title) {
    const id = new URLSearchParams(location.search).get("product") || "1", p = P[id] || P[1];
    title.textContent = p.name; document.title = "Aven · " + p.name;
    document.querySelector(".aven-price").textContent = "€" + p.price;
    const track = document.querySelector(".aven-track");
    track.innerHTML = p.images.map((s) => `<img src="${s}" class="aven-slide">`).join("");
    let n = 0; const go = (k) => { n = (k + p.images.length) % p.images.length; track.style.transform = `translateX(-${n * 100}%)`; };
    document.querySelector(".aven-next").onclick = () => go(n + 1); document.querySelector(".aven-prev").onclick = () => go(n - 1);
    if (p.images.length > 1) setInterval(() => go(n + 1), 4000);
    document.querySelector("form").addEventListener("submit", (e) => { e.preventDefault(); const c = get(); c[id] = (c[id] || 0) + 1; put(c); window.avenOpenCart && window.avenOpenCart(); });
  }
  render();
})();
