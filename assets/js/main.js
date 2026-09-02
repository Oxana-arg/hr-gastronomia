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

  /* --- Временное сравнение палитр: открыть страницу с ?themes=1 -----------
     Обычные посетители этот переключатель не видят. Когда палитра выбрана,
     блок можно удалить вместе с лишними темами в styles.css.              */
  if (new URLSearchParams(window.location.search).has('themes')) {
    var themes = [
      { id: 'mate', label: 'Песочно-шалфейная', swatch: '#8A5323' },
      { id: 'rosa', label: 'Пудрово-винная', swatch: '#9C4257' },
      { id: 'porteno', label: 'Лавандово-мятная', swatch: '#4B5296' }
    ];

    var box = document.createElement('div');
    box.className = 'theme-switch';
    box.setAttribute('role', 'group');
    box.setAttribute('aria-label', 'Выбор палитры');

    themes.forEach(function (theme) {
      var button = document.createElement('button');
      button.type = 'button';
      button.style.background = theme.swatch;
      button.title = theme.label;
      button.setAttribute('aria-label', theme.label);
      button.setAttribute('aria-pressed', String(document.documentElement.dataset.theme === theme.id));

      button.addEventListener('click', function () {
        document.documentElement.dataset.theme = theme.id;
        box.querySelectorAll('button').forEach(function (other, index) {
          other.setAttribute('aria-pressed', String(themes[index].id === theme.id));
        });
      });

      box.appendChild(button);
    });

    document.body.appendChild(box);
  }
})();
