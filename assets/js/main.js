/* LUXURY KNICKKNACKS — shared site behavior */

document.addEventListener('DOMContentLoaded', function () {

  /* Mobile nav toggle */
  var toggle = document.querySelector('.nav-toggle');
  var panel = document.querySelector('.mobile-panel');
  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      panel.classList.toggle('open');
    });
  }

  /* Shop filters */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var productCards = document.querySelectorAll('[data-category]');
  if (filterBtns.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var cat = btn.getAttribute('data-filter');
        productCards.forEach(function (card) {
          var cats = card.getAttribute('data-category').split(' ');
          if (cat === 'all' || cats.indexOf(cat) > -1) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* "Request this style" buttons -> pass product name to inquiry page */
  document.querySelectorAll('[data-request]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var name = btn.getAttribute('data-request');
      window.location.href = 'custom-inquiry.html?style=' + encodeURIComponent(name);
    });
  });

  /* Pre-fill inquiry form from query string */
  var params = new URLSearchParams(window.location.search);
  var styleParam = params.get('style');
  var refField = document.getElementById('inspiration');
  if (styleParam && refField) {
    refField.value = 'I love the "' + styleParam + '" crate I saw on your site — I\'d like something in that spirit for my occasion. ';
    refField.focus();
  }

  /* FAQ accordion */
  document.querySelectorAll('.accordion-q').forEach(function (q) {
    q.addEventListener('click', function () {
      var item = q.closest('.accordion-item');
      var answer = item.querySelector('.accordion-a');
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.accordion-item.open').forEach(function (openItem) {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.accordion-a').style.maxHeight = null;
        }
      });
      if (isOpen) {
        item.classList.remove('open');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* Lightbox for gallery images */
  var lightbox = document.querySelector('.lightbox');
  if (lightbox) {
    var lightboxImg = lightbox.querySelector('img');
    document.querySelectorAll('[data-lightbox]').forEach(function (trigger) {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        lightboxImg.src = trigger.getAttribute('href') || trigger.getAttribute('data-lightbox');
        lightbox.classList.add('open');
      });
    });
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
        lightbox.classList.remove('open');
        lightboxImg.src = '';
      }
    });
  }

  /* Inquiry / contact form submission (static site: no backend).
     Shows an on-page confirmation and builds a mailto link with the details. */
  var forms = document.querySelectorAll('form[data-static-form]');
  forms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var lines = [];
      data.forEach(function (value, key) {
        if (value) lines.push(key + ': ' + value);
      });
      var to = form.getAttribute('data-to') || '';
      var subject = encodeURIComponent(form.getAttribute('data-subject') || 'New inquiry from LuxuryKnickKnacks.com');
      var body = encodeURIComponent(lines.join('\n'));
      var mailtoLink = 'mailto:' + to + '?subject=' + subject + '&body=' + body;

      form.style.display = 'none';
      var success = form.parentElement.querySelector('.form-success');
      if (success) {
        success.classList.add('show');
        var mailBtn = success.querySelector('[data-mailto]');
        if (mailBtn) { mailBtn.setAttribute('href', mailtoLink); }
      }
    });
  });

});
