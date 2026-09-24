document.getElementById("contactForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const submitButton = form.querySelector('button[type="submit"]');
  const formStatus = document.getElementById("formStatus");
  const formData = new FormData(form);
  formData.set("_subject", "New contact message from Adrien Jalbat website");
  formData.set("_replyto", form.email.value);
  formData.set("_template", "table");
  formData.set("_captcha", "false");

  submitButton.disabled = true;
  submitButton.textContent = "Sending...";
  formStatus.className = "form-status";
  formStatus.textContent = "";

  try {
    const response = await fetch("https://formsubmit.co/ajax/ronald50844@gmail.com", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Message sending failed: ${response.status}`);
    }

    formStatus.textContent = "Your message was sent successfully. Thank you for reaching out. We’ll get back to you as soon as possible.";
    formStatus.classList.add("is-visible");
    form.reset();
  } catch (error) {
    console.error("Contact form error:", error);
    formStatus.textContent = "We couldn’t send your message right now. Please try again in a moment.";
    formStatus.classList.add("is-visible", "is-error");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Submit";
  }
});
// تحديث السنة تلقائيًا
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }




  function loadNavbar() {
  fetch('../Components/navbar.html')
    .then(res => res.text())
    .then(data => {
      const container = document.getElementById('navbar');
      container.innerHTML = data;

      // بعد ما النافبار يدخل، اربط ملفات CSS و JS الخاصة به
      const navbarCss = document.createElement('link');
      navbarCss.rel = 'stylesheet';
      navbarCss.href = '../Components/navbar.css';
      document.head.appendChild(navbarCss);

      const navbarScript = document.createElement('script');
      navbarScript.src = '../Components/navbar.js';
      navbarScript.onload = function() {
        // إذا كان هناك دالة تهيئة في navbar.js مثل initNavbar()
        if (typeof initNavbar === 'function') {
          initNavbar();
        }
        // استدعاء دالة ضبط الروابط بعد تهيئة النافبار
        fixNavbarLinks();
      };
      document.body.appendChild(navbarScript);
    });
}

document.addEventListener('DOMContentLoaded', loadNavbar);