/**
 * Contact form handling for the About page.
 *
 * Extracted from an inline <script> so the Content-Security-Policy no longer
 * needs 'unsafe-inline'; the form's onsubmit attribute became a listener.
 */
function handleContactSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const name = formData.get('name');
  const email = formData.get('email');
  alert(`Thank you for your message, ${name}!\n\nWe'll get back to you at ${email} as soon as possible.\n\nFor immediate assistance, please visit our GitHub repository to submit an issue or discussion.`);
  event.target.reset();
}
  

// about.html used to carry onsubmit="handleContactSubmit(event)" on the form.
document.getElementById('contactForm')?.addEventListener('submit', handleContactSubmit);
