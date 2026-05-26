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
  const phone = siteConfig?.contact?.whatsappPhone;
  const defaultMessage = siteConfig?.contact?.defaultMessage || '';
  const finalMessage = message || defaultMessage;

  if (!phone) return 'https://wa.me/';

  return `https://wa.me/${phone}?text=${encodeURIComponent(finalMessage)}`;
};

const hydrateWhatsAppLinks = () => {
  document.querySelectorAll('[data-whatsapp-link]').forEach((link) => {
    link.href = buildWhatsAppUrl(link.dataset.message);
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
      if (!entry.isIntersecting || entry.intersectionRatio < 0.45) return;

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
    threshold: [0.45]
  });

  document.querySelectorAll('[data-track-section]').forEach((section) => {
    sectionObserver.observe(section);
  });
};

const trackScrollDepth = () => {
  const checkpoints = [25, 50, 75, 100];
  const triggered = new Set();

  const emitDepth = () => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollableHeight <= 0) return;

    const progress = Math.round((window.scrollY / scrollableHeight) * 100);

    checkpoints.forEach((checkpoint) => {
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

hydrateWhatsAppLinks();
trackCtaClicks();
trackSectionViews();
trackScrollDepth();
