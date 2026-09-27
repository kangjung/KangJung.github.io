/* Progressive enhancement only. Navigation, languages, screenshots and FAQs
   remain usable without JavaScript. No storage, uploads, trackers or fetches. */
(() => {
  'use strict';
  const dialog = document.querySelector('.screen-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const image = dialog.querySelector('img');
  const title = dialog.querySelector('#dialog-title');
  let opener = null;
  document.querySelectorAll('[data-screen]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = link;
      image.src = link.href;
      image.alt = link.querySelector('img').alt;
      title.textContent = link.dataset.screen;
      dialog.showModal();
      dialog.querySelector('.dialog-close').focus();
    });
  });
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right ||
        event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    if (opener && document.contains(opener)) opener.focus({preventScroll:true});
  });
})();
