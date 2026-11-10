/* Progressive enhancement for the shared navigation. No birth data is read here. */
(function () {
  var nav = document.getElementById('gnav');
  var menu = document.querySelector('.menu-btn');
  if (!nav || !menu) return;

  function closeMenu(returnFocus) {
    menu.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
    nav.querySelectorAll('.dd-b').forEach(function (button) {
      button.setAttribute('aria-expanded', 'false');
    });
    if (returnFocus) menu.focus();
  }

  // Restore focus to the disclosure button when Escape closes a desktop submenu.
  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    var submenu = event.target.closest && event.target.closest('.dd-p');
    if (submenu && !mobile.matches) submenu.previousElementSibling.focus();
  });
  nav.addEventListener('click', function (event) {
    if (event.target.closest('a')) closeMenu(false);
  });
  document.addEventListener('click', function (event) {
    if (!event.target.closest('.bar') && menu.getAttribute('aria-expanded') === 'true') closeMenu(false);
  });
  nav.addEventListener('focusout', function (event) {
    if (event.relatedTarget && !nav.contains(event.relatedTarget) && event.relatedTarget !== menu) closeMenu(false);
  });
  var mobile = window.matchMedia('(max-width: 760px)');
  if (mobile.addEventListener) mobile.addEventListener('change', function () { closeMenu(false); });

  // Move focus with same-page shortcuts so keyboard users arrive at the form.
  document.querySelectorAll('a[href="/#quick"]').forEach(function (link) {
    link.addEventListener('click', function () {
      if (location.pathname !== '/') return;
      var input = document.getElementById('qbd-y') || document.getElementById('qbd');
      if (input) input.focus({ preventScroll: true });
    });
  });
})();
