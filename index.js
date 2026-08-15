/**
 * Homepage behaviour: scroll reveals, the animated stat counters, and the
 * newsletter signup.
 *
 * Extracted from an inline <script> in index.html so the Content-Security-
 * Policy no longer needs 'unsafe-inline'. The form's onsubmit attribute moved
 * here too, as an addEventListener.
 */
// ================================================
// SCROLL-REVEAL — INTERSECTION OBSERVER
// ================================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

// ================================================
// STAT COUNTER ANIMATION
// ================================================
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const isZero = el.dataset.zero === 'true';

  if (isZero) {
    el.textContent = '0';
    return;
  }

  const duration = 1400;
  const startTime = performance.now();

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = current + suffix;
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-number').forEach(animateCounter);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

const statsSection = document.getElementById('stats');
if (statsSection) statsObserver.observe(statsSection);

// ================================================
// EMAIL SIGNUP — proxied via Cloudflare Worker
// ================================================
const SUBSCRIBE_URL = 'https://jfp-subscribe.ymkerphotos.workers.dev';

async function handleEmailSignup(e) {
  e.preventDefault();
  const input  = document.getElementById('signup-email');
  const btn    = document.getElementById('signup-btn');
  const status = document.getElementById('signup-status');
  const email  = input.value.trim();
  if (!email) return;

  btn.textContent    = 'Subscribing…';
  btn.disabled       = true;
  input.disabled     = true;
  status.textContent = '';
  status.style.color = '';

  try {
    const res  = await fetch(SUBSCRIBE_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json().catch(() => ({}));

    if (res.ok && data.ok) {
      btn.textContent      = "You're in!";
      btn.style.background = 'var(--green)';
      input.value          = '';
      input.disabled       = false;
      status.textContent   = "Thanks for subscribing — we'll let you know when new modules drop.";
      status.style.color   = 'var(--green)';
      window.JFPAnalytics?.sendEvent('newsletter_signup');

      // Return the button to its resting state so a second address can be
      // added without reloading the page.
      setTimeout(() => {
        btn.textContent      = 'Subscribe';
        btn.style.background = '';
        btn.disabled         = false;
      }, 4000);
    } else {
      throw new Error(data.error || `HTTP ${res.status}`);
    }
  } catch (err) {
    btn.textContent    = 'Subscribe';
    btn.disabled       = false;
    input.disabled     = false;
    // The endpoint returns a usable message for the cases a visitor can
    // act on — a malformed address, or too many attempts. Show it rather
    // than burying it in the console.
    status.textContent = /^(Invalid email|Too many)/.test(err.message)
      ? err.message
      : 'Something went wrong — please try again.';
    status.style.color = 'var(--red)';
    console.error('[signup]', err.message);
  }
}

  

// index.html used to carry onsubmit="handleEmailSignup(event)" on the form.
document.getElementById('signup-form')?.addEventListener('submit', handleEmailSignup);
