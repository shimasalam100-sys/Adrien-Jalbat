// دالة عامة لضبط روابط النافبار والقائمة الجانبية حسب عمق الصفحة
function fixNavbarLinks(navbarSelector = '#navbar') {
  const path = window.location.pathname;
  // احسب عمق الصفحة الحالي
  const segments = path.replace(/^\//, '').split('/');
  if (segments.length && segments[segments.length - 1].match(/\.(html?|js|css)$/)) {
    segments.pop();
  }
  const depth = segments.length;

  // عدل جميع الروابط في النافبار والقائمة الجانبية
  const selectors = [
    `${navbarSelector} .nav-link`,
    `${navbarSelector} .dropdown-link`,
    '.side-nav a',
    '.side-portfolio-dropdown a'
  ];
  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(link => {
      let href = link.getAttribute('data-original-href') || link.getAttribute('href');
      if (!link.getAttribute('data-original-href')) {
        link.setAttribute('data-original-href', href);
      }
      if (!href || href.startsWith('http') || href.startsWith('#')) return;
      href = href.replace(/^(\.\.\/)+/, '');
      const newHref = depth ? '../'.repeat(depth) + href : href;
      link.setAttribute('href', newHref);
    });
  });
  console.log('Navbar links fixed for depth:', depth);
}
