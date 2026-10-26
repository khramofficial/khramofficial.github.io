/* Khram site behaviour: mobile menu, product galleries, copy button, anonymous visit counter, home buy bar.
   Plain JavaScript on purpose: every page works without it, this only adds comfort. */
(function () {
  "use strict";
  var doc = document;

  /* ---------- mobile menu ---------- */
  function menuParts() {
    return { button: doc.querySelector("[data-menu-button]"), panel: doc.querySelector("[data-menu-panel]") };
  }
  function setMenu(open) {
    var m = menuParts();
    if (!m.button || !m.panel) return;
    m.button.setAttribute("aria-expanded", String(open));
    m.panel.classList.toggle("is-open", open);
  }
  doc.addEventListener("click", function (e) {
    var t = e.target;
    if (!t.closest) return;
    if (t.closest("[data-menu-button]")) {
      var b = menuParts().button;
      setMenu(b && b.getAttribute("aria-expanded") !== "true");
      return;
    }
    if (t.closest("[data-menu-panel] a")) setMenu(false);
  });
  doc.addEventListener("keydown", function (e) {
    var b = menuParts().button;
    if (e.key === "Escape" && b && b.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      b.focus();
    }
  });
  window.matchMedia("(min-width: 1024px)").addEventListener("change", function (mq) {
    if (mq.matches) setMenu(false);
  });

  /* ---------- shop dropdown: close on outside click, Escape, or after choosing ---------- */
  doc.addEventListener("click", function (e) {
    var open = doc.querySelectorAll("[data-shop-menu][open]");
    open.forEach(function (d) {
      if (!d.contains(e.target) || (e.target.closest && e.target.closest(".shop-panel a"))) d.removeAttribute("open");
    });
  });
  doc.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    doc.querySelectorAll("[data-shop-menu][open]").forEach(function (d) {
      d.removeAttribute("open");
      var s = d.querySelector("summary");
      if (s) s.focus();
    });
  });

  /* ---------- product galleries ---------- */
  doc.addEventListener("click", function (e) {
    var thumb = e.target.closest && e.target.closest("[data-gallery-thumb]");
    if (!thumb) return;
    var gallery = thumb.closest("[data-gallery]");
    var main = gallery && gallery.querySelector("[data-gallery-main]");
    if (!main) return;
    main.src = thumb.getAttribute("data-src");
    main.alt = thumb.getAttribute("data-alt") || "";
    main.width = Number(thumb.getAttribute("data-width")) || main.width;
    main.height = Number(thumb.getAttribute("data-height")) || main.height;
    gallery.querySelectorAll("[data-gallery-thumb]").forEach(function (t) {
      t.setAttribute("aria-pressed", String(t === thumb));
    });
    var status = gallery.querySelector("[data-gallery-status]");
    if (status) status.textContent = thumb.getAttribute("aria-label") || "";
  });

  /* ---------- copy buttons (shown only when JavaScript runs) ---------- */
  function initCopy() {
    doc.querySelectorAll("[data-copy]").forEach(function (btn) {
      if (btn.__khram) return;
      btn.__khram = true;
      btn.hidden = false;
      btn.addEventListener("click", function () {
        var text = btn.getAttribute("data-copy") || "";
        var status = btn.parentElement && btn.parentElement.querySelector("[data-copy-status]");
        function say(msg) {
          if (status) status.textContent = msg;
        }
        function fallback() {
          var el = btn.closest(".frame") && btn.closest(".frame").querySelector(".select-all");
          if (el && window.getSelection) {
            var r = doc.createRange();
            r.selectNodeContents(el);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(r);
          }
          say(btn.getAttribute("data-selected") || "");
        }
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(function () {
              say(btn.getAttribute("data-copied") || "Copied.");
            }, fallback);
          } else fallback();
        } catch {
          fallback();
        }
      });
    });
  }
  initCopy();
  new MutationObserver(initCopy).observe(doc.body, { childList: true, subtree: true });

  /* ---------- anonymous visit counter ----------
     No cookies. A random id that changes every day, a per-tab session id, page path,
     referring domain, device type, browser language and time zone. No IP is stored. */
  var CFG = window.KHRAM_CFG;
  function rid() {
    try {
      if (crypto && crypto.randomUUID) return crypto.randomUUID().replace(/-/g, "");
    } catch {}
    return Math.random().toString(36).slice(2) + Date.now().toString(36) + Math.random().toString(36).slice(2);
  }
  function visitorId() {
    var today = new Date().toISOString().slice(0, 10);
    try {
      var v = JSON.parse(localStorage.getItem("khram_v") || "null");
      if (v && v.d === today && v.id) return v.id;
      v = { d: today, id: rid() };
      localStorage.setItem("khram_v", JSON.stringify(v));
      return v.id;
    } catch {
      return rid();
    }
  }
  function sessionId() {
    try {
      var s = sessionStorage.getItem("khram_s");
      if (!s) {
        s = rid();
        sessionStorage.setItem("khram_s", s);
      }
      return s;
    } catch {
      return null;
    }
  }
  function device() {
    var ua = navigator.userAgent || "";
    var short = Math.min(screen.width, screen.height);
    if (/iPad|Tablet/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return "tablet";
    if (/Mobi|Android|iPhone/i.test(ua)) return short >= 600 ? "tablet" : "mobile";
    return "desktop";
  }
  function referrerHost() {
    if (!doc.referrer) return null;
    try {
      var h = new URL(doc.referrer).hostname.replace(/^www\./, "");
      return h === location.hostname ? null : h;
    } catch {
      return null;
    }
  }
  function ignored() {
    if (!CFG || navigator.webdriver) return true;
    // search engines, link scanners and headless browsers (the database filters these too)
    var ua = navigator.userAgent || "";
    if (/bot|crawl|spider|slurp|google-inspectiontool|googleother|lighthouse|headlesschrome|phantomjs|facebookexternalhit|meta-externalagent|bingpreview/i.test(ua) && !/cubot/i.test(ua)) return true;
    if (/@posix/.test(navigator.language || "")) return true;
    if (location.pathname.indexOf("/admin") === 0) return true;
    try {
      return localStorage.getItem("khram_ignore") === "1";
    } catch {
      return false;
    }
  }
  function send(kind, label) {
    if (ignored()) return;
    var q = new URLSearchParams(location.search);
    var tz = null;
    try {
      tz = Intl.DateTimeFormat().resolvedOptions().timeZone || null;
    } catch {}
    try {
      fetch(CFG.url + "/rest/v1/rpc/track", {
        method: "POST",
        keepalive: true,
        headers: { apikey: CFG.key, "Content-Type": "application/json" },
        body: JSON.stringify({
          p_kind: kind,
          p_path: location.pathname,
          p_visitor: visitorId(),
          p_label: label || null,
          p_referrer: kind === "view" ? referrerHost() : null,
          p_session: sessionId(),
          p_device: device(),
          p_lang: navigator.language || null,
          p_tz: tz,
          p_utm: q.get("utm_source"),
        }),
      }).catch(function () {});
    } catch {}
  }
  send("view");

  /* Clicks on buy buttons and links to the stores */
  doc.addEventListener(
    "click",
    function (e) {
      var a = e.target.closest && e.target.closest("a[href]");
      if (!a) return;
      var label = a.getAttribute("data-track");
      var url = a.getAttribute("href") || "";
      if (!label && /gumroad\.com|amazon\.|etsy\.com|lulu\.com/i.test(url)) {
        var holder = a.closest("[data-product]");
        var store = /gumroad/i.test(url) ? "Gumroad" : /amazon\./i.test(url) ? "Amazon" : /etsy/i.test(url) ? "Etsy" : "Lulu";
        label = (holder ? holder.getAttribute("data-product") : "link") + ":" + store;
      }
      if (label) send("click", label);
    },
    true,
  );
})();

/* Home page, phones and tablets: the slim "Get INDIGO" bar. It shows once the hero has scrolled away and hides
   again while the formats (where it would point) or the footer is on screen, or while the menu is open. */
(function () {
  "use strict";
  var doc = document;
  var bar = doc.querySelector("[data-buy-bar]");
  if (!bar || !("IntersectionObserver" in window)) return;
  var watched = [doc.getElementById("hero"), doc.getElementById("formats"), doc.querySelector("footer")].filter(Boolean);
  var onScreen = new Set();
  function update() {
    var menuOpen = !!doc.querySelector(".mobile-menu.is-open");
    bar.classList.toggle("is-shown", onScreen.size === 0 && !menuOpen);
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) onScreen.add(e.target);
      else onScreen.delete(e.target);
    });
    update();
  });
  watched.forEach(function (el) {
    io.observe(el);
  });
  doc.addEventListener("click", function () {
    setTimeout(update, 0);
  });
})();
