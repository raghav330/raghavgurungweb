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

  // Download resume: generate PDF from live website content
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

      // Remove interactive controls from the export clone.
      pdfContent.querySelectorAll('.hero-cta, #download-resume').forEach(function (node) {
        node.remove();
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
