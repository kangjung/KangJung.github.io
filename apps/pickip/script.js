/* Progressive enhancement only. Navigation, languages, screenshots and FAQs
   remain usable without JavaScript. No storage, uploads, trackers or fetches. */
(() => {
  'use strict';

  const lang = document.documentElement.lang || 'ko';
  const privacy = lang === 'en'
    ? {href: '../privacy/en/', label: 'Privacy Policy', detail: 'Read the full PicKip Privacy Policy'}
    : lang === 'ja'
      ? {href: '../privacy/ja/', label: 'プライバシーポリシー', detail: 'PicKipプライバシーポリシー全文を読む'}
      : {href: './privacy/', label: '개인정보 처리방침', detail: 'PicKip 개인정보 처리방침 전문 보기'};

  const footerPrivacy = document.querySelector('.footer a[href="#privacy"]');
  if (footerPrivacy) {
    footerPrivacy.href = privacy.href;
    footerPrivacy.textContent = privacy.label;
  }

  const privacyCopy = document.querySelector('#privacy .privacy-copy');
  if (privacyCopy && !privacyCopy.querySelector('.full-policy-link')) {
    const paragraph = document.createElement('p');
    paragraph.className = 'ads-note full-policy-link';
    const link = document.createElement('a');
    link.href = privacy.href;
    link.textContent = privacy.detail + ' →';
    link.style.textDecoration = 'underline';
    link.style.textUnderlineOffset = '5px';
    paragraph.appendChild(link);
    privacyCopy.appendChild(paragraph);
  }

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
