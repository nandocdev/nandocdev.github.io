    // Fade-up on scroll — IntersectionObserver, zero libs, no layout thrash
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

    // Nav active link highlight
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          navLinks.forEach(a => a.style.color = '');
          const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
          if (active) active.style.color = 'var(--green)';
        }
      });
    }, { rootMargin: '-40% 0px -55%', threshold: 0 });

    sections.forEach(s => sectionObserver.observe(s));
