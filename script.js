(function () {
  'use strict';

  // Current year in footer
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Sticky header: add .scrolled when past hero
  var header = document.getElementById('header');
  if (header) {
    function checkHeader() {
      header.classList.toggle('scrolled', window.scrollY > 80);
    }
    window.addEventListener('scroll', checkHeader, { passive: true });
    checkHeader();
  }

  // Smooth scroll for anchor links (respects scroll-margin for fixed header)
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    var id = link.getAttribute('href');
    if (id === '#') return;
    link.addEventListener('click', function (e) {
      var target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Download resume: generate PDF from page content (hero + all sections)
  var downloadBtn = document.getElementById('download-resume');
  var pdfContent = document.getElementById('pdf-content');
  if (downloadBtn && pdfContent && typeof html2pdf !== 'undefined') {
    downloadBtn.addEventListener('click', function () {
      downloadBtn.disabled = true;
      downloadBtn.textContent = 'Generating PDF…';
      document.body.classList.add('generating-pdf');
      var opt = {
        margin: [12, 12, 12, 12],
        filename: 'Raghav_Gurung_Resume.pdf',
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
        pagebreak: { mode: ['css', 'legacy'] },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      html2pdf().set(opt).from(pdfContent).save().then(function () {
        document.body.classList.remove('generating-pdf');
        downloadBtn.disabled = false;
        downloadBtn.textContent = 'Download resume (PDF)';
      }).catch(function () {
        document.body.classList.remove('generating-pdf');
        downloadBtn.disabled = false;
        downloadBtn.textContent = 'Download resume (PDF)';
      });
    });
  }
})();
