document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const form = e.target;
  const formData = {
    firstName: form.firstName.value,
    lastName: form.lastName.value,
    email: form.email.value,
    message: form.message.value,
  };

  console.log("Form Submitted:", formData);

  alert("Form submitted! (Not connected to server yet)");
  form.reset();
});
// تحديث السنة تلقائيًا
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }




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
        // استدعاء دالة ضبط الروابط بعد تهيئة النافبار
        fixNavbarLinks();
      };
      document.body.appendChild(navbarScript);
    });
}

document.addEventListener('DOMContentLoaded', loadNavbar);