////////// navbar
function deleteTranslateCookie() {
  document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + location.hostname + ";";
}

function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage: 'en',
    includedLanguages: 'en,fr,it,es,de,pt,ru,ja,ko,ar',
    layout: google.translate.TranslateElement.InlineLayout.HORIZONTAL,
    autoDisplay: false
  }, 'google_translate_element');
}

let isTranslating = false;

const languageMap = {
  en: { code: "EN", flag: "https://flagcdn.com/w20/gb.png" },
  fr: { code: "FR", flag: "https://flagcdn.com/w20/fr.png" },
  it: { code: "IT", flag: "https://flagcdn.com/w20/it.png" },
  es: { code: "ES", flag: "https://flagcdn.com/w20/es.png" },
  de: { code: "DE", flag: "https://flagcdn.com/w20/de.png" },
  pt: { code: "PT", flag: "https://flagcdn.com/w20/pt.png" },
  ru: { code: "RU", flag: "https://flagcdn.com/w20/ru.png" },
  ja: { code: "JA", flag: "https://flagcdn.com/w20/jp.png" },
  ko: { code: "KO", flag: "https://flagcdn.com/w20/kr.png" },
  ar: { code: "AR", flag: "https://flagcdn.com/w20/sa.png" }
};

function updateLanguageButton(lang) {
  const codeEl = document.getElementById("languageCode");
  const flagEl = document.getElementById("languageFlag");

  if (codeEl && flagEl && languageMap[lang]) {
    codeEl.textContent = languageMap[lang].code;
    flagEl.src = `${languageMap[lang].flag}?t=${Date.now()}`;
    flagEl.alt = languageMap[lang].code;
  }
}

function changeLanguage(lang, save = true) {
  if (isTranslating) return;
  isTranslating = true;

  const select = document.querySelector("select.goog-te-combo");
  if (select) {
    document.querySelectorAll("#languageDropdown a").forEach(link => {
      link.classList.remove("active-language");
    });

    const currentLink = document.querySelector(`#languageDropdown a[data-lang="${lang}"]`);
    if (currentLink) currentLink.classList.add("active-language");

    select.value = lang;
    select.dispatchEvent(new Event("change"));

    if (save) localStorage.setItem("preferredLang", lang);
    updateLanguageButton(lang);
  }

  setTimeout(() => {
    isTranslating = false;
  }, 1500);
}

function waitForGoogleTranslateReady(callback) {
  const interval = setInterval(() => {
    const select = document.querySelector("select.goog-te-combo");
    if (select) {
      clearInterval(interval);
      callback();
    }
  }, 100);
}



function initNavbar() {
  // إعادة منطق الانتظار وربط أحداث الترجمة بعد تحميل عنصر Google Translate
  deleteTranslateCookie();

  // إدراج سكريبت Google Translate ديناميكيًا إذا لم يكن موجودًا
  function loadGoogleTranslateScript(callback) {
    if (window.google && window.google.translate) {
      callback();
      return;
    }
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.type = 'text/javascript';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.onload = function() {
        setTimeout(callback, 500); // تأخير بسيط لضمان التحميل
      };
      document.body.appendChild(script);
    } else {
      // إذا كان السكريبت موجود بالفعل
      setTimeout(callback, 500);
    }
  }

  // ربط أحداث زر اللغة والقائمة مباشرة
  const langButton = document.getElementById("languageBtn");
  const langDropdown = document.getElementById("languageDropdown");
  if (langButton && langDropdown) {
    langButton.onclick = function(e) {
      e.stopPropagation();
      langDropdown.classList.toggle("show");
    };
    document.addEventListener("click", function hideLangDropdown() {
      langDropdown.classList.remove("show");
    });
    let lastLangScrollPos = 0;
    window.addEventListener("scroll", function langScroll() {
      const currentScroll = window.scrollY;
      if (langDropdown.classList.contains("show") && currentScroll > lastLangScrollPos) {
        langDropdown.classList.remove("show");
      }
      lastLangScrollPos = currentScroll;
    });
  }

  // إدراج عنصر google_translate_element إذا لم يكن موجودًا
  if (!document.getElementById('google_translate_element')) {
    const div = document.createElement('div');
    div.id = 'google_translate_element';
    div.style.display = 'none'; // إخفاء العنصر عن المستخدم
    document.body.appendChild(div);
  }

  // تحميل السكريبت ثم تفعيل الترجمة وربط أحداث تغيير اللغة
  loadGoogleTranslateScript(() => {
    if (typeof googleTranslateElementInit === 'function') {
      googleTranslateElementInit();
    }
    waitForGoogleTranslateReady(() => {
      changeLanguage("en", false);
      document.querySelectorAll("#languageDropdown a").forEach(link => {
        link.onclick = function(e) {
          e.preventDefault();
          const lang = link.getAttribute("data-lang");
          changeLanguage(lang);
        };
      });
    });
  });

  // ربط أحداث القائمة المنسدلة للنافبار
  const portfolioLink = document.getElementById("portfolioItemLink");
  const portfolioDropdown = document.querySelector(".portfolio-dropdown");
  if (portfolioLink && portfolioDropdown) {
    portfolioLink.onclick = function(e) {
      e.preventDefault();
      const isVisible = portfolioDropdown.style.opacity === "1";
      if (isVisible) {
        hideDropdown();
      } else {
        showDropdown();
      }
    };
    let lastScrollPos = 0;
    window.addEventListener("scroll", function portfolioScroll() {
      const currentScroll = window.scrollY;
      if (portfolioDropdown.style.opacity === "1" && currentScroll > lastScrollPos) {
        hideDropdown();
      }
      lastScrollPos = currentScroll;
    });
    document.querySelectorAll(".portfolio-dropdown .dropdown-link").forEach(link => {
      link.onclick = function() {
        hideDropdown();
      };
    });
    document.addEventListener("click", function outsidePortfolio(e) {
      if (!portfolioDropdown.contains(e.target) && !portfolioLink.contains(e.target)) {
        hideDropdown();
      }
    });
  }
  function showDropdown() {
    portfolioDropdown.style.opacity = "1";
    portfolioDropdown.style.pointerEvents = "auto";
    portfolioDropdown.style.transform = "translateX(-50%) translateY(0)";
    portfolioLink.classList.add("active");
  }
  function hideDropdown() {
    portfolioDropdown.style.opacity = "0";
    portfolioDropdown.style.pointerEvents = "none";
    portfolioDropdown.style.transform = "translateX(-50%) translateY(-10px)";
    portfolioLink.classList.remove("active");
  }

  // تفعيل الروابط النشطة
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-link, .dropdown-link').forEach(link => {
    try {
      const fullUrl = new URL(link.href);
      if (fullUrl.pathname === currentPath) {
        link.classList.add('active');
      }
    } catch (e) {
      if (link.getAttribute('href') === window.location.hash) {
        link.classList.add('active');
      }
    }
  });

  // القائمة الجانبية للهامبرجر
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const sideMenu = document.getElementById("sideMenu");
  const closeSideMenu = document.getElementById("closeSideMenu");
  if (hamburgerBtn && sideMenu && closeSideMenu) {
    hamburgerBtn.onclick = function() {
      sideMenu.classList.add("show");
    };
    closeSideMenu.onclick = function() {
      sideMenu.classList.remove("show");
    };
  }

  // قائمة بورتفوليو الجانبية
  const sidePortfolioToggle = document.getElementById("sidePortfolioToggle");
  const sidePortfolioDropdown = document.getElementById("sidePortfolioDropdown");
  if (sidePortfolioToggle && sidePortfolioDropdown) {
    sidePortfolioToggle.onclick = function() {
      sidePortfolioDropdown.classList.toggle("show");
      sidePortfolioToggle.classList.toggle("active");
    };
  }
}

// ...existing code...