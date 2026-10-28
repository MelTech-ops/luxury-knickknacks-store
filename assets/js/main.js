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

  /* Inquiry / contact form submission via Formspree.
     If the send fails, falls back to a mailto link with the details. */
  var FORMSPREE = 'https://formspree.io/f/mvkkrndd';
  var forms = document.querySelectorAll('form[data-static-form]');
  forms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var subjectText = form.getAttribute('data-subject') || 'New inquiry from luxuryknicknack.com';
      data.append('_subject', subjectText);
      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }

      function showSuccess(fallback) {
        form.style.display = 'none';
        var success = form.parentElement.querySelector('.form-success');
        if (!success) { return; }
        success.classList.add('show');
        var mailBtn = success.querySelector('[data-mailto]');
        if (fallback) {
          var lines = [];
          data.forEach(function (value, key) { if (value && key.charAt(0) !== '_') lines.push(key + ': ' + value); });
          var to = form.getAttribute('data-to') || '';
          var link = 'mailto:' + to + '?subject=' + encodeURIComponent(subjectText) + '&body=' + encodeURIComponent(lines.join('\n'));
          if (mailBtn) { mailBtn.setAttribute('href', link); mailBtn.style.display = ''; }
          var msg = success.querySelector('[data-msg]');
          if (msg) { msg.textContent = 'We could not send this automatically. Click below to send it through your email app instead.'; }
        } else if (mailBtn) {
          mailBtn.style.display = 'none';
        }
      }

      fetch(FORMSPREE, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } })
        .then(function (r) { showSuccess(!r.ok); })
        .catch(function () { showSuccess(true); });
    });
  });

});
