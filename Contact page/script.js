document.getElementById("contactForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const submitButton = form.querySelector('button[type="submit"]');
  const formData = new FormData(form);
  formData.append("_subject", "New contact message from Adrien Jalbat website");
  formData.append("_captcha", "false");

  submitButton.disabled = true;
  submitButton.textContent = "Sending...";

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

    alert("Your message was sent successfully.");
    form.reset();
  } catch (error) {
    console.error("Contact form error:", error);
    alert("The message could not be sent. Please try again later.");
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