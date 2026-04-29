// --------------------------------------------------------------
// FLASHCUTS — premium features
// - Glitch keyword rotation (2.6 sec)
// - Works slider with video autoplay on scroll
// - IntersectionObserver for fade-in + video play/pause
// --------------------------------------------------------------

// ---------- EDITABLE KEYWORDS ----------
const keywords = [
  "Instant reels⚡",
  "Functions",
  "promotional videos",
  "business videos",
  "motion graphics"
];

// ---------- WORKS DATA ----------
// HOW TO ADD YOUR VIDEOS:
//   1. Put your .mp4 files in the same folder as this file
//   2. Set "video" to the filename, e.g. "video": "my-clip.mp4"
//   3. For a poster (thumbnail shown before video loads), add a .jpg with same name
//      e.g. "poster": "my-clip.jpg"  — optional but recommended
//   4. Leave "video": "" to show the 🎬 placeholder instead

const works = [
  { title: "motion graphics",      video: "motion.mp4",  poster: "motion.jpg", link: "#" },
  { title: "Lyrical songs",      video: "lyrics.mp4",  poster: "lyrics.jpg", link: "#" },
  { title: "Themed videos", video: "simba.mp4",  poster: "simba.jpg", link: "#" },
  { title: "Birthday Events",      video: "birthday.mp4",  poster: "birthday.jpg", link: "#" },
  { title: "Bike edits1",      video: "mt15.mp4",  poster: "mt15.jpg", link: "#" },
  { title: "Bike edits2",      video: "350.mp4",  poster: "350.jpg", link: "#" },
  { title: "Business video",       video: "Aveo.mp4",  poster: "Aveo.jpg", link: "#" },
  { title: "Brand Story",          video: "pvc.mp4",  poster: "pvc.jpg", link: "#" }
];

// ---------- GLITCH KEYWORD ROTATION (2.6 sec) ----------
let keywordIndex = 0;
const keywordElement = document.getElementById("glitchKeyword");

function applyGlitchAndUpdate() {
  if (!keywordElement) return;
  keywordElement.classList.remove("glitch-active");
  void keywordElement.offsetWidth;
  keywordElement.classList.add("glitch-active");
  keywordElement.textContent = keywords[keywordIndex];
  setTimeout(() => keywordElement.classList.remove("glitch-active"), 220);
  keywordIndex = (keywordIndex + 1) % keywords.length;
}

if (keywords.length && keywordElement) {
  keywordElement.textContent = keywords[0];
  keywordIndex = 1;
  setInterval(applyGlitchAndUpdate, 2600);
}

// ---------- RENDER WORKS SLIDER WITH VIDEO ----------
const track = document.getElementById("sliderTrack");
if (track) {
  track.innerHTML = "";
  works.forEach((work) => {
    const card = document.createElement("div");
    card.className = "work-card fade-up";

    const hasVideo = work.video && work.video.trim() !== "";
    let mediaContent = "";

    if (hasVideo) {
      // VIDEO element — muted + loop + playsinline (required for mobile autoplay)
      const posterAttr = work.poster ? `poster="${work.poster}"` : "";
      mediaContent = `
        <video
          class="work-video"
          src="${escapeHtml(work.video)}"
          ${posterAttr}
          muted
          loop
          playsinline
          preload="metadata"
        ></video>
        <div class="video-play-hint">▶</div>
      `;
    } else {
      mediaContent = `
        <div class="placeholder-icon"
          style="background: linear-gradient(145deg,#23232b,#17171c);
                 width:100%; height:100%;
                 display:flex; align-items:center; justify-content:center;">
          🎬
        </div>`;
    }

    card.innerHTML = `
      <div class="work-img">
        ${mediaContent}
      </div>
      <div class="work-info">
        <h3 class="work-title">${escapeHtml(work.title)}</h3>
        <a href="${escapeHtml(work.link)}" class="work-link" target="_blank" rel="noopener noreferrer">View project →</a>
      </div>
    `;
    track.appendChild(card);
  });
}

function escapeHtml(str) {
  return str.replace(/[&<>]/g, (m) =>
    m === "&" ? "&amp;" : m === "<" ? "&lt;" : "&gt;"
  );
}

// ---------- VIDEO AUTOPLAY ON SCROLL (IntersectionObserver) ----------
// Plays video when ≥40% of the card is visible; pauses when it leaves
function initVideoObserver() {
  const videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target.querySelector(".work-video");
        if (!video) return;
        const hint = entry.target.querySelector(".video-play-hint");

        if (entry.isIntersecting) {
          video.play().catch(() => {}); // ignore autoplay policy errors silently
          if (hint) hint.style.opacity = "0";
        } else {
          video.pause();
          video.currentTime = 0; // rewind so it starts fresh next time
          if (hint) hint.style.opacity = "1";
        }
      });
    },
    { threshold: 0.4 } // 40% visible triggers play
  );

  document.querySelectorAll(".work-card").forEach((card) => {
    videoObserver.observe(card);
  });
}

// Run after cards are rendered
initVideoObserver();

// ---------- HORIZONTAL DRAG SCROLL (mouse + touch) ----------
const sliderContainer = document.getElementById("sliderContainer");
if (sliderContainer) {
  let isDown = false;
  let startX, scrollLeft;

  sliderContainer.addEventListener("mousedown", (e) => {
    isDown = true;
    sliderContainer.style.cursor = "grabbing";
    startX = e.pageX - sliderContainer.offsetLeft;
    scrollLeft = sliderContainer.scrollLeft;
    e.preventDefault();
  });
  sliderContainer.addEventListener("mouseleave", () => {
    isDown = false;
    sliderContainer.style.cursor = "grab";
  });
  sliderContainer.addEventListener("mouseup", () => {
    isDown = false;
    sliderContainer.style.cursor = "grab";
  });
  sliderContainer.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - sliderContainer.offsetLeft;
    sliderContainer.scrollLeft = scrollLeft - (x - startX) * 1.2;
  });
  sliderContainer.addEventListener("touchstart", (e) => {
    isDown = true;
    startX = e.touches[0].pageX - sliderContainer.offsetLeft;
    scrollLeft = sliderContainer.scrollLeft;
  });
  sliderContainer.addEventListener("touchmove", (e) => {
    if (!isDown) return;
    const x = e.touches[0].pageX - sliderContainer.offsetLeft;
    sliderContainer.scrollLeft = scrollLeft - (x - startX) * 1;
    startX = x;
    scrollLeft = sliderContainer.scrollLeft;
  });
  sliderContainer.addEventListener("touchend", () => { isDown = false; });
  sliderContainer.style.cursor = "grab";
}

// ---------- FADE-IN ON SCROLL ----------
const fadeElements = document.querySelectorAll(".fade-up");
const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("appear");
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -20px 0px" }
);
fadeElements.forEach((el) => fadeObserver.observe(el));

document
  .querySelectorAll(".hero-brand, .keyword-area, .action-buttons")
  .forEach((el) => {
    el.classList.add("fade-up");
    fadeObserver.observe(el);
  });

document.addEventListener("dragstart", (e) => {
  if (sliderContainer && sliderContainer.contains(e.target)) e.preventDefault();
});

console.log("FLASHCUTS — video autoplay on scroll enabled ✅");
