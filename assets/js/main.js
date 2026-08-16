const themeLink = document.createElement("link");
themeLink.rel = "stylesheet";
themeLink.href = "assets/css/aesthetic.css";
document.head.appendChild(themeLink);

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
    item.style.transitionDelay = `${Math.min(index % 3, 2) * 55}ms`;
    observer.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const progress = document.createElement("div");
progress.setAttribute("aria-hidden", "true");
progress.style.cssText = "position:fixed;top:0;left:0;z-index:999;width:0;height:2px;background:linear-gradient(90deg,#b86c8d,#8d76ad);box-shadow:0 1px 10px rgba(184,108,141,.35);pointer-events:none;transition:width 60ms linear";
document.body.appendChild(progress);

const updateProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
  progress.style.width = `${Math.max(0, Math.min(1, ratio)) * 100}%`;
};
window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();
