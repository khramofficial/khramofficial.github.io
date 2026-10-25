/* Khram site behaviour: mobile menu, product galleries, copy button, anonymous visit counter.
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
  window.matchMedia("(min-width: 768px)").addEventListener("change", function (mq) {
    if (mq.matches) setMenu(false);
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

/* Home page: the sky-to-sea journey.
   - Tilts the fixed painting down as you scroll. Each section says which part of the painting it
     belongs to (data-sky-stop, 0 = top of the sky, 1 = deep water); between sections the painting
     moves evenly, so every section meets the same sky on any screen size.
   - Night falls over the painting while a reading section (.page-k) is on screen and clears again
     between them (--sky-dim on .sky), so text never needs a box behind it.
   - Header turns solid once you leave the top. Sections fade up gently as they arrive.
   Reduced motion: the painting stays still and nothing animates. */
(function () {
  "use strict";
  var doc = document;
  var col = doc.querySelector("[data-sky-col]");
  var sky = doc.querySelector(".sky");
  var panels = [];
  var header = doc.querySelector(".site-header");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var stops = [];
  var travel = 0;
  var ticking = false;

  function measure() {
    if (!col) return;
    var vh = window.innerHeight;
    travel = Math.max(0, col.offsetHeight - vh);
    var maxScroll = Math.max(1, doc.documentElement.scrollHeight - vh);
    panels = Array.prototype.slice.call(doc.querySelectorAll("[data-journey] .page-k"));
    var list = [];
    doc.querySelectorAll("[data-sky-stop]").forEach(function (el) {
      var r = el.getBoundingClientRect();
      var top = r.top + window.scrollY;
      var at = Math.min(maxScroll, Math.max(0, top + r.height / 2 - vh / 2));
      if (el.getAttribute("data-sky-stop") === "0") at = 0;
      list.push([at, parseFloat(el.getAttribute("data-sky-stop")) || 0]);
    });
    list.sort(function (a, b) {
      return a[0] - b[0];
    });
    stops = [];
    list.forEach(function (s) {
      var last = stops[stops.length - 1];
      if (last && s[0] <= last[0] + 1) {
        last[1] = Math.max(last[1], s[1]);
        return;
      }
      if (last && s[1] < last[1]) s[1] = last[1];
      stops.push(s);
    });
  }

  function progress(y) {
    if (!stops.length) return 0;
    if (y <= stops[0][0]) return stops[0][1];
    for (var i = 1; i < stops.length; i++) {
      if (y <= stops[i][0]) {
        var a = stops[i - 1];
        var b = stops[i];
        return a[1] + ((b[1] - a[1]) * (y - a[0])) / (b[0] - a[0]);
      }
    }
    return stops[stops.length - 1][1];
  }

  function update() {
    ticking = false;
    var y = window.scrollY;
    if (header) header.classList.toggle("is-scrolled", y > 40);
    if (!col) return;
    var p = reduce.matches ? 0 : progress(y);
    col.style.setProperty("--sky-y", (-p * travel).toFixed(1) + "px");
    if (sky) sky.style.setProperty("--sky-dim", dimFor(window.innerHeight).toFixed(3));
  }

  /* How much of the screen a reading section fills: 0 = none, 1 = a third or more of what it could. */
  function dimFor(vh) {
    var cover = 0;
    for (var i = 0; i < panels.length; i++) {
      var r = panels[i].getBoundingClientRect();
      var seen = Math.min(r.bottom, vh) - Math.max(r.top, 0);
      if (seen > 0) cover = Math.max(cover, seen / Math.min(vh, r.height || 1));
    }
    var t = Math.min(1, cover / 0.35);
    return t * t * (3 - 2 * t);
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }

  function refresh() {
    measure();
    update();
  }

  if (col) {
    refresh();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", refresh);
    window.addEventListener("load", refresh);
    if (reduce.addEventListener) reduce.addEventListener("change", refresh);
    if ("ResizeObserver" in window) {
      var journey = doc.querySelector("[data-journey]");
      if (journey) new ResizeObserver(refresh).observe(journey);
    }
  } else if (header) {
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* gentle reveals */
  var items = doc.querySelectorAll(".reveal");
  if (items.length && "IntersectionObserver" in window && !reduce.matches) {
    doc.documentElement.classList.add("reveal-ready");
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    items.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight) el.classList.add("is-in");
      io.observe(el);
    });
  }
})();

/* Home page, phones: the slim "Get INDIGO" bar. It shows once the hero has scrolled away and hides
   again while the INDIGO buy block, the closing or the footer is on screen, or the menu is open. */
(function () {
  "use strict";
  var doc = document;
  var bar = doc.querySelector("[data-buy-bar]");
  if (!bar || !("IntersectionObserver" in window)) return;
  var watched = [doc.querySelector(".hero-sky"), doc.getElementById("indigo"), doc.querySelector(".closing-sea"), doc.querySelector("footer")].filter(Boolean);
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
