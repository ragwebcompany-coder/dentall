/* DENTALL — Calendly online booking
   - Inline widget: κάθε .calendly-inline-widget[data-url] της σελίδας.
   - Popup: κάθε CTA «Κλείστε Ραντεβού» (a[href*="epikoinonia.html#rantevou"]).
     Σε σελίδα που έχει ήδη το inline widget, το CTA κάνει κύλιση σε αυτό. */
(function () {
  var CAL_URL = 'https://calendly.com/64dentall/30min?hide_gdpr_banner=1';
  var CAL_CSS = 'https://assets.calendly.com/assets/external/widget.css';
  var CAL_JS  = 'https://assets.calendly.com/assets/external/widget.js';
  var CTA_SEL = 'a[href*="epikoinonia.html#rantevou"]';

  function loadAssets() {
    if (!document.querySelector('link[href="' + CAL_CSS + '"]')) {
      var l = document.createElement('link');
      l.rel = 'stylesheet';
      l.href = CAL_CSS;
      document.head.appendChild(l);
    }
    if (!document.querySelector('script[src="' + CAL_JS + '"]')) {
      var s = document.createElement('script');
      s.src = CAL_JS;
      s.async = true;
      document.head.appendChild(s);
    }
  }

  function init() {
    loadAssets();
    var section = document.getElementById('rantevou');
    var inline  = section && section.querySelector('.calendly-inline-widget[data-url]');

    document.addEventListener('click', function (e) {
      if (!e.target || !e.target.closest) return;
      var a = e.target.closest(CTA_SEL);
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;

      /* Ίδια σελίδα με inline widget → κύλιση αντί για popup */
      if (inline) {
        e.preventDefault();
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (history.replaceState) history.replaceState(null, '', '#rantevou');
        return;
      }
      if (window.Calendly && typeof window.Calendly.initPopupWidget === 'function') {
        e.preventDefault();
        window.Calendly.initPopupWidget({ url: CAL_URL });
      }
      /* Αν το Calendly δεν φορτώσει, ο σύνδεσμος λειτουργεί κανονικά. */
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
