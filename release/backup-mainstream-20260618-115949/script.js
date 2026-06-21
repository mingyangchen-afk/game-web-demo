const header = document.querySelector("[data-header]");
const navLinks = Array.from(document.querySelectorAll(".site-nav a[href^='#']"));
const navTargets = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
const artworkItems = Array.from(document.querySelectorAll("[data-kind]"));
const previewItems = Array.from(document.querySelectorAll("[data-full]"));
const modal = document.querySelector("[data-modal]");
const modalImage = document.querySelector("[data-modal-image]");
const modalClose = document.querySelector("[data-modal-close]");

const setHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 8);
};

const setActiveNav = (id) => {
  navLinks.forEach((link) => {
    const active = link.getAttribute("href") === `#${id}`;
    link.classList.toggle("is-active", active);
    if (active) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

const setFilter = (kind) => {
  filterButtons.forEach((button) => {
    const active = button.dataset.filter === kind;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  artworkItems.forEach((item) => {
    const visible = kind === "all" || item.dataset.kind === kind;
    item.classList.toggle("is-hidden", !visible);
  });
};

const showPreview = (item) => {
  const src = item.dataset.full;
  const img = item.querySelector("img");
  if (!src || !img || !modal || !modalImage) return;

  modalImage.src = src;
  modalImage.alt = img.alt;
  modal.showModal();
};

filterButtons.forEach((button) => {
  button.addEventListener("click", () => setFilter(button.dataset.filter));
});

previewItems.forEach((item) => {
  item.tabIndex = 0;
  item.setAttribute("role", "button");
  item.addEventListener("click", () => showPreview(item));
  item.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      showPreview(item);
    }
  });
});

modalClose?.addEventListener("click", () => modal.close());

modal?.addEventListener("click", (event) => {
  if (event.target === modal) modal.close();
});

modal?.addEventListener("close", () => {
  if (!modalImage) return;
  modalImage.removeAttribute("src");
  modalImage.alt = "";
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target?.id) setActiveNav(visible.target.id);
    },
    {
      rootMargin: "-42% 0px -48% 0px",
      threshold: [0.1, 0.24, 0.4]
    }
  );

  navTargets.forEach((section) => observer.observe(section));
} else {
  setActiveNav("overview");
}

const syncNavWithHash = () => {
  const id = window.location.hash.slice(1);
  if (id && navTargets.some((target) => target.id === id)) {
    setActiveNav(id);
  }
};

syncNavWithHash();
window.addEventListener("hashchange", syncNavWithHash);
window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();
setFilter("all");
