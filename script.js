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
const heroVideo = document.querySelector("[data-hero-video]");
const heroToggle = document.querySelector("[data-hero-toggle]");
const heroVideoFrame = document.querySelector("[data-hero-video-frame]");
const heroSoundToggle = document.querySelector("[data-hero-sound-toggle]");
const heroFullscreenToggle = document.querySelector("[data-hero-fullscreen]");
const videoMirror = document.querySelector("[data-video-mirror]");

let previewSoundEnabled = false;
let previewSoundBeforeFullscreen = false;

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

const syncHeroVideoToggle = () => {
  if (!heroVideo || !heroToggle) return;
  const paused = heroVideo.paused;
  heroToggle.textContent = paused ? "播放" : "暂停";
  heroToggle.classList.toggle("is-paused", paused);
  heroToggle.setAttribute("aria-label", paused ? "播放预告" : "暂停预告");
};

const syncHeroSoundToggle = () => {
  if (!heroVideo || !heroSoundToggle) return;
  const soundOn = !heroVideo.muted && heroVideo.volume > 0;
  heroSoundToggle.textContent = soundOn ? "静音" : "开声";
  heroSoundToggle.classList.toggle("is-on", soundOn);
  heroSoundToggle.setAttribute("aria-pressed", String(soundOn));
  heroSoundToggle.setAttribute("aria-label", soundOn ? "关闭预览声音" : "开启预览声音");
};

const playHeroVideo = async () => {
  if (!heroVideo) return;
  await heroVideo.play().catch(() => {});
  syncHeroVideoToggle();
};

const setPreviewSound = (enabled) => {
  if (!heroVideo) return;
  previewSoundEnabled = enabled;
  heroVideo.muted = !enabled;
  if (enabled && heroVideo.volume === 0) {
    heroVideo.volume = 0.85;
  }
  syncHeroSoundToggle();
};

const getFullscreenElement = () =>
  document.fullscreenElement ||
  document.webkitFullscreenElement ||
  document.mozFullScreenElement ||
  document.msFullscreenElement;

const restorePreviewAudioState = () => {
  if (!heroVideo || getFullscreenElement()) return;
  heroVideo.controls = false;
  setPreviewSound(previewSoundBeforeFullscreen);
  syncHeroVideoToggle();
};

const enterHeroFullscreen = async () => {
  if (!heroVideo) return;

  previewSoundBeforeFullscreen = previewSoundEnabled;
  heroVideo.controls = true;
  heroVideo.muted = false;
  heroVideo.volume = 1;
  syncHeroSoundToggle();

  const playPromise = heroVideo.play().catch(() => {});
  const requestFullscreen =
    heroVideo.requestFullscreen ||
    heroVideo.webkitRequestFullscreen ||
    heroVideo.msRequestFullscreen;

  try {
    if (requestFullscreen) {
      await requestFullscreen.call(heroVideo);
    } else if (heroVideo.webkitEnterFullscreen) {
      heroVideo.webkitEnterFullscreen();
    } else {
      heroVideo.controls = false;
      setPreviewSound(previewSoundBeforeFullscreen);
    }
  } catch {
    heroVideo.controls = false;
    setPreviewSound(previewSoundBeforeFullscreen);
  }

  await playPromise;
  syncHeroVideoToggle();
};

const startVideoMirror = () => {
  if (!heroVideo || !videoMirror) return;

  const context = videoMirror.getContext("2d");
  if (!context) return;

  const fitCanvas = () => {
    const rect = videoMirror.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(rect.width * ratio));
    const height = Math.max(1, Math.round(rect.height * ratio));

    if (videoMirror.width !== width || videoMirror.height !== height) {
      videoMirror.width = width;
      videoMirror.height = height;
    }
  };

  const drawFrame = () => {
    fitCanvas();

    if (heroVideo.videoWidth && heroVideo.videoHeight) {
      const canvasWidth = videoMirror.width;
      const canvasHeight = videoMirror.height;
      const scale = Math.max(canvasWidth / heroVideo.videoWidth, canvasHeight / heroVideo.videoHeight);
      const sourceWidth = canvasWidth / scale;
      const sourceHeight = canvasHeight / scale;
      const sourceX = (heroVideo.videoWidth - sourceWidth) / 2;
      const sourceY = (heroVideo.videoHeight - sourceHeight) / 2;

      context.drawImage(
        heroVideo,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        canvasWidth,
        canvasHeight
      );
    }

    requestAnimationFrame(drawFrame);
  };

  if ("ResizeObserver" in window) {
    new ResizeObserver(fitCanvas).observe(videoMirror);
  } else {
    window.addEventListener("resize", fitCanvas, { passive: true });
  }

  drawFrame();
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

heroToggle?.addEventListener("click", async (event) => {
  event.stopPropagation();
  if (!heroVideo) return;

  if (heroVideo.paused) {
    await heroVideo.play().catch(() => {});
  } else {
    heroVideo.pause();
  }

  syncHeroVideoToggle();
});

heroSoundToggle?.addEventListener("click", async (event) => {
  event.stopPropagation();
  if (!heroVideo) return;

  setPreviewSound(!previewSoundEnabled);
  await playHeroVideo();
});

heroFullscreenToggle?.addEventListener("click", (event) => {
  event.stopPropagation();
  enterHeroFullscreen();
});

heroVideoFrame?.addEventListener("click", (event) => {
  if (event.target instanceof Element && event.target.closest("button")) return;
  enterHeroFullscreen();
});

heroVideoFrame?.addEventListener("keydown", (event) => {
  if (event.target instanceof Element && event.target.closest("button")) return;
  if (event.key !== "Enter" && event.key !== " ") return;
  event.preventDefault();
  enterHeroFullscreen();
});

heroVideo?.addEventListener("play", syncHeroVideoToggle);
heroVideo?.addEventListener("pause", syncHeroVideoToggle);
heroVideo?.addEventListener("volumechange", syncHeroSoundToggle);
heroVideo?.addEventListener("webkitendfullscreen", restorePreviewAudioState);
document.addEventListener("fullscreenchange", restorePreviewAudioState);
document.addEventListener("webkitfullscreenchange", restorePreviewAudioState);

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
setPreviewSound(false);
playHeroVideo();
syncHeroVideoToggle();
syncHeroSoundToggle();
startVideoMirror();
