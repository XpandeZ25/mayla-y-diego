const videos = [
  {
    title: "Niña Bonita",
    note: "Una canción para sonreír lento.",
    src: "media/videos/Dstance - Niña Bonita (Versión Acústica).mp4"
  },
  {
    title: "Pinta Nomá'",
    note: "Para bailar el recuerdo.",
    src: "media/videos/Jaze - Pinta Nomá’ (Video Oficial).mp4"
  },
  {
    title: "Chachachá",
    note: "Para mirarnos con calma.",
    src: "media/videos/Jósean Log - Chachachá (Lyric Video).mp4"
  },
  {
    title: "Mi mundo entero",
    note: "Porque hay personas que se vuelven hogar.",
    src: "media/videos/Mi mundo entero-MD EL ARKI.mp4"
  },
  {
    title: "Voy A Conquistarte",
    note: "Una promesa cantada.",
    src: "media/videos/Voy A Conquistarte - Joan Sebastian - Letra.mp4"
  }
];

const canvas = document.getElementById("dierikaStars");
const ctx = canvas.getContext("2d");
const videoGrid = document.getElementById("videoGrid");
const diaryText = document.getElementById("diaryText");
const diaryStatus = document.getElementById("diaryStatus");
let stars = [];

function resizeStars() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * ratio);
  canvas.height = Math.floor(window.innerHeight * ratio);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  stars = Array.from({ length: 180 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.7 + 0.4,
    p: Math.random() * Math.PI * 2,
    s: Math.random() * 0.035 + 0.01
  }));
}

function animateStars() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  stars.forEach((star) => {
    star.p += star.s;
    const alpha = 0.35 + Math.sin(star.p) * 0.28 + 0.32;
    ctx.beginPath();
    ctx.fillStyle = `rgba(255, 239, 190, ${alpha})`;
    ctx.shadowColor = `rgba(255, 126, 182, ${alpha})`;
    ctx.shadowBlur = 10;
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.shadowBlur = 0;
  requestAnimationFrame(animateStars);
}

function renderVideos() {
  videoGrid.innerHTML = "";
  videos.forEach((video) => {
    const card = document.createElement("article");
    card.className = "video-card";
    card.innerHTML = `
      <video controls preload="metadata" src="${video.src}"></video>
      <div class="video-info">
        <h3>${video.title}</h3>
        <p>${video.note}</p>
        <a class="download-song" href="${video.src}" download>Descargar música</a>
      </div>
    `;
    videoGrid.appendChild(card);
  });
}

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((item) => item.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
  });
});

document.getElementById("saveDiary").addEventListener("click", () => {
  localStorage.setItem("dierikaDiary", diaryText.value);
  diaryStatus.textContent = "Guardado para Diego & Mayla.";
});

document.getElementById("clearDiary").addEventListener("click", () => {
  diaryText.value = "";
  localStorage.removeItem("dierikaDiary");
  diaryStatus.textContent = "Diario limpio.";
});

function revealPoemsOnScroll() {
  const poems = document.querySelectorAll(".poem-list article");

  if (!("IntersectionObserver" in window)) {
    poems.forEach((poem) => poem.classList.add("poem-in-view"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("poem-in-view");
      } else if (entry.boundingClientRect.top > window.innerHeight) {
        entry.target.classList.remove("poem-in-view");
      }
    });
  }, {
    threshold: 0.24,
    rootMargin: "0px 0px -8% 0px"
  });

  poems.forEach((poem, index) => {
    poem.style.transitionDelay = `${Math.min(index * 60, 260)}ms`;
    observer.observe(poem);
  });
}

diaryText.value = localStorage.getItem("dierikaDiary") || "";
renderVideos();
revealPoemsOnScroll();
resizeStars();
animateStars();
window.addEventListener("resize", resizeStars);
