// JavaScript الكامل مع التعديلات المطلوبة
const name = document.getElementById('name');
const tagline = document.getElementById('tagline');
const overlay = document.querySelector('.overlay');
const socialLinks = document.querySelector('.social-links');
const visionMessage = document.getElementById('creative-vision');
const visionLines = document.querySelectorAll('.vision-line');
const creativeTrigger = document.getElementById('creative-trigger');

// متغيرات التحكم
let visionMessageTimeout;
let isNaturalDisappearance = false;
let lastScrollPosition = 0;
let isVisionMessageVisible = false;
let isDisappearing = false;

// تهيئة العناصر
function initElements() {
  name.style.opacity = '0';
  name.style.transform = 'translateY(20px)';
  tagline.style.opacity = '0';
  tagline.style.transform = 'translateY(20px)';
  overlay.style.opacity = '0';
  overlay.style.transform = 'translateY(20px)';
  socialLinks.style.opacity = '0';
  socialLinks.style.transform = 'translateY(20px)';
  
  // إعداد كلمة Creative
  const creativeText = '* My Essence *'; // النص الجديد مع المسافات والنجوم
creativeTrigger.innerHTML = '';

// تعديل خاص لمعالجة المسافات
for (let i = 0; i < creativeText.length; i++) {
  const charSpan = document.createElement('span');
  charSpan.textContent = creativeText[i];
  
  // معالجة خاصة للمسافات والنجوم
  if (creativeText[i] === ' ') {
    charSpan.innerHTML = '&nbsp;'; // تحويل المسافة العادية إلى مسافة غير قابلة للكسر
    charSpan.style.minWidth = '0.3em'; // ضمان عرض المسافة
  } else if (creativeText[i] === '*') {
    charSpan.style.opacity = '0.5'; // جعل النجوم شبه شفافة
  }
  
  charSpan.style.setProperty('--char-index', i);
  charSpan.style.transitionDelay = `${i * 0.15}s`; // نفس سرعة الكود الأصلي
  creativeTrigger.appendChild(charSpan);
}
  
  name.style.transition = 'all 1.2s ease-out';
  tagline.style.transition = 'all 1.2s ease-out';
  overlay.style.transition = 'all 1.5s ease-out';
  socialLinks.style.transition = 'all 1.2s ease-out';
  
  visionMessage.style.display = 'none';
  visionMessage.style.opacity = '0';
  visionLines.forEach(line => {
    line.style.opacity = '0';
    line.style.transform = 'translateY(15px)';
    line.style.transition = 'all 0.8s ease, filter 1.5s ease';
  });
}

// تسلسل الظهور الأساسي
function showHeaderElements() {
  setTimeout(() => {
    overlay.style.opacity = '1';
    overlay.style.transform = 'translateY(0)';
    
    setTimeout(() => {
      name.style.opacity = '1';
      name.style.transform = 'translateY(0)';
      
      setTimeout(() => {
        tagline.style.opacity = '1';
        tagline.style.transform = 'translateY(0)';
        
        setTimeout(() => {
          socialLinks.style.opacity = '1';
          socialLinks.style.transform = 'translateY(0)';
          
          setTimeout(() => {
            // ظهور كلمة Creative حرفًا بحرف
            creativeTrigger.classList.add('visible');
            
            // تأثير البريق بعد اكتمال الظهور
            setTimeout(() => {
              creativeTrigger.classList.add('hover-effect');
              setTimeout(() => {
                creativeTrigger.classList.remove('hover-effect');
              }, creativeTrigger.textContent.length * 100 + 500);
            }, creativeTrigger.textContent.length * 100 + 300);
            
            // إعداد أحداث التفاعل
            setupCreativeInteractions();
          }, 600);
        }, 600);
      }, 600);
    }, 600);
  }, 200);
}

// إعداد تفاعلات كلمة Creative
function setupCreativeInteractions() {
  creativeTrigger.addEventListener('mouseenter', () => {
    creativeTrigger.classList.add('hover-effect');
    const chars = creativeTrigger.querySelectorAll('span');
    chars.forEach(char => {
      char.style.transform = 'translateY(-8px) scale(1.15)';
      char.style.textShadow = '0 0 15px rgba(224, 192, 151, 0.6)';
      char.style.filter = 'blur(0)';
    });
  });
  
  creativeTrigger.addEventListener('mouseleave', () => {
    creativeTrigger.classList.remove('hover-effect');
    const chars = creativeTrigger.querySelectorAll('span');
    chars.forEach(char => {
      char.style.transform = 'translateY(0) scale(1)';
      char.style.textShadow = 'none';
    });
  });
  
  creativeTrigger.addEventListener('click', () => {
    [name, tagline, socialLinks].forEach((el, index) => {
      setTimeout(() => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(-40px)';
      }, index * 150);
    });
    
    // إخفاء كلمة Creative
    const chars = creativeTrigger.querySelectorAll('span');
    chars.forEach((char, index) => {
      setTimeout(() => {
        char.style.opacity = '0';
        char.style.transform = 'translateY(30px) translateZ(-50px)';
        char.style.filter = 'blur(8px)';
        char.style.textShadow = 'none';
      }, index * 50);
    });
    
    setTimeout(showVisionMessage, 1000);
  });
}

// عرض الرسالة
function showVisionMessage() {
  isVisionMessageVisible = true;
  isNaturalDisappearance = false;
  isDisappearing = false;
  lastScrollPosition = window.scrollY;
  
  visionMessage.style.display = 'flex';
  visionMessage.style.opacity = '1';
  
  visionLines.forEach((line, index) => {
    line.style.opacity = '0';
    line.style.transform = 'translateY(15px)';
    setTimeout(() => {
      line.style.opacity = '1';
      line.style.transform = 'translateY(0)';
      
      if (index === visionLines.length - 1) {
        visionMessageTimeout = setTimeout(() => {
          if (isVisionMessageVisible && !isDisappearing) {
            isNaturalDisappearance = true;
            startDisappearingEffect();
          }
        }, 5000);
      }
    }, index * 400);
  });
}

// تأثير الاختفاء المخصص
function startDisappearingEffect() {
  if (!isVisionMessageVisible || isDisappearing) return;
  isDisappearing = true;
  
  visionLines.forEach(line => {
    const words = line.textContent.split(' ');
    line.innerHTML = words.map(word => 
      `<span class="vision-word" style="opacity:1; filter:brightness(1) blur(0);">${word}</span>`
    ).join(' ');
  });

  const allWords = document.querySelectorAll('.vision-word');
  
  allWords.forEach((word, index) => {
    setTimeout(() => {
      word.style.transition = 'filter 2s ease';
      word.style.filter = 'brightness(3)';
      
      setTimeout(() => {
        word.style.transition = 'all 0.5s ease';
        word.style.filter = 'brightness(2) blur(1px)';
        
        setTimeout(() => {
          word.style.transform = 'rotate(2deg) scale(0.95)';
          
          setTimeout(() => {
            word.style.opacity = '0';
            word.style.transform = 'rotate(5deg) scale(0.8) translateY(5px)';
            word.style.filter = 'brightness(0) blur(3px)';
          }, 300);
        }, 700);
      }, 2000);
    }, index * 100);
  });

  setTimeout(() => {
    visionMessage.style.opacity = '0';
    setTimeout(() => {
      visionMessage.style.display = 'none';
      resetLines();
    }, 500);
  }, (allWords.length * 100) + 3500);
}

// إخفاء الرسالة فورياً
function hideVisionMessageInstantly() {
  if (!isVisionMessageVisible) return;
  
  clearTimeout(visionMessageTimeout);
  isVisionMessageVisible = false;
  isDisappearing = true;
  
  visionLines.forEach(line => {
    line.style.transition = 'none';
    line.innerHTML = line.textContent;
    line.style.opacity = '0';
    line.style.transform = 'translateY(15px)';
  });
  
  visionMessage.style.transition = 'none';
  visionMessage.style.opacity = '0';
  visionMessage.style.display = 'none';
  
  resetLines();
}

// إعادة تعيين الخطوط
function resetLines() {
  isVisionMessageVisible = false;
  isDisappearing = false;
  isNaturalDisappearance = false;
  
  visionLines.forEach(line => {
    line.innerHTML = line.textContent;
    line.style.opacity = '0';
    line.style.transform = 'translateY(15px)';
    line.style.filter = 'none';
    line.style.transition = 'all 0.8s ease, filter 1.5s ease';
  });
  
  // إعادة ظهور العناصر بنفس التسلسل
  setTimeout(() => {
    overlay.style.opacity = '1';
    overlay.style.transform = 'translateY(0)';
    
    setTimeout(() => {
      name.style.opacity = '1';
      name.style.transform = 'translateY(0)';
      
      setTimeout(() => {
        tagline.style.opacity = '1';
        tagline.style.transform = 'translateY(0)';
        
        setTimeout(() => {
          socialLinks.style.opacity = '1';
          socialLinks.style.transform = 'translateY(0)';
          
          setTimeout(() => {
            // إعادة ظهور كلمة Creative بنفس التأثيرات
            creativeTrigger.classList.add('visible');
            const chars = creativeTrigger.querySelectorAll('span');
            chars.forEach((char, index) => {
              char.style.opacity = '0';
              char.style.transform = 'translateY(30px) translateZ(-50px)';
              char.style.filter = 'blur(8px)';
              setTimeout(() => {
                char.style.opacity = '1';
                char.style.transform = 'translateY(0) translateZ(0)';
                char.style.filter = 'blur(0)';
              }, index * 100 + 300);
            });
            
            setTimeout(() => {
              creativeTrigger.classList.add('hover-effect');
              setTimeout(() => {
                creativeTrigger.classList.remove('hover-effect');
              }, chars.length * 100 + 500);
            }, chars.length * 100 + 300);
          }, 600);
        }, 600);
      }, 600);
    }, 600);
  }, 200);
}

// تأثير التمرير
function handleScroll() {
  const scrollY = window.scrollY;
  const triggerPoint = 300;

  const nameProgress = Math.max(0, 1 - scrollY / (triggerPoint * 0.6));
  const taglineProgress = Math.max(0, 1 - scrollY / (triggerPoint * 0.8));
  const socialProgress = Math.max(0, 1 - scrollY / triggerPoint * 1.0);
  const overlayProgress = Math.max(0, 1 - scrollY / (triggerPoint * 1.2));

  name.style.opacity = nameProgress;
  tagline.style.opacity = taglineProgress;
  socialLinks.style.opacity = socialProgress;
  overlay.style.opacity = overlayProgress;

  name.style.transform = `translateY(${50 * (1 - nameProgress)}px)`;
  tagline.style.transform = `translateY(${50 * (1 - taglineProgress)}px)`;
  socialLinks.style.transform = `translateY(${40 * (1 - socialProgress)}px)`;
  overlay.style.transform = `translateY(${30 * (1 - overlayProgress)}px)`;

  if (isVisionMessageVisible && scrollY > lastScrollPosition) {
    hideVisionMessageInstantly();
  }
  lastScrollPosition = scrollY;
}

// بدء التشغيل
initElements();
setTimeout(showHeaderElements, 300);
window.addEventListener('scroll', () => {
  window.requestAnimationFrame(handleScroll);
});

//////////////////
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

  let currentIndex = 0;
  let intervalId = null;
  let isPlaying = false;

  // استخراج اللون الغالب وتطبيقه على overlay
  const colorThief = new colorThief();

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
    if (playIcon.textContent === "⟳") {
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
    playIcon.textContent = "⏸";
    intervalId = setInterval(() => {
      if (currentIndex < galleryItems.length - 1) {
        showImage(currentIndex + 1);
      } else {
        stopSlideshow();
        playIcon.textContent = "⟳";
      }
    }, 2000);
  };

  const stopSlideshow = () => {
    isPlaying = false;
    playIcon.textContent = "▶";
    clearInterval(intervalId);
  };

  // تحديث السنة تلقائيًا
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});

function loadNavbar() {
  fetch('../components/navbar.html') // عدل المسار حسب مكان navbar.html
    .then(res => res.text())
    .then(data => {
      const container = document.getElementById('navbar');
      container.innerHTML = data;

      // بعد ما النافبار يدخل، اربط ملفات CSS و JS الخاصة به
      const navbarCss = document.createElement('link');
      navbarCss.rel = 'stylesheet';
      navbarCss.href = '../components/navbar.css'; // عدل المسار حسب مكان ملف CSS
      document.head.appendChild(navbarCss);

      const navbarScript = document.createElement('script');
      navbarScript.src = '../components/navbar.js'; // عدل المسار حسب مكان ملف JS
      navbarScript.onload = function() {
        // إذا كان هناك دالة تهيئة في navbar.js مثل initNavbar()
        if (typeof initNavbar === 'function') {
          initNavbar();
        }
      };
      document.body.appendChild(navbarScript);
    });
}

document.addEventListener('DOMContentLoaded', loadNavbar);