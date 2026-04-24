// --------------------------------------------------------------
// FLASHCUTS — premium features
// - Glitch keyword rotation (2.6 sec)
// - Works slider with drag & touch
// - IntersectionObserver for fade-in
// --------------------------------------------------------------

// ---------- EDITABLE KEYWORDS (glitch transition, 2.6 sec each) ----------
const keywords = [
  "Instant reels⚡",
  "Functions",
  "promotional videos",
  "business videos",
  "motion graphics"
];

// ---------- WORKS DATA (add new work here) ----------
const works = [
  { title: "Soulful Prelude", image: "", link: "#" },
  { title: "Anniversary Elegance", image: "", link: "#" },
  { title: "Corporate Pulse", image: "", link: "#" },
  { title: "Birthday Cinema", image: "", link: "#" },
  { title: "Festival Recap", image: "", link: "#" },
  { title: "Brand Story", image: "", link: "#" }
];

// ---------- GLITCH KEYWORD ROTATION (2.6 sec) ----------
let keywordIndex = 0;
const keywordElement = document.getElementById("glitchKeyword");

function applyGlitchAndUpdate() {
  if (!keywordElement) return;
  keywordElement.classList.remove("glitch-active");
  void keywordElement.offsetWidth; // force reflow
  keywordElement.classList.add("glitch-active");
  keywordElement.textContent = keywords[keywordIndex];
  setTimeout(() => {
    keywordElement.classList.remove("glitch-active");
  }, 220);
  keywordIndex = (keywordIndex + 1) % keywords.length;
}

if (keywords.length && keywordElement) {
  keywordElement.textContent = keywords[0];
  keywordIndex = 1;
  setInterval(applyGlitchAndUpdate, 2600); // 2.6 seconds
}

// ---------- RENDER WORKS SLIDER ----------
const track = document.getElementById("sliderTrack");
if (track) {
  track.innerHTML = "";
  works.forEach((work) => {
    const card = document.createElement("div");
    card.className = "work-card fade-up";
    const hasImage = work.image && work.image.trim() !== "";
    const imgContent = hasImage
      ? `<img src="${work.image}" alt="${escapeHtml(work.title)}" loading="lazy">`
      : `<div class="placeholder-icon" style="background: linear-gradient(145deg, #23232b, #17171c); width:100%; height:100%; display:flex; align-items:center; justify-content:center;">🎬</div>`;
    card.innerHTML = `
      <div class="work-img">
        ${imgContent}
      </div>
      <div class="work-info">
        <h3 class="work-title">${escapeHtml(work.title)}</h3>
        <a href="${work.link}" class="work-link" target="_blank" rel="noopener noreferrer">View project →</a>
      </div>
    `;
    track.appendChild(card);
  });
}

function escapeHtml(str) {
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

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
    const walk = (x - startX) * 1.2;
    sliderContainer.scrollLeft = scrollLeft - walk;
  });
  sliderContainer.addEventListener("touchstart", (e) => {
    isDown = true;
    startX = e.touches[0].pageX - sliderContainer.offsetLeft;
    scrollLeft = sliderContainer.scrollLeft;
  });
  sliderContainer.addEventListener("touchmove", (e) => {
    if (!isDown) return;
    const x = e.touches[0].pageX - sliderContainer.offsetLeft;
    const walk = (x - startX) * 1;
    sliderContainer.scrollLeft = scrollLeft - walk;
    startX = x;
    scrollLeft = sliderContainer.scrollLeft;
  });
  sliderContainer.addEventListener("touchend", () => {
    isDown = false;
  });
  sliderContainer.style.cursor = "grab";
}

// ---------- INTERSECTION OBSERVER (fade-in) ----------
const fadeElements = document.querySelectorAll(".fade-up");
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("appear");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: "0px 0px -20px 0px" });

fadeElements.forEach(el => observer.observe(el));

// Also add fade-up to hero elements
document.querySelectorAll(".hero-brand, .keyword-area, .action-buttons").forEach(el => {
  el.classList.add("fade-up");
  observer.observe(el);
});

// Prevent image drag on slider
document.addEventListener("dragstart", (e) => {
  if (sliderContainer && sliderContainer.contains(e.target)) {
    e.preventDefault();
  }
});

console.log("FLASHCUTS — original theme with email button & glitch keywords");