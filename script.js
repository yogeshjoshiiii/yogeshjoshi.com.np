(() => {
  const menu = document.querySelector("#site-menu");
  const toggle = document.querySelector(".menu-toggle");
  const year = document.querySelector("#year");

  if (year) year.textContent = new Date().getFullYear();

  const closeMenu = () => {
    if (!menu || !toggle) return;
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded","false");
    toggle.setAttribute("aria-label","Open menu");
    menu.setAttribute("aria-hidden","true");
    document.body.classList.remove("menu-open");
  };

  const openMenu = () => {
    menu.classList.add("open");
    toggle.setAttribute("aria-expanded","true");
    toggle.setAttribute("aria-label","Close menu");
    menu.setAttribute("aria-hidden","false");
    document.body.classList.add("menu-open");
  };

  if (menu && toggle) {
    toggle.addEventListener("click", () => {
      toggle.getAttribute("aria-expanded") === "true" ? closeMenu() : openMenu();
    });
    menu.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") closeMenu();
    });
  }

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, {threshold:.12, rootMargin:"0px 0px -40px 0px"});
    revealItems.forEach(el => observer.observe(el));
  } else {
    revealItems.forEach(el => el.classList.add("is-visible"));
  }
})();