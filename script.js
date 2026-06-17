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
const videoButtons = Array.from(document.querySelectorAll("[data-video]"));
const chapterButtons = Array.from(document.querySelectorAll("[data-chapter]"));
const chapterPanel = document.querySelector(".video-chapters");
const featureVideo = document.querySelector("[data-feature-video]");
const featureCaption = document.querySelector("[data-feature-caption]");

const videos = [
  {
    src: "https://github.com/mingyangchen-afk/game-web-demo/releases/download/site-media/garena-seedance-gold-sutra-cg-trailer-bilingual.mp4",
    poster: "assets/images/campaign/mural-threshold-extraction.png",
    caption: "CG 双语预告片：先建立金经、黑沙、雷鼓与三兔门的世界观情绪。"
  },
  {
    src: "assets/videos/mingsha-gate-playable-demo-delivery.mp4",
    poster: "assets/videos/mingsha-gate-playable-demo-poster.jpg",
    caption: "清晰版玩法演示：大字号字幕、低字量信息卡、按章节展示三人小队一局闭环。",
    chapters: true
  },
  {
    src: "assets/videos/mingsha-gate-sound-gameplay-demo-delivery.mp4",
    poster: "assets/videos/mingsha-gate-sound-gameplay-demo-poster.jpg",
    caption: "声音机制：风沙底噪、遗物铜铃、敌人噪音和门区三段共鸣。"
  },
  {
    src: "assets/videos/mingsha-gate-showcase-production-video-delivery.mp4",
    poster: "assets/videos/mingsha-gate-showcase-production-video-poster.png",
    caption: "制作拆解：核心公式、一局循环、节点任务和制作优先级。"
  }
];

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

const setVideo = (index) => {
  const item = videos[index];
  if (!item || !featureVideo || !featureCaption) return;

  featureVideo.pause();
  featureVideo.src = item.src;
  featureVideo.poster = item.poster;
  featureVideo.dataset.activeVideo = String(index);
  featureCaption.textContent = item.caption;
  featureVideo.load();

  videoButtons.forEach((button) => {
    const active = Number(button.dataset.video) === index;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  const supportsChapters = Boolean(item.chapters);
  chapterPanel?.classList.toggle("is-muted", !supportsChapters);
  chapterPanel?.setAttribute("data-active-video-has-chapters", String(supportsChapters));

  if (!supportsChapters) {
    chapterButtons.forEach((button) => button.classList.remove("is-active"));
  }
};

const jumpToChapter = (seconds) => {
  if (!featureVideo) return;
  const chapterVideoIndex = videos.findIndex((item) => item.chapters);

  const seek = () => {
    featureVideo.currentTime = seconds;
    featureVideo.play().catch(() => {});
  };

  if (featureVideo.dataset.activeVideo !== String(chapterVideoIndex)) {
    setVideo(chapterVideoIndex);
    featureVideo.addEventListener("loadedmetadata", seek, { once: true });
  } else if (featureVideo.readyState >= 1) {
    seek();
  } else {
    featureVideo.addEventListener("loadedmetadata", seek, { once: true });
  }

  chapterButtons.forEach((button) => {
    const active = Number(button.dataset.chapter) === seconds;
    button.classList.toggle("is-active", active);
  });
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

videoButtons.forEach((button) => {
  button.addEventListener("click", () => setVideo(Number(button.dataset.video)));
});

chapterButtons.forEach((button) => {
  button.addEventListener("click", () => jumpToChapter(Number(button.dataset.chapter)));
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
setVideo(0);
