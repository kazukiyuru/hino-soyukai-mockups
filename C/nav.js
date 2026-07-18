// ドロップダウンメニュー
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.has-dropdown > .dropdown-toggle').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var parent = btn.parentElement;
      var isOpen = parent.classList.contains('open');
      document.querySelectorAll('.has-dropdown.open').forEach(function (el) { el.classList.remove('open'); });
      if (!isOpen) parent.classList.add('open');
    });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.has-dropdown')) {
      document.querySelectorAll('.has-dropdown.open').forEach(function (el) { el.classList.remove('open'); });
    }
  });
});

// ページトップへ戻るボタン
(function () {
  var btn = document.getElementById('page-top');
  if (!btn) return;
  window.addEventListener('scroll', function () {
    btn.classList.toggle('show', window.scrollY > 300);
  }, { passive: true });
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ローディング画面（4-1-4：ロゴアニメーション）
(function () {
  var splash = document.getElementById('splash');
  if (!splash) return;
  function hideSplash() {
    setTimeout(function () {
      splash.classList.add('hide');
      setTimeout(function () { splash.style.display = 'none'; }, 700);
    }, 1500);
  }
  if (document.readyState === 'complete') {
    hideSplash();
  } else {
    window.addEventListener('load', hideSplash);
  }
})();

// ハンバーガーメニュー（モバイル専用）
(function () {
  var btn = document.getElementById('hamburger-btn');
  var nav = document.querySelector('nav');
  if (!btn || !nav) return;

  function closeMenu() {
    nav.classList.remove('mobile-open');
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  }
  function openMenu() {
    nav.classList.add('mobile-open');
    btn.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
  }

  btn.addEventListener('click', function () {
    nav.classList.contains('mobile-open') ? closeMenu() : openMenu();
  });
  nav.querySelectorAll('a').forEach(function (a) {
    if (!a.classList.contains('dropdown-toggle')) a.addEventListener('click', closeMenu);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', function () { if (window.innerWidth > 760) closeMenu(); });
})();

// A スクロール進捗バー
(function () {
  var bar = document.createElement('div');
  bar.id = 'scroll-progress';
  document.body.appendChild(bar);
  window.addEventListener('scroll', function () {
    var docH = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (docH > 0 ? (window.scrollY / docH * 100) : 0) + '%';
  }, { passive: true });
})();

// B ヒーロー↓バウンス矢印（トップページのみ）
(function () {
  var hero = document.querySelector('.hero-gallery, .hero');
  if (!hero) return;
  var arr = document.createElement('div');
  arr.id = 'scroll-arrow';
  arr.textContent = '∨';
  arr.setAttribute('aria-hidden', 'true');
  hero.appendChild(arr);
  window.addEventListener('scroll', function () {
    arr.style.opacity = window.scrollY > 60 ? '0' : '1';
  }, { passive: true });
})();

// E フォームバリデーション
(function () {
  var form = document.querySelector('form.contact-form');
  if (!form) return;
  function showError(input, msg) {
    var err = input.parentElement.querySelector('.form-error');
    if (!err) {
      err = document.createElement('p');
      err.className = 'form-error';
      input.parentElement.insertBefore(err, input.nextSibling);
    }
    err.textContent = msg;
    input.classList.add('input-error');
  }
  function clearError(input) {
    var err = input.parentElement.querySelector('.form-error');
    if (err) err.textContent = '';
    input.classList.remove('input-error');
  }
  var submitBtn = form.querySelector('button');
  if (!submitBtn) return;
  submitBtn.addEventListener('click', function () {
    var nameEl  = form.querySelector('input[type="text"]');
    var emailEl = form.querySelector('input[type="email"]');
    var msgEl   = form.querySelector('textarea');
    var ok = true;
    [nameEl, emailEl, msgEl].forEach(clearError);
    if (nameEl && !nameEl.value.trim())  { showError(nameEl, '※ お名前を入力してください'); ok = false; }
    if (emailEl) {
      if (!emailEl.value.trim()) { showError(emailEl, '※ メールアドレスを入力してください'); ok = false; }
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) { showError(emailEl, '※ 正しいメールアドレスの形式で入力してください'); ok = false; }
    }
    if (msgEl && !msgEl.value.trim()) { showError(msgEl, '※ お問い合わせ内容を入力してください'); ok = false; }
    if (ok) {
      form.innerHTML = '<p style="text-align:center;padding:40px 0;font-size:1.1em;">送信が完了しました。ありがとうございました。</p>';
    }
  });
})();

// ④ 数値カウントアップ（メンバーセクション）
(function () {
  var nums = document.querySelectorAll('.members .num');
  if (!nums.length) return;
  var triggered = false;
  function countUp(el) {
    var text = el.textContent.trim();
    var num = parseInt(text);
    if (isNaN(num)) return;
    var suffix = text.replace(/[0-9]/g, '');
    var duration = 1400;
    var start = performance.now();
    function step(now) {
      var p = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(num * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  function check() {
    if (triggered || !nums[0]) return;
    if (nums[0].getBoundingClientRect().top < window.innerHeight - 40) {
      triggered = true;
      nums.forEach(countUp);
    }
  }
  window.addEventListener('scroll', check, { passive: true });
  if (document.readyState === 'complete') { check(); } else { window.addEventListener('load', check); }
})();

// ① スクロールfadeUp出現（安全版：ビューポート内要素は最初から表示）
(function () {
  var els = Array.from(document.querySelectorAll('section, .card, .members > div, .notice'));

  function checkScroll() {
    var wh = window.innerHeight;
    els.forEach(function (el) {
      if (el.getBoundingClientRect().top < wh - 60) {
        el.classList.add('is-visible');
      }
    });
  }

  function init() {
    var wh = window.innerHeight;
    els.forEach(function (el) {
      // ビューポート内にある要素は最初から表示、スクロール外のみアニメーション対象
      if (el.getBoundingClientRect().top >= wh) {
        el.classList.add('will-animate');
      }
    });
    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
  }

  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('load', init);
  }
})();

// ② h3 下線アニメーション
(function () {
  var h3s = document.querySelectorAll('h3');
  function check() {
    var wh = window.innerHeight;
    h3s.forEach(function (el) {
      if (el.getBoundingClientRect().top < wh - 40) el.classList.add('h3-line');
    });
  }
  window.addEventListener('scroll', check, { passive: true });
  if (document.readyState === 'complete') { check(); } else { window.addEventListener('load', check); }
})();

// 追従メニューの現在地ハイライト（5-1-26・PC版のみ）
(function () {
  if (window.innerWidth <= 760) return;

  var SECTION_TO_NAV = {
    news: 'doc', about: 'doc', activity: 'doc', gallery: 'doc',
    members: 'join', join: 'join', contact: 'contact'
  };

  var sections = [];
  Object.keys(SECTION_TO_NAV).forEach(function (id) {
    var el = document.getElementById(id);
    if (el) sections.push({ id: id, el: el, target: SECTION_TO_NAV[id] });
  });
  if (!sections.length) return;

  var docToggle  = document.querySelector('.has-dropdown:nth-of-type(1) > .dropdown-toggle');
  var joinToggle = document.querySelector('.has-dropdown:nth-of-type(2) > .dropdown-toggle');
  var contactLink = document.querySelector('nav > a[href="contact.html"]');
  var NAV_EL = { doc: docToggle, join: joinToggle, contact: contactLink };

  function onScroll() {
    var navH = (document.querySelector('nav') || {}).offsetHeight || 0;
    var scrollPos = window.scrollY + navH + 10;
    var current = null;
    sections.forEach(function (s) { if (s.el.offsetTop <= scrollPos) current = s.target; });
    Object.keys(NAV_EL).forEach(function (k) { if (NAV_EL[k]) NAV_EL[k].classList.remove('scroll-current'); });
    if (current && NAV_EL[current]) NAV_EL[current].classList.add('scroll-current');
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  if (document.readyState === 'complete') { onScroll(); } else { window.addEventListener('load', onScroll); }
})();
