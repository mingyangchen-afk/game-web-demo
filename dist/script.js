const header = document.querySelector("[data-header]");
const galleryImage = document.querySelector("[data-gallery-image]");
const galleryCaption = document.querySelector("[data-gallery-caption]");
const galleryButtons = Array.from(document.querySelectorAll("[data-gallery-button]"));

const galleryItems = [
  {
    src: "assets/images/promotional/dunhuang-thunder-portal-keyart.png",
    alt: "雷神与三兔共耳传送门的游戏主视觉",
    caption: "主视觉：雷神、三兔门和玩家撤离目标同框，第一眼说明这是一场洞窟搜打撤。",
    fit: "cover"
  },
  {
    src: "assets/images/promotional/dunhuang-thunder-drum-gameplay.png",
    alt: "玩家在雷鼓窟中使用雷链进行战斗并启动撤离门",
    caption: "雷鼓窟：雷链抢点、击鼓破盾、守住短窗口，展示多人配合的核心玩法。",
    fit: "cover"
  },
  {
    src: "assets/images/promotional/dunhuang-four-deities-endgame-portal.png",
    alt: "风雨雷电四神共同稳定三兔共耳终局传送门",
    caption: "终局门：四神归位后，普通撤离门升级为通往最终洞窟的赛季目标。",
    fit: "cover"
  },
  {
    src: "assets/images/promotional/dunhuang-portal-gameplay.svg",
    alt: "风雨雷电四神与三兔共耳传送门的玩法剧情系统图",
    caption: "系统图：旧版完整机制总览，可作为后续扩展参考；当前网页已简化成搜打撤主循环。",
    fit: "contain"
  }
];

const setHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 8);
};

const showGalleryItem = (index) => {
  const item = galleryItems[index];
  if (!item) return;

  galleryImage.src = item.src;
  galleryImage.alt = item.alt;
  galleryImage.classList.toggle("is-contain", item.fit === "contain");
  galleryCaption.textContent = item.caption;

  galleryButtons.forEach((button) => {
    const isActive = Number(button.dataset.galleryButton) === index;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
};

galleryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    showGalleryItem(Number(button.dataset.galleryButton));
  });
});

window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();
showGalleryItem(0);
