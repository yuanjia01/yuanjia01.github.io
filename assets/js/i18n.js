(function () {
  var lang = localStorage.getItem('lang') || 'zh';
  document.documentElement.setAttribute('data-lang', lang);

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('lang-toggle');
    if (!btn) return;
    btn.textContent = lang === 'zh' ? 'EN' : '中';
    btn.addEventListener('click', function () {
      lang = lang === 'zh' ? 'en' : 'zh';
      document.documentElement.setAttribute('data-lang', lang);
      localStorage.setItem('lang', lang);
      btn.textContent = lang === 'zh' ? 'EN' : '中';
    });
  });
})();
