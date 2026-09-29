/* ============================================================
   Bootstrap
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  if (!location.hash) location.hash = '#/login';
  render(parseHash());
});
