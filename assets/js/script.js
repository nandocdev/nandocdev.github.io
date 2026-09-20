const DEFAULT_WHATSAPP_HREF = 'https://wa.me/50764879448';
const SECTION_VIEW_THRESHOLD = 0.45;
const SCROLL_DEPTH_CHECKPOINTS = [25, 50, 75, 100];

const siteConfig = (() => {
  const configNode = document.getElementById('site-config');

  if (!configNode) return null;

  try {
    return JSON.parse(configNode.textContent);
  } catch (error) {
    console.error('No se pudo cargar la configuración del sitio.', error);
    return null;
  }
})();

const sendAnalyticsEvent = (eventName, params = {}) => {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', eventName, params);
};

const buildWhatsAppUrl = (message) => {
  const phone = String(siteConfig?.contact?.whatsappPhone || '').replace(/\D/g, '');
  const defaultMessage = String(siteConfig?.contact?.defaultMessage || '').trim();
  const finalMessage = String(message || defaultMessage).trim();

  if (phone.length < 8 || phone.length > 15) {
    console.warn('WhatsApp no configurado; se usa el fallback por defecto.');
    return DEFAULT_WHATSAPP_HREF;
  }

  const url = new URL(`https://wa.me/${phone}`);
  if (finalMessage) url.searchParams.set('text', finalMessage);

  return url.toString();
};

const hydrateWhatsAppLinks = () => {
  document.querySelectorAll('[data-whatsapp-link]').forEach((link) => {
    const fallbackHref = link.getAttribute('href') || DEFAULT_WHATSAPP_HREF;
    link.href = buildWhatsAppUrl(link.dataset.message) || fallbackHref;
  });
};

const trackCtaClicks = () => {
  document.querySelectorAll('[data-track="cta"]').forEach((element) => {
    element.addEventListener('click', () => {
      sendAnalyticsEvent('cta_click', {
        location: element.dataset.location || 'unknown',
        channel: element.dataset.channel || 'unknown',
        intent: element.dataset.intent || 'unknown',
        label: element.textContent.trim().replace(/\s+/g, ' ')
      });
    });
  });
};

const trackSectionViews = () => {
  const trackedSections = new Set();
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || entry.intersectionRatio < SECTION_VIEW_THRESHOLD) return;

      const { trackSection, sectionName, funnelStage } = entry.target.dataset;
      if (!trackSection || trackedSections.has(trackSection)) return;

      trackedSections.add(trackSection);
      sendAnalyticsEvent('section_view', {
        section_id: trackSection,
        section_name: sectionName || trackSection,
        funnel_stage: funnelStage || 'unknown'
      });

      sectionObserver.unobserve(entry.target);
    });
  }, {
    threshold: [SECTION_VIEW_THRESHOLD]
  });

  document.querySelectorAll('[data-track-section]').forEach((section) => {
    sectionObserver.observe(section);
  });
};

const trackScrollDepth = () => {
  const triggered = new Set();

  const emitDepth = () => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollableHeight <= 0) return;

    const progress = Math.round((window.scrollY / scrollableHeight) * 100);

    SCROLL_DEPTH_CHECKPOINTS.forEach((checkpoint) => {
      if (progress < checkpoint || triggered.has(checkpoint)) return;

      triggered.add(checkpoint);
      sendAnalyticsEvent('scroll_depth', {
        percent_scrolled: checkpoint,
        page: 'home'
      });
    });
  };

  window.addEventListener('scroll', emitDepth, { passive: true });
  emitDepth();
};

// Fade-up on scroll — IntersectionObserver, zero libs, no layout thrash
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-up').forEach((element) => revealObserver.observe(element));

// Nav active link highlight
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const navSectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    navLinks.forEach((link) => {
      link.style.color = '';
    });

    const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
    if (activeLink) activeLink.style.color = 'var(--green)';
  });
}, { rootMargin: '-40% 0px -55%', threshold: 0 });

sections.forEach((section) => navSectionObserver.observe(section));

// Language Management (i18n) — Spanish and English
let currentLang = 'es';

const getPreferredLanguage = () => {
  try {
    const saved = localStorage.getItem('lang');
    if (saved === 'en' || saved === 'es') return saved;
    const navLangs = navigator.languages || [navigator.language];
    for (const l of navLangs) {
      if (!l) continue;
      const lower = l.toLowerCase();
      if (lower.startsWith('en')) return 'en';
      if (lower.startsWith('es')) return 'es';
    }
  } catch (e) {}
  return 'es';
};

const getNestedValue = (obj, path) => {
  if (!obj || !path) return null;
  return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : null), obj);
};

const applyLanguage = (lang) => {
  const dict = window.translations && window.translations[lang];
  if (!dict) return;
  currentLang = lang;

  document.documentElement.setAttribute('lang', lang);

  // Meta tags and document title
  if (dict.meta) {
    if (dict.meta.title) document.title = dict.meta.title;

    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta && dict.meta.description) descMeta.setAttribute('content', dict.meta.description);

    const kwMeta = document.querySelector('meta[name="keywords"]');
    if (kwMeta && dict.meta.keywords) kwMeta.setAttribute('content', dict.meta.keywords);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && dict.meta.og_title) ogTitle.setAttribute('content', dict.meta.og_title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc && dict.meta.og_description) ogDesc.setAttribute('content', dict.meta.og_description);

    const ogLocale = document.querySelector('meta[property="og:locale"]');
    if (ogLocale && dict.meta.og_locale) ogLocale.setAttribute('content', dict.meta.og_locale);

    const twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle && dict.meta.twitter_title) twTitle.setAttribute('content', dict.meta.twitter_title);

    const twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc && dict.meta.twitter_description) twDesc.setAttribute('content', dict.meta.twitter_description);
  }

  // Update text elements
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const val = getNestedValue(dict, key);
    if (val !== null && val !== undefined) {
      el.textContent = val;
    }
  });

  // Update HTML elements (with <em>, <br>, <strong>, etc.)
  document.querySelectorAll('[data-i18n-html]').forEach((el) => {
    const key = el.getAttribute('data-i18n-html');
    const val = getNestedValue(dict, key);
    if (val !== null && val !== undefined) {
      el.innerHTML = val;
    }
  });

  // Update element attributes
  document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
    const specs = el.getAttribute('data-i18n-attr').split(',');
    specs.forEach((spec) => {
      const parts = spec.trim().split(':');
      if (parts.length === 2) {
        const [attr, key] = parts;
        const val = getNestedValue(dict, key);
        if (val !== null && val !== undefined) {
          el.setAttribute(attr, val);
        }
      }
    });
  });

  // Update language toggle buttons active state
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    const btnLang = btn.getAttribute('data-lang');
    const isActive = btnLang === lang;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });

  // Update WhatsApp default message & re-hydrate links
  if (dict.whatsapp && dict.whatsapp.default_message) {
    if (siteConfig && siteConfig.contact) {
      siteConfig.contact.defaultMessage = dict.whatsapp.default_message;
    }
    hydrateWhatsAppLinks();
  }

  // Update WhatsApp float aria-label
  const floatWa = document.getElementById('btn-float-wa');
  if (floatWa && dict.whatsapp && dict.whatsapp.float_aria) {
    floatWa.setAttribute('aria-label', dict.whatsapp.float_aria);
    floatWa.setAttribute('title', dict.whatsapp.float_aria);
  }

  // Update theme toggle labels for the current language
  updateThemeToggleLabels();
};

const updateThemeToggleLabels = () => {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const dict = window.translations && window.translations[currentLang];
  if (!themeToggleBtn || !dict || !dict.nav) return;

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const label = isDark ? dict.nav.theme_to_light : dict.nav.theme_to_dark;
  themeToggleBtn.setAttribute('aria-label', label);
  themeToggleBtn.setAttribute('title', label);
};

const initLanguageToggle = () => {
  const initialLang = getPreferredLanguage();
  applyLanguage(initialLang);

  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const selectedLang = btn.getAttribute('data-lang');
      if (selectedLang && selectedLang !== currentLang) {
        try {
          localStorage.setItem('lang', selectedLang);
        } catch (e) {}
        const prev = currentLang;
        applyLanguage(selectedLang);
        sendAnalyticsEvent('language_change', {
          language: selectedLang,
          previous: prev
        });
      }
    });
  });
};

// Theme Toggle — Light mode default, Dark mode optional
const initThemeToggle = () => {
  const themeToggleBtn = document.getElementById('theme-toggle');

  const getPreferredTheme = () => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return 'light'; // Default is light mode
  };

  const setTheme = (theme) => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    }
    updateThemeToggleLabels();
  };

  setTheme(getPreferredTheme());

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', nextTheme);
      setTheme(nextTheme);
      sendAnalyticsEvent('theme_toggle', { theme: nextTheme });
    });
  }
};

hydrateWhatsAppLinks();
trackCtaClicks();
trackSectionViews();
trackScrollDepth();
initThemeToggle();
initLanguageToggle();

