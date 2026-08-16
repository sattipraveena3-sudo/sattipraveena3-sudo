const themeLink = document.createElement("link");
themeLink.rel = "stylesheet";
themeLink.href = "assets/css/aesthetic.css";
document.head.appendChild(themeLink);

const motionLink = document.createElement("link");
motionLink.rel = "stylesheet";
motionLink.href = "assets/css/cute-motion.css";
document.head.appendChild(motionLink);

const body = document.body;
const currentPage = body.dataset.page;
const menuButton = document.querySelector(".menu-button");
const siteNav = document.querySelector(".site-nav");

document.querySelectorAll("[data-nav]").forEach((link) => {
  if (link.dataset.nav === currentPage) link.setAttribute("aria-current", "page");
});

if (menuButton && siteNav) {
  menuButton.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      siteNav.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
    }
  });
}

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = new Date().getFullYear();
});

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -24px 0px" }
  );
  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    observer.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const progress = document.createElement("div");
progress.setAttribute("aria-hidden", "true");
progress.style.cssText = "position:fixed;top:0;left:0;z-index:999;width:0;height:3px;background:linear-gradient(90deg,#e89fbe,#c9b7ef,#ffd5c7);box-shadow:0 1px 12px rgba(184,108,141,.35);pointer-events:none;transition:width 60ms linear";
document.body.appendChild(progress);

const updateProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
  progress.style.width = `${Math.max(0, Math.min(1, ratio)) * 100}%`;
};
window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Ambient decorative visuals. They are aria-hidden and never interfere with content.
["one", "two", "three"].forEach((name) => {
  const orb = document.createElement("span");
  orb.className = `cute-orb ${name}`;
  orb.setAttribute("aria-hidden", "true");
  body.appendChild(orb);
});

const sparkleLayer = document.createElement("div");
sparkleLayer.className = "sparkle-layer";
sparkleLayer.setAttribute("aria-hidden", "true");
const sparklePositions = [
  [8, 24], [18, 72], [31, 12], [43, 84], [56, 29], [68, 73], [79, 17], [88, 57], [94, 31], [51, 92]
];
sparklePositions.forEach(([left, top]) => {
  const sparkle = document.createElement("span");
  sparkle.className = "sparkle";
  sparkle.style.left = `${left}%`;
  sparkle.style.top = `${top}%`;
  sparkleLayer.appendChild(sparkle);
});
body.appendChild(sparkleLayer);

// Soft section ornaments add visual rhythm without changing page content.
document.querySelectorAll("main .section:nth-of-type(even)").forEach((section) => {
  if (!section.querySelector(".cute-divider")) {
    const divider = document.createElement("div");
    divider.className = "cute-divider";
    divider.setAttribute("aria-hidden", "true");
    divider.textContent = "✦ ♡ ✦";
    section.prepend(divider);
  }
});

// Cursor aura only for fine-pointer desktop devices.
if (!reducedMotion && window.matchMedia("(pointer:fine)").matches) {
  const glow = document.createElement("div");
  glow.className = "cursor-glow";
  glow.setAttribute("aria-hidden", "true");
  body.appendChild(glow);
  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;

  window.addEventListener("pointermove", (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
  }, { passive: true });

  const animateGlow = () => {
    currentX += (targetX - currentX) * 0.12;
    currentY += (targetY - currentY) * 0.12;
    glow.style.left = `${currentX}px`;
    glow.style.top = `${currentY}px`;
    requestAnimationFrame(animateGlow);
  };
  animateGlow();
}

// Give primary cards a subtle pointer-reactive tilt on desktop.
if (!reducedMotion && window.matchMedia("(pointer:fine)").matches) {
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-6px) perspective(900px) rotateX(${y * -2.2}deg) rotateY(${x * 2.2}deg)`;
    });
    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}
