// Shared navbar interactivity (hamburger toggle + scroll-shadow).
// Every page with the dark navbar loads this, including index.html.

(function () {
  'use strict';

  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMobile = document.getElementById('navMobile');

  if (navbar) {
    let scrolled = navbar.classList.contains('scrolled');
    // Passive: this listener never calls preventDefault, and the class is only
    // written when the state actually changes rather than on every event.
    window.addEventListener('scroll', function () {
      const next = window.scrollY > 48;
      if (next === scrolled) return;
      scrolled = next;
      navbar.classList.toggle('scrolled', next);
    }, { passive: true });
  }

  if (hamburger && navMobile) {
    if (!navMobile.id) navMobile.id = 'navMobile';
    hamburger.setAttribute('aria-controls', navMobile.id);
    hamburger.setAttribute('aria-expanded', 'false');

    const setOpen = function (open) {
      navMobile.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', String(open));
      hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };

    hamburger.addEventListener('click', function (event) {
      event.stopPropagation();
      setOpen(!navMobile.classList.contains('open'));
    });

    navMobile.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setOpen(false); });
    });

    // Escape closes the menu and returns focus to the control that opened it.
    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape' || !navMobile.classList.contains('open')) return;
      setOpen(false);
      hamburger.focus();
    });

    // A tap anywhere outside the panel closes it, which is what the gesture
    // means on a phone.
    document.addEventListener('click', function (event) {
      if (!navMobile.classList.contains('open')) return;
      if (navMobile.contains(event.target) || hamburger.contains(event.target)) return;
      setOpen(false);
    });

    // Leaving the mobile breakpoint leaves the panel stranded open otherwise.
    window.addEventListener('resize', function () {
      if (window.innerWidth > 768 && navMobile.classList.contains('open')) setOpen(false);
    });
  }
})();

// Keep the footer year current without a build step.
(function () {
  var year = String(new Date().getFullYear());
  document.querySelectorAll('[data-current-year]').forEach(function (el) {
    el.textContent = year;
  });
})();
