/* =====================================================================
   HOTEL UNION — interactions
   ===================================================================== */
(function () {
  "use strict";

  /* ---- Language: apply on load ---- */
  document.addEventListener("DOMContentLoaded", () => {
    if (window.HU_I18N) window.HU_I18N.applyLang(window.HU_I18N.getLang());

    /* Language dropdown */
    document.querySelectorAll("[data-lang]").forEach(wrap => {
      const btn = wrap.querySelector("[data-lang-toggle]");
      btn && btn.addEventListener("click", e => { e.stopPropagation(); wrap.classList.toggle("open"); });
      wrap.querySelectorAll("[data-lang-option]").forEach(opt => {
        opt.addEventListener("click", () => {
          window.HU_I18N.applyLang(opt.getAttribute("data-lang-option"));
          document.querySelectorAll("[data-lang]").forEach(w => w.classList.remove("open"));
        });
      });
    });
    document.addEventListener("click", () =>
      document.querySelectorAll("[data-lang]").forEach(w => w.classList.remove("open")));

    /* Header solid-on-scroll */
    const header = document.querySelector(".site-header");
    const onScroll = () => header && header.classList.toggle("is-solid",
      window.scrollY > (document.querySelector(".hero, .page-hero") ? 80 : 10));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    /* Mobile nav */
    const toggle = document.querySelector(".nav-toggle");
    const panel = document.querySelector(".mobile-nav");
    if (toggle && panel) {
      const setOpen = open => {
        panel.classList.toggle("open", open);
        toggle.setAttribute("aria-expanded", open);
        document.body.style.overflow = open ? "hidden" : "";
      };
      toggle.addEventListener("click", () => setOpen(!panel.classList.contains("open")));
      panel.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setOpen(false)));
    }

    /* Scroll reveal */
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    document.querySelectorAll(".reveal").forEach(el => io.observe(el));

    /* Booking bar: sensible min dates */
    const ci = document.querySelector('input[name="checkin"]');
    const co = document.querySelector('input[name="checkout"]');
    if (ci && co) {
      const today = new Date(); const tmw = new Date(today.getTime() + 864e5);
      const iso = d => d.toISOString().slice(0, 10);
      ci.min = iso(today); co.min = iso(tmw);
      if (!ci.value) ci.value = iso(today);
      if (!co.value) co.value = iso(tmw);
      ci.addEventListener("change", () => {
        const next = new Date(new Date(ci.value).getTime() + 864e5);
        co.min = iso(next); if (co.value <= ci.value) co.value = iso(next);
      });
    }

    /* Booking submit → friendly nudge to reservations page */
    document.querySelectorAll("[data-bookform]").forEach(f => {
      f.addEventListener("submit", e => {
        e.preventDefault();
        window.location.href = f.getAttribute("data-target") || "booking.html";
      });
    });

    /* Lightbox gallery */
    const lbItems = Array.from(document.querySelectorAll("[data-lightbox]"));
    if (lbItems.length) {
      const lb = document.createElement("div");
      lb.className = "lightbox";
      lb.innerHTML =
        '<button class="lightbox__close" aria-label="Close">×</button>' +
        '<button class="lightbox__nav lightbox__nav--prev" aria-label="Previous">‹</button>' +
        '<img alt="">' +
        '<button class="lightbox__nav lightbox__nav--next" aria-label="Next">›</button>';
      document.body.appendChild(lb);
      const img = lb.querySelector("img");
      let idx = 0;
      const srcs = lbItems.map(a => a.getAttribute("href") || a.dataset.full || a.querySelector("img").src);
      const show = i => { idx = (i + srcs.length) % srcs.length; img.src = srcs[idx]; };
      const open = i => { show(i); lb.classList.add("open"); document.body.style.overflow = "hidden"; };
      const close = () => { lb.classList.remove("open"); document.body.style.overflow = ""; };
      lbItems.forEach((a, i) => a.addEventListener("click", e => { e.preventDefault(); open(i); }));
      lb.querySelector(".lightbox__close").addEventListener("click", close);
      lb.querySelector(".lightbox__nav--prev").addEventListener("click", e => { e.stopPropagation(); show(idx - 1); });
      lb.querySelector(".lightbox__nav--next").addEventListener("click", e => { e.stopPropagation(); show(idx + 1); });
      lb.addEventListener("click", e => { if (e.target === lb) close(); });
      document.addEventListener("keydown", e => {
        if (!lb.classList.contains("open")) return;
        if (e.key === "Escape") close();
        if (e.key === "ArrowLeft") show(idx - 1);
        if (e.key === "ArrowRight") show(idx + 1);
      });
    }

    /* Contact form: inline success */
    const cf = document.querySelector("[data-contactform]");
    if (cf) cf.addEventListener("submit", e => {
      e.preventDefault();
      const dict = window.HU_I18N ? (window.I18N || {}) : {};
      const lang = window.HU_I18N ? window.HU_I18N.getLang() : "en";
      const msg = (window.I18N && window.I18N[lang] && window.I18N[lang]["contact.success"]) ||
        "Thank you — your enquiry has been noted.";
      const box = document.createElement("div");
      box.style.cssText = "background:#1C352C;color:#FCF9F2;padding:22px 24px;border-radius:2px;margin-top:10px;font-size:.98rem;border-left:3px solid #BF9A4A";
      box.textContent = msg;
      cf.reset(); cf.appendChild(box);
      box.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    /* Year + cookie */
    document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());
    const cookie = document.querySelector(".cookie");
    if (cookie && !localStorage.getItem("hu_cookie")) {
      setTimeout(() => cookie.classList.add("show"), 1200);
      cookie.querySelector("[data-cookie-ok]").addEventListener("click", () => {
        localStorage.setItem("hu_cookie", "1"); cookie.classList.remove("show");
      });
    }
  });

  /* expose dict for success message */
  window.addEventListener("load", () => { if (typeof I18N !== "undefined") window.I18N = I18N; });
})();
