const header = document.querySelector("[data-header]");
const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
const assetCards = Array.from(document.querySelectorAll("[data-kind]"));
const modal = document.querySelector("[data-modal]");
const modalImage = document.querySelector("[data-modal-image]");
const modalClose = document.querySelector("[data-modal-close]");
const videoButtons = Array.from(document.querySelectorAll("[data-video]"));
const featureVideo = document.querySelector("[data-feature-video]");
const featureCaption = document.querySelector("[data-feature-caption]");

const videos = [
  {
    src: "assets/videos/mingsha-gate-playable-demo-delivery.mp4",
    poster: "assets/videos/mingsha-gate-playable-demo-poster.jpg",
    caption: "落地玩法演示：入局准备、听声探索、遗物风险、雷鼓遭遇、三兔撤离与结算。"
  },
  {
    src: "assets/videos/mingsha-gate-sound-gameplay-demo-delivery.mp4",
    poster: "assets/videos/mingsha-gate-sound-gameplay-demo-poster.jpg",
    caption: "声音玩法演示：听声入窟、雷鼓破阵、三兔三段共鸣。"
  },
  {
    src: "assets/videos/mingsha-gate-showcase-production-video-delivery.mp4",
    poster: "assets/videos/mingsha-gate-showcase-production-video-poster.png",
    caption: "制作拆解视频：核心公式、一局循环、节点任务与制作优先级。"
  }
];

const setHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 8);
};

const setFilter = (kind) => {
  filterButtons.forEach((button) => {
    const active = button.dataset.filter === kind;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  assetCards.forEach((card) => {
    const visible = kind === "all" || card.dataset.kind === kind;
    card.classList.toggle("is-hidden", !visible);
  });
};

const showAsset = (card) => {
  const src = card.dataset.full;
  const img = card.querySelector("img");
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
  featureCaption.textContent = item.caption;
  featureVideo.load();

  videoButtons.forEach((button) => {
    const active = Number(button.dataset.video) === index;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
};

filterButtons.forEach((button) => {
  button.addEventListener("click", () => setFilter(button.dataset.filter));
});

assetCards.forEach((card) => {
  card.tabIndex = 0;
  card.addEventListener("click", () => showAsset(card));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      showAsset(card);
    }
  });
});

videoButtons.forEach((button) => {
  button.addEventListener("click", () => setVideo(Number(button.dataset.video)));
});

modalClose?.addEventListener("click", () => modal.close());

modal?.addEventListener("click", (event) => {
  if (event.target === modal) modal.close();
});

window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();
setFilter("all");
setVideo(0);
