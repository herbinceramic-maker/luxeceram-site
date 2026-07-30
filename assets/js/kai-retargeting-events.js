(function () {
  'use strict';
  if (window.__KAI_RETARGETING_EVENTS_V1__) return;
  window.__KAI_RETARGETING_EVENTS_V1__ = true;
  window.dataLayer = window.dataLayer || [];

  function locale() {
    var first = (location.pathname.split('/')[1] || '').toLowerCase();
    return ['ar', 'ru', 'tr'].indexOf(first) >= 0 ? first : 'en';
  }

  function project() {
    var host = location.hostname.toLowerCase();
    var path = location.pathname.toLowerCase();
    if (host.indexOf('books.kavomaz.com') >= 0) {
      return path.indexOf('/kids') === 0 ? 'books-kids' : 'books-life';
    }
    if (host.indexOf('luxeceram.com') >= 0) return 'luxeceram';
    return 'kavomaz-fashion';
  }

  function pageType() {
    var p = location.pathname.toLowerCase();
    if (/\/kids\/articles\/.+/.test(p)) return 'kids_article';
    if (/\/blog\/.+/.test(p)) return 'article';
    if (/\/books\/.+/.test(p)) return 'book';
    if (/\/(?:leggings|sports-bra|activewear-uae)\//.test(p)) return 'product';
    if (/\/size-[^/]+/.test(p)) return 'tile_collection';
    if (p === '/' || /\/(?:ar|ru|tr)\/?$/.test(p)) return 'home';
    return 'page';
  }

  function contentId() {
    var p = location.pathname.replace(/^\/+|\/+$/g, '');
    return p || 'home';
  }

  function consentState() {
    var value = '';
    try {
      value = [
        localStorage.getItem('cookieConsent'),
        localStorage.getItem('consent'),
        localStorage.getItem('kai_consent'),
        document.cookie
      ].filter(Boolean).join('|').toLowerCase();
    } catch (e) {}
    if (/reject|denied|necessary-only|essential-only/.test(value)) return 'denied';
    if (/accept|granted|all/.test(value)) return 'granted';
    return 'unknown';
  }

  function push(eventName, extra) {
    window.dataLayer.push(Object.assign({
      event: eventName,
      kai_event_version: '1.0',
      project: project(),
      brand: project(),
      page_type: pageType(),
      page_locale: locale(),
      content_id: contentId(),
      page_path: location.pathname,
      consent_state: consentState()
    }, extra || {}));
  }

  function safeLinkData(anchor) {
    var href = anchor.getAttribute('href') || '';
    var parsed;
    try { parsed = new URL(href, location.href); } catch (e) { parsed = null; }
    return {
      link_path: parsed && parsed.origin === location.origin ? parsed.pathname : '',
      link_domain: parsed ? parsed.hostname : '',
      link_text: (anchor.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 120)
    };
  }

  function hasAny(value, words) {
    value = String(value || '').toLowerCase();
    return words.some(function (word) { return value.indexOf(word) >= 0; });
  }

  function onClick(event) {
    var anchor = event.target && event.target.closest ? event.target.closest('a') : null;
    if (!anchor) return;
    var href = anchor.getAttribute('href') || '';
    var signature = (href + ' ' + (anchor.textContent || '') + ' ' + (anchor.className || '')).toLowerCase();
    var extra = safeLinkData(anchor);
    var currentProject = project();

    if (/amazon\.(ae|com)|amzn\./i.test(href)) push('amazon_click', extra);

    if (currentProject === 'books-life' || currentProject === 'books-kids') {
      if (hasAny(signature, ['/books/', 'view book', 'book details', 'read sample'])) {
        push('book_click', extra);
      }
      if (hasAny(signature, ['download', '.pdf', 'printable', 'sample'])) {
        push('download_click', extra);
      }
    }

    if (currentProject === 'kavomaz-fashion' && hasAny(signature, [
      '/leggings/', '/sports-bra/', '/activewear-uae/',
      'view details', 'shop kavomaz'
    ])) {
      push('product_click', extra);
    }

    if (currentProject === 'luxeceram') {
      if (/wa\.me|whatsapp/i.test(href + ' ' + signature)) {
        push('whatsapp_click', extra);
      }
      if (hasAny(signature, ['#contact', '/contact', 'quotation', 'request a quote', 'inquiry'])) {
        push('article_contact', extra);
      }
    }
  }

  function onSubmit(event) {
    var form = event.target;
    if (!form || String(form.tagName).toLowerCase() !== 'form') return;
    var signature = [
      form.id || '', form.className || '',
      form.getAttribute('name') || '',
      form.getAttribute('action') || '',
      form.getAttribute('aria-label') || ''
    ].join(' ').toLowerCase();

    var common = {
      form_id: (form.id || form.getAttribute('name') || 'unnamed').slice(0, 100),
      conversion_status: 'submit_intent'
    };

    if (hasAny(signature, ['newsletter', 'subscribe', 'brevo'])) {
      push('newsletter_signup', common);
      return;
    }

    if (project() === 'luxeceram') {
      if (hasAny(signature, ['rfq', 'quotation', 'quote'])) {
        push('rfq_submit', common);
      } else if (hasAny(signature, ['contact', 'inquiry', 'enquiry'])) {
        push('contact_submit', common);
      }
    }
  }

  function init() {
    push('view_content');
    document.addEventListener('click', onClick, true);
    document.addEventListener('submit', onSubmit, true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
