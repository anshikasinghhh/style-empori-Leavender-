export function openMailComposer(event, to, subject = '', body = '') {
  if (event && event.preventDefault) event.preventDefault();
  const mailto = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  // If the document becomes hidden (user's mail app opened), cancel fallback.
  let timer = null;
  const visibilityHandler = () => {
    if (document.hidden) {
      clearTimeout(timer);
    }
  };

  document.addEventListener('visibilitychange', visibilityHandler, { once: true });

  // Try opening the system mail client via mailto
  window.location.href = mailto;

  // After a short delay, if nothing happened (no visibility change), open Gmail compose as fallback
  timer = setTimeout(() => {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    try {
      window.open(gmailUrl, '_blank');
    } catch (e) {
      // ignore popup blocker — user can still copy the email address
    }
    document.removeEventListener('visibilitychange', visibilityHandler);
  }, 700);
}

export default openMailComposer;
