// ===================== NAVBAR: hide on scroll down, show on scroll up =====================
(() => {
  const nav = document.getElementById("siteNav");
  if (!nav) return;

  let lastY = window.scrollY;
  let downAccum = 0;

  // tuning
  const topLock = 10;
  const jitter = 6;
  const hideAfter = 90;

  const setOpaque = () => nav.classList.remove("is-translucent");
  const setTranslucent = () => nav.classList.add("is-translucent");

  window.addEventListener(
    "scroll",
    () => {
      // FIX: se menu aperto, non toccare la nav
      if (document.body.classList.contains("menu-open")) return;

      const y = window.scrollY;

      if (y < topLock) {
        nav.classList.remove("is-hidden");
        setOpaque();
        downAccum = 0;
        lastY = y;
        return;
      }

      const delta = y - lastY;
      if (Math.abs(delta) <= jitter) return;

      if (delta > 0) {
        downAccum += delta;
        setOpaque();
        if (downAccum >= hideAfter) nav.classList.add("is-hidden");
        lastY = y;
        return;
      }

      if (delta < 0) {
        downAccum = 0;
        nav.classList.remove("is-hidden");
        setTranslucent();
        lastY = y;
      }
    },
    { passive: true }
  );
})();

// ===================== MOBILE MENU (burger) fullscreen =====================
(() => {
  const burger = document.getElementById("burger");
  const menu = document.getElementById("mobileMenu"); // ora fuori dall'header
  const nav = document.getElementById("siteNav");
  if (!burger || !menu) return;

  const closeBtn = document.getElementById("mobileClose");

  const lockScroll = (lock) => {
    document.documentElement.style.overflow = lock ? "hidden" : "";
    document.body.style.overflow = lock ? "hidden" : "";
  };

  const closeMenu = () => {
    menu.hidden = true;
    burger.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
    lockScroll(false);
  };

  const openMenu = () => {
    // sicurezza: nav non deve restare “nascosta” mentre apri il menu
    nav?.classList.remove("is-hidden");

    menu.hidden = false;
    burger.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-open");
    lockScroll(true);
  };

  burger.addEventListener("click", () => {
    const isOpen = !menu.hidden;
    if (isOpen) closeMenu();
    else openMenu();
  });

  closeBtn?.addEventListener("click", closeMenu);

  // chiudi cliccando un link nel menu
  menu.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (a) closeMenu();
  });

  // ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  // se vai a desktop, chiudi menu e sblocca scroll
  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 981px)").matches) closeMenu();
  });
})();

// ===================== NAV SOCIAL POPOVER (riusabile) =====================
function initNavSocial(rootId, btnId, popId) {
  const root = document.getElementById(rootId);
  const btn = document.getElementById(btnId);
  const pop = document.getElementById(popId);

  if (!root || !btn || !pop) return;

  const isOpen = () => root.classList.contains("is-open");

  const open = () => {
    root.classList.add("is-open");
    btn.setAttribute("aria-expanded", "true");
  };

  const close = () => {
    root.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
  };

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    isOpen() ? close() : open();
  });

  // click fuori => chiudi
  document.addEventListener("click", (e) => {
    if (!isOpen()) return;
    if (root.contains(e.target)) return;
    close();
  });

  // ESC => chiudi
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });

  // click su un link => chiudi
  pop.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (a) close();
  });
}

(() => {
  initNavSocial("navSocial", "navSocialBtn", "navSocialPop");
  initNavSocial("navSocialMenu", "navSocialBtnMenu", "navSocialPopMenu");
})();

// ===================== BREAKING: autoplay carousel on mobile (snap-friendly) =====================
(() => {
  const track = document.querySelector(".breaking__grid");
  if (!track) return;

  const mq = window.matchMedia("(max-width: 820px)");
  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let timer = null;

  const stop = () => {
    if (timer) clearInterval(timer);
    timer = null;
  };

  const start = () => {
    stop();
    if (!mq.matches) return;
    if (prefersReduced) return;

    // se non è scrollabile, non partire
    if (track.scrollWidth <= track.clientWidth + 2) return;

    const tickMs = 2600; // ogni 2.6s
    timer = setInterval(() => {
      // se l’utente sta interagendo (touch/drag), non forzare
      if (track.matches(":active")) return;

      const max = track.scrollWidth - track.clientWidth;
      const jump = Math.max(1, Math.floor(track.clientWidth * 0.82)); // ~una card

      // loop
      if (track.scrollLeft >= max - 4) {
        track.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        track.scrollBy({ left: jump, behavior: "smooth" });
      }
    }, tickMs);
  };

  // pausa su interazione
  const pause = () => stop();
  const resume = () => start();

  track.addEventListener("mouseenter", pause);
  track.addEventListener("mouseleave", resume);
  track.addEventListener("touchstart", pause, { passive: true });
  track.addEventListener("touchend", resume, { passive: true });

  // re-check su resize e quando cambia breakpoint
  if (mq.addEventListener) mq.addEventListener("change", start);
  else if (mq.addListener) mq.addListener(start);

  window.addEventListener("resize", start);

  // avvio (dopo layout)
  requestAnimationFrame(() => start());
})();

// ===================== FOOTER YEAR =====================
(() => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();

// ===================== COOKIE LOGIC =====================
(() => {
  const cookieBanner = document.getElementById("cookieBanner");
  const acceptBtn = document.getElementById("acceptCookies");
  const rejectBtn = document.getElementById("rejectCookies");

  const showBanner = () => {
    if (!cookieBanner) return;
    if (!localStorage.getItem("lyme_cookie_choice")) {
      cookieBanner.style.display = "block";
    }
  };

  const acceptCookies = () => {
    localStorage.setItem("lyme_cookie_choice", "accepted");
    if (cookieBanner) cookieBanner.style.display = "none";
  };

  const rejectCookies = () => {
    localStorage.setItem("lyme_cookie_choice", "rejected");
    if (cookieBanner) cookieBanner.style.display = "none";
  };

  acceptBtn?.addEventListener("click", acceptCookies);
  rejectBtn?.addEventListener("click", rejectCookies);

  showBanner();
})();
