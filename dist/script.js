const header = document.querySelector("[data-header]");
const galleryImage = document.querySelector("[data-gallery-image]");
const galleryCaption = document.querySelector("[data-gallery-caption]");
const galleryButtons = Array.from(document.querySelectorAll("[data-gallery-button]"));

const galleryItems = [
  {
    src: "assets/images/black-sand-monastery.webp",
    alt: "黑沙修道院外景，佣兵小队进入废墟",
    caption: "黑沙修道院：地表入口负责中世纪暗黑基调，敦煌元素从门后和地下逐渐渗出。"
  },
  {
    src: "assets/images/hidden-grotto-loot.webp",
    alt: "佣兵在敦煌式地下石窟中搜刮遗物",
    caption: "地下搜刮：残卷、矿物颜料和铜铃是高价值战利品，也是开启密室的风险钥匙。"
  },
  {
    src: "assets/images/fresco-chamber-combat.webp",
    alt: "壁画厅中佣兵与沙化敌人交战",
    caption: "遭遇战：黑沙骑士、画影巡游和其他小队会把拓印声变成战斗导火索。"
  },
  {
    src: "assets/images/mural-gate-extraction.webp",
    alt: "玩家携带残卷奔向发光的壁画撤离门",
    caption: "壁画门撤离：普通出口关闭后，残卷能打开更高收益也更危险的撤离路线。"
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
