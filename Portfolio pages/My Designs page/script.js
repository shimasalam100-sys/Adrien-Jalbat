function loadNavbar() {
  fetch('../../components/navbar.html') // عدل المسار حسب مكان navbar.html
    .then(res => res.text())
    .then(data => {
      const container = document.getElementById('navbar');
      container.innerHTML = data;

      // بعد ما النافبار يدخل، اربط ملفات CSS و JS الخاصة به
      const navbarCss = document.createElement('link');
      navbarCss.rel = 'stylesheet';
      navbarCss.href = '../../components/navbar.css'; // عدل المسار حسب مكان ملف CSS
      document.head.appendChild(navbarCss);

      const navbarScript = document.createElement('script');
      navbarScript.src = '../../components/navbar.js'; // عدل المسار حسب مكان ملف JS
      navbarScript.onload = function() {
        // إذا كان هناك دالة تهيئة في navbar.js مثل initNavbar()
        if (typeof initNavbar === 'function') {
          initNavbar();
        }
        // استدعاء دالة ضبط الروابط بعد تهيئة النافبار
        fixNavbarLinks();
        activateCurrentNavbarLink();
      };
      document.body.appendChild(navbarScript);
    });
}
document.addEventListener('DOMContentLoaded', loadNavbar);

document.addEventListener("DOMContentLoaded", () => {
  const galleryItems = document.querySelectorAll(".gallery-img-wrapper");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const imageCounter = document.getElementById("imageCounter");
  const closeBtn = document.getElementById("closeLightbox");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const playBtn = document.getElementById("playButton");
  const playIcon = document.getElementById("playIcon");
  const svgPlay = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 24 24">
  <path d="M8 5v14l11-7z"/>
</svg>`;

const svgPause = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 24 24">
  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
</svg>`;

const svgReplay = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 24 24">
  <path d="M12 5V1L8 5l4 4V6c3.31 0 6 2.69 6 6s-2.69 6-6 6a6.005 6.005 0 0 1-5.66-4H4.08a8.003 8.003 0 0 0 7.92 6c4.42 0 8-3.58 8-8s-3.58-8-8-8z"/>
</svg>`;

  let currentIndex = 0;
  let intervalId = null;
  let isPlaying = false;

  // استخراج اللون الغالب وتطبيقه على overlay
  const colorThief = new ColorThief();

  galleryItems.forEach((wrapper) => {
    const img = wrapper.querySelector("img");
    const overlay = wrapper.querySelector(".overlay");

    if (img.complete) {
      applyOverlayColor(img, overlay);
    } else {
      img.addEventListener("load", () => {
        applyOverlayColor(img, overlay);
      });
    }
  });

  function applyOverlayColor(img, overlay) {
    try {
      const [r, g, b] = colorThief.getColor(img);
      overlay.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.6)`; // 60% شفافية
    } catch (err) {
      overlay.style.backgroundColor = `rgba(0, 0, 0, 0.6)`; // fallback
    }
  }

  const showImage = (index) => {
    const total = galleryItems.length;
    if (index < 0 || index >= total) return;

    const imgSrc = galleryItems[index].querySelector("img").src;
    lightboxImg.src = imgSrc;
    currentIndex = index;
    imageCounter.textContent = `${index + 1} / ${total}`;

    prevBtn.style.display = index === 0 ? "none" : "block";
    nextBtn.style.display = index === total - 1 ? "none" : "block";
  };

  galleryItems.forEach((wrapper, index) => {
    wrapper.addEventListener("click", () => {
      lightbox.classList.add("show");
      showImage(index);
      document.body.style.overflow = "hidden"; // ✅ تعطيل التمرير
    });
  });

  closeBtn.addEventListener("click", () => {
    lightbox.classList.remove("show");
    stopSlideshow();
    document.body.style.overflow = ""; // ✅ إعادة التمرير
  });

  prevBtn.addEventListener("click", () => {
    showImage(currentIndex - 1);
  });

  nextBtn.addEventListener("click", () => {
    showImage(currentIndex + 1);
  });

  playBtn.addEventListener("click", () => {
  if (playIcon.innerHTML.includes("Replay") || playIcon.innerHTML.includes("path d=\"M12 5V1")) {
    currentIndex = 0;
    showImage(currentIndex);
    startSlideshow();
  } else if (isPlaying) {
    stopSlideshow();
  } else {
    startSlideshow();
  }
});

  const startSlideshow = () => {
  isPlaying = true;
  playIcon.innerHTML = svgPause;
  intervalId = setInterval(() => {
    if (currentIndex < galleryItems.length - 1) {
      showImage(currentIndex + 1);
    } else {
      stopSlideshow();
      playIcon.innerHTML = svgReplay;
    }
  }, 2000);
};

  const stopSlideshow = () => {
  isPlaying = false;
  playIcon.innerHTML = svgPlay;
  clearInterval(intervalId);
};

  // تحديث السنة تلقائيًا
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});