(function () {
  'use strict';

  /* --- Current year --- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* --- Sticky header --- */
  var header = document.getElementById('header');
  function checkHeader() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', checkHeader, { passive: true });
  checkHeader();

  /* --- Scroll progress bar --- */
  var progressEl = document.getElementById('scroll-progress');
  function updateProgress() {
    if (!progressEl) return;
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressEl.style.width = Math.min(pct, 100) + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* --- Mobile nav toggle --- */
  var navToggle = document.getElementById('nav-toggle');
  var navLinks = document.getElementById('nav-links');
  var navOverlay = document.getElementById('nav-overlay');

  function closeNav() {
    if (navToggle) { navToggle.classList.remove('open'); navToggle.setAttribute('aria-expanded', 'false'); }
    if (navLinks) navLinks.classList.remove('open');
    if (navOverlay) navOverlay.classList.remove('open');
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (navOverlay) navOverlay.classList.toggle('open', isOpen);
    });
  }
  if (navOverlay) {
    navOverlay.addEventListener('click', closeNav);
  }
  navLinks.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', closeNav);
  });

  /* --- Smooth scroll for anchor links --- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    var id = link.getAttribute('href');
    if (id === '#' || id === '#hero') return;
    link.addEventListener('click', function (e) {
      var target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* --- Active nav link on scroll --- */
  var sections = document.querySelectorAll('section[id]');
  var navLinkEls = document.querySelectorAll('.nav-link');
  function updateActiveNav() {
    var scrollPos = window.scrollY + 120;
    var currentId = '';
    sections.forEach(function (section) {
      if (section.offsetTop <= scrollPos) {
        currentId = section.id;
      }
    });
    navLinkEls.forEach(function (link) {
      var href = link.getAttribute('href');
      link.classList.toggle('active', href === '#' + currentId);
    });
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  /* --- Scroll reveal animations --- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* --- Download resume: generate PDF from live content --- */
  var downloadBtn = document.getElementById('download-resume');
  var pageResumeContent = document.getElementById('pdf-content');
  if (downloadBtn && pageResumeContent && typeof html2pdf !== 'undefined') {
    function resetDownloadState() {
      downloadBtn.disabled = false;
      downloadBtn.textContent = 'Download resume (PDF)';
    }

    function cleanupPrintNode(node) {
      if (node && node.parentNode) {
        node.parentNode.removeChild(node);
      }
    }

    downloadBtn.addEventListener('click', function () {
      var pdfContent = pageResumeContent.cloneNode(true);
      pdfContent.id = 'resume-print-generated';
      pdfContent.classList.add('resume-export');

      pdfContent.querySelectorAll('.hero-cta, #download-resume, .scroll-cue, .nav-overlay').forEach(function (node) {
        node.remove();
      });

      pdfContent.querySelectorAll('.reveal').forEach(function (el) {
        el.classList.add('visible');
      });

      var renderHost = document.createElement('div');
      renderHost.id = 'resume-print-host';
      renderHost.setAttribute('aria-hidden', 'true');
      renderHost.style.position = 'absolute';
      renderHost.style.left = '-99999px';
      renderHost.style.top = '0';
      renderHost.style.width = '210mm';
      renderHost.style.overflow = 'hidden';
      renderHost.appendChild(pdfContent);
      document.body.appendChild(renderHost);

      downloadBtn.disabled = true;
      downloadBtn.textContent = 'Generating PDF…';
      var opt = {
        margin: [8, 8, 8, 8],
        filename: 'Raghav_Gurung_Resume.pdf',
        image: { type: 'jpeg', quality: 0.9 },
        html2canvas: { scale: 1.35, useCORS: true, scrollY: 0 },
        pagebreak: { mode: ['css', 'legacy'] },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      html2pdf().set(opt).from(pdfContent).save().then(function () {
        cleanupPrintNode(renderHost);
        resetDownloadState();
      }).catch(function () {
        cleanupPrintNode(renderHost);
        resetDownloadState();
      });
    });
  }
})();
