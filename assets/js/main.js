/* Оксана Юрченко — лендинг. Без зависимостей, ~2 КБ. */
(function () {
  'use strict';

  /* --- Мобильное меню ---------------------------------------------------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!open));
      nav.setAttribute('data-open', String(!open));
    });

    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) {
        burger.setAttribute('aria-expanded', 'false');
        nav.setAttribute('data-open', 'false');
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') {
        burger.setAttribute('aria-expanded', 'false');
        nav.setAttribute('data-open', 'false');
        burger.focus();
      }
    });
  }

  /* --- Тонкая линия под шапкой появляется при скролле --------------------- */
  var header = document.querySelector('.header');
  if (header) {
    var setScrolled = function () {
      header.setAttribute('data-scrolled', String(window.scrollY > 8));
    };
    setScrolled();
    window.addEventListener('scroll', setScrolled, { passive: true });
  }

  /* --- Появление блоков при прокрутке ------------------------------------ */
  var revealables = document.querySelectorAll('.reveal');
  var motionOk = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (motionOk && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealables.forEach(function (el) { observer.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* --- Год в подвале ------------------------------------------------------ */
  var yearEl = document.querySelector('[data-year]');
  if (yearEl) { yearEl.textContent = String(new Date().getFullYear()); }

  /* --- Заглушка вместо ещё не загруженной фотографии ----------------------
     В разметке стоит .jpg, а в data-fallback — пастельная заглушка. Пока
     фото не залито в assets/img/, показывается заглушка. Как только файл
     появится, он подхватится сам — править HTML не нужно.               */
  var useFallback = function (img) {
    var alt = img.getAttribute('data-fallback');
    if (alt && img.getAttribute('src') !== alt) { img.setAttribute('src', alt); }
  };

  document.querySelectorAll('img[data-fallback]').forEach(function (img) {
    img.addEventListener('error', function () { useFallback(img); });
    // Изображение могло не загрузиться ещё до запуска скрипта.
    if (img.complete && img.naturalWidth === 0) { useFallback(img); }
  });
})();
