// Shared navbar interactivity (hamburger toggle + scroll-shadow).
// Each page that includes the dark navbar should load this script.

(function () {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMobile = document.getElementById('navMobile');

  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 48) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  if (hamburger && navMobile) {
    hamburger.addEventListener('click', () => {
      navMobile.classList.toggle('open');
    });

    navMobile.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => navMobile.classList.remove('open'));
    });
  }
})();
