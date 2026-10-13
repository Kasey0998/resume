(function () {
  "use strict";

  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reduceMotion = motionPreference.matches;
  const header = document.querySelector("[data-header]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navMenu = document.querySelector("[data-nav-menu]");
  const navLinks = Array.from(document.querySelectorAll("[data-nav-link]"));
  const sections = Array.from(document.querySelectorAll("[data-section]"));
  const revealItems = Array.from(document.querySelectorAll(".reveal"));
  const timeline = document.querySelector("[data-timeline]");
  const toast = document.querySelector("[data-toast]");
  let toastTimer;
  let roleTimer;
  let cursorFrame;

  function initBootLoader() {
    const loader = document.querySelector("[data-boot-loader]");
    if (!loader) return;

    let bootSeen = false;
    try {
      bootSeen = sessionStorage.getItem("ksBootSeen") === "true";
    } catch (_) {
      // The portfolio remains usable when browser storage is restricted.
    }

    if (reduceMotion || bootSeen) {
      loader.classList.add("is-hidden");
      return;
    }

    document.documentElement.classList.add("js-ready");
    window.setTimeout(() => {
      loader.classList.add("is-hidden");
      try {
        sessionStorage.setItem("ksBootSeen", "true");
      } catch (_) {
        // Storage is an optional enhancement.
      }
    }, 1850);
  }

  function initHeaderState() {
    const setHeader = () => {
      header?.classList.toggle("is-scrolled", window.scrollY > 12);
    };

    setHeader();
    window.addEventListener("scroll", setHeader, { passive: true });
  }

  function initMobileNav() {
    if (!navToggle || !navMenu) return;
    const mobileNav = window.matchMedia("(max-width: 980px)");
    document.documentElement.classList.add("nav-enhanced");

    const setMenu = (isOpen, returnFocus = false) => {
      const open = mobileNav.matches && isOpen;
      navToggle.classList.toggle("is-open", open);
      navMenu.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      navMenu.inert = mobileNav.matches && !open;
      if (mobileNav.matches && !open) {
        navMenu.setAttribute("aria-hidden", "true");
      } else {
        navMenu.removeAttribute("aria-hidden");
      }
      if (returnFocus || (mobileNav.matches && !open && navMenu.contains(document.activeElement))) {
        navToggle.focus();
      }
    };

    setMenu(false);

    navToggle.addEventListener("click", () => {
      setMenu(!navToggle.classList.contains("is-open"));
    });

    navLinks.forEach((link) => link.addEventListener("click", () => {
      if (!mobileNav.matches) return;
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }
      setMenu(false);
    }));

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && navToggle.classList.contains("is-open")) {
        event.preventDefault();
        setMenu(false, true);
      }
    });

    document.addEventListener("click", (event) => {
      if (!navMenu.contains(event.target) && !navToggle.contains(event.target)) setMenu(false);
    });

    document.addEventListener("focusin", (event) => {
      if (!navMenu.contains(event.target) && !navToggle.contains(event.target)) setMenu(false);
    });

    mobileNav.addEventListener("change", () => {
      const focusWasInMenu = navMenu.contains(document.activeElement);
      setMenu(false, mobileNav.matches && focusWasInMenu);
    });
  }

  function initActiveNav() {
    if (!sections.length || !navLinks.length || !("IntersectionObserver" in window)) return;

    const byId = new Map(navLinks.map((link) => [link.getAttribute("href")?.replace("#", ""), link]));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute("data-section");
        navLinks.forEach((link) => {
          link.classList.remove("active");
          link.removeAttribute("aria-current");
        });
        const currentLink = byId.get(id);
        currentLink?.classList.add("active");
        currentLink?.setAttribute("aria-current", "location");
      });
    }, {
      rootMargin: "-35% 0px -55% 0px",
      threshold: 0
    });

    sections.forEach((section) => observer.observe(section));
  }

  function initReveal() {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0,
      rootMargin: "0px 0px -4% 0px"
    });

    document.documentElement.classList.add("reveal-ready");
    revealItems.forEach((item) => observer.observe(item));

    // Keyboard navigation must never land on visually hidden content.
    document.addEventListener("focusin", (event) => {
      event.target.closest(".reveal")?.classList.add("is-visible");
    });
  }

  function initTimeline() {
    if (!timeline) return;
    const timelineItems = Array.from(timeline.querySelectorAll(".timeline-item"));

    if ("IntersectionObserver" in window && !reduceMotion) {
      const itemObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-detected", entry.isIntersecting);
        });
      }, {
        threshold: 0
      });

      timelineItems.forEach((item) => itemObserver.observe(item));
    }

    const updateProgress = () => {
      const rect = timeline.getBoundingClientRect();
      const viewport = window.innerHeight || document.documentElement.clientHeight;
      const start = viewport * 0.78;
      const end = rect.height + viewport * 0.12;
      const progress = Math.min(Math.max((start - rect.top) / end, 0), 1);
      timeline.style.setProperty("--timeline-progress", `${Math.round(progress * 100)}%`);
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
  }

  function initRoleRotator() {
    const roleNode = document.getElementById("roleRotator");
    if (!roleNode || reduceMotion) return;
    // Typing is visual decoration; do not announce every character change.
    roleNode.closest(".role-line")?.setAttribute("aria-live", "off");

    const roles = [
      "AWS CLOUD ENGINEER",
      "DEVOPS ENGINEER",
      "INFRASTRUCTURE AUTOMATION",
      "LINUX SYSTEMS"
    ];
    let roleIndex = 0;
    let charIndex = roles[0].length;
    let deleting = true;

    roleTimer = window.setInterval(() => {
      const current = roles[roleIndex];

      if (deleting) {
        charIndex -= 1;
        if (charIndex <= 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
        }
      } else {
        charIndex += 1;
        if (charIndex >= roles[roleIndex].length) {
          deleting = true;
        }
      }

      roleNode.textContent = roles[roleIndex].slice(0, charIndex || 1);
    }, deleting ? 56 : 78);
  }

  function initCustomCursor() {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!finePointer || reduceMotion) return;

    const dot = document.querySelector("[data-cursor-dot]");
    const ring = document.querySelector("[data-cursor-ring]");
    if (!dot || !ring) return;

    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let ringX = pointerX;
    let ringY = pointerY;

    window.addEventListener("pointermove", (event) => {
      if (reduceMotion || event.pointerType !== "mouse") return;
      document.body.classList.add("cursor-ready");
      pointerX = event.clientX;
      pointerY = event.clientY;
      dot.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0) translate(-50%, -50%)`;
      if (!cursorFrame) cursorFrame = window.requestAnimationFrame(animate);
    }, { passive: true });

    const animate = () => {
      ringX += (pointerX - ringX) * 0.18;
      ringY += (pointerY - ringY) * 0.18;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      cursorFrame = window.requestAnimationFrame(animate);
    };

    const hideCursor = () => {
      window.cancelAnimationFrame(cursorFrame);
      cursorFrame = undefined;
      document.body.classList.remove("cursor-ready", "cursor-active");
    };
    document.documentElement.addEventListener("pointerleave", hideCursor);
    window.addEventListener("blur", hideCursor);

    document.addEventListener("pointerover", (event) => {
      if (event.target.closest("a, button, summary, .cyber-card, .portrait-frame")) {
        document.body.classList.add("cursor-active");
      }
    });

    document.addEventListener("pointerout", (event) => {
      if (event.target.closest("a, button, summary, .cyber-card, .portrait-frame")) {
        document.body.classList.remove("cursor-active");
      }
    });
  }

  function showToast(message) {
    if (!toast) return;
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("is-visible");
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2800);
  }

  function initPlaceholderLinks() {
    const placeholderLinks = Array.from(document.querySelectorAll("a[href$='_URL_HERE']"));
    placeholderLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        showToast("PLACEHOLDER LINK: replace the URL in index.html.");
      });
    });
  }

  function initProjectStudies() {
    const dialog = document.querySelector("[data-project-dialog]");
    if (!dialog || typeof dialog.showModal !== "function") return;

    const title = dialog.querySelector("[data-project-dialog-title]");
    const description = dialog.querySelector("[data-project-dialog-description]");
    const code = dialog.querySelector("[data-project-dialog-code]");
    const tags = dialog.querySelector("[data-project-dialog-tags]");
    const content = dialog.querySelector("[data-project-dialog-content]");
    const email = dialog.querySelector("[data-project-dialog-email]");
    let trigger;

    document.querySelectorAll("[data-project-details]").forEach((details) => {
      const summary = details.querySelector("summary");
      const project = details.closest(".project-window");
      const study = details.querySelector("[data-project-study]");
      const projectEmail = project?.querySelector(".project-actions a[href^='mailto:']");
      if (!summary || !project || !study || !projectEmail) return;

      summary.setAttribute("aria-haspopup", "dialog");
      summary.setAttribute("aria-controls", dialog.id);
      summary.addEventListener("click", (event) => {
        event.preventDefault();
        trigger = summary;
        title.textContent = project.querySelector("h3").textContent;
        description.textContent = project.querySelector("p").textContent;
        code.textContent = project.querySelector(".project-chrome > span").textContent;
        tags.replaceChildren(...Array.from(project.querySelector(".tag-list").children, (tag) => tag.cloneNode(true)));
        content.replaceChildren(study.cloneNode(true));
        content.querySelectorAll("h4").forEach((heading) => heading.setAttribute("aria-level", "3"));
        email.href = projectEmail.href;
        email.setAttribute("aria-label", projectEmail.getAttribute("aria-label"));
        dialog.showModal();
        dialog.scrollTop = 0;
        document.body.classList.add("project-dialog-open");
      });
    });

    dialog.querySelector("[data-project-dialog-close]").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
        dialog.close();
      }
    });
    dialog.addEventListener("close", () => {
      document.body.classList.remove("project-dialog-open");
      trigger?.focus({ preventScroll: true });
    });
  }

  function initFooterYear() {
    const year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();
  }

  function initConsoleMessage() {
    console.log(`
SYSTEM ACCESS GRANTED
KRISHNA.SHARMA // DEVOPS
`);
  }

  initBootLoader();
  initHeaderState();
  initMobileNav();
  initActiveNav();
  initReveal();
  initTimeline();
  initRoleRotator();
  initCustomCursor();
  initPlaceholderLinks();
  initProjectStudies();
  initFooterYear();
  initConsoleMessage();

  motionPreference.addEventListener("change", (event) => {
    reduceMotion = event.matches;
    if (!reduceMotion) return;
    window.clearInterval(roleTimer);
    window.cancelAnimationFrame(cursorFrame);
    cursorFrame = undefined;
    document.body.classList.remove("cursor-ready", "cursor-active");
    revealItems.forEach((item) => item.classList.add("is-visible"));
    const roleNode = document.getElementById("roleRotator");
    if (roleNode) roleNode.textContent = "CLOUD & DEVOPS ENGINEER";
  });
})();
