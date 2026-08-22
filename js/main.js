/**
 * Ardra's Portfolio — Main JavaScript
 * Handles: Splash screen, scroll animations, navigation,
 * three-dot menu, back-to-top, scroll progress, micro-interactions
 */

(function () {
  'use strict';

  // ========================
  // DOM REFERENCES
  // ========================
  const splash = document.getElementById('splash');
  const mainContent = document.getElementById('mainContent');
  const scrollProgress = document.getElementById('scrollProgress');
  const backToTopBtn = document.getElementById('backToTop');
  const bottomNav = document.getElementById('bottomNav');
  const dotMenuBtn = document.getElementById('dotMenuBtn');
  const dotMenu = document.getElementById('dotMenu');
  const dotMenuOverlay = document.getElementById('dotMenuOverlay');

  // ========================
  // SPLASH SCREEN
  // ========================
  function initSplash() {
    document.body.classList.add('splash-active');
    
    setTimeout(() => {
      splash.classList.add('splash--hiding');
      document.body.classList.remove('splash-active');
      
      setTimeout(() => {
        splash.classList.add('splash--hidden');
        splash.style.display = 'none';
        // Trigger hero animations
        triggerHeroAnimations();
      }, 600);
    }, 2200);
  }

  // ========================
  // HERO ENTRANCE ANIMATIONS
  // ========================
  function triggerHeroAnimations() {
    const heroItems = document.querySelectorAll('.hero .anim-item');
    heroItems.forEach((item) => {
      const delay = parseInt(item.dataset.delay || 0, 10);
      setTimeout(() => {
        item.classList.add('anim-visible');
      }, delay);
    });
  }

  // ========================
  // SCROLL-TRIGGERED ANIMATIONS
  // ========================
  function initScrollAnimations() {
    const animItems = document.querySelectorAll('.anim-item:not(.hero .anim-item)');

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.15,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const item = entry.target;
          const delay = parseInt(item.dataset.delay || 0, 10);
          setTimeout(() => {
            item.classList.add('anim-visible');
          }, delay);
          observer.unobserve(item);
        }
      });
    }, observerOptions);

    animItems.forEach((item) => observer.observe(item));
  }

  // ========================
  // PROGRESS BAR ANIMATIONS (subjects)
  // ========================
  function initProgressBars() {
    const progressBars = document.querySelectorAll('.subject-card__progress-bar');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    progressBars.forEach((bar) => observer.observe(bar));
  }

  // ========================
  // SCROLL PROGRESS BAR
  // ========================
  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = scrollPercent + '%';
  }

  // ========================
  // BACK TO TOP BUTTON
  // ========================
  function updateBackToTop() {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ========================
  // BOTTOM NAVIGATION — Active Tracking
  // ========================
  function initBottomNav() {
    const navItems = bottomNav.querySelectorAll('.bottom-nav__item');
    const sections = [];

    navItems.forEach((item) => {
      const sectionId = item.dataset.section;
      const sectionEl = document.getElementById(sectionId);
      if (sectionEl) {
        sections.push({ id: sectionId, el: sectionEl, navItem: item });
      }
    });

    function updateActiveNav() {
      const scrollPos = window.scrollY + window.innerHeight / 3;

      let activeSection = sections[0];
      for (const section of sections) {
        if (section.el.offsetTop <= scrollPos) {
          activeSection = section;
        }
      }

      navItems.forEach((item) => item.classList.remove('active'));
      if (activeSection) {
        activeSection.navItem.classList.add('active');
      }
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();

    // Smooth scroll on click
    navItems.forEach((item) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = item.getAttribute('href').slice(1);
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          const offset = targetEl.offsetTop - 20;
          window.scrollTo({ top: offset, behavior: 'smooth' });
        }
      });
    });
  }

  // ========================
  // THREE-DOT MENU
  // ========================
  function initDotMenu() {
    function openMenu() {
      dotMenu.classList.add('open');
      dotMenuOverlay.classList.add('open');
      dotMenuBtn.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      dotMenu.classList.remove('open');
      dotMenuOverlay.classList.remove('open');
      dotMenuBtn.classList.remove('active');
      document.body.style.overflow = '';
    }

    dotMenuBtn.addEventListener('click', () => {
      if (dotMenu.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    dotMenuOverlay.addEventListener('click', closeMenu);

    // Menu item clicks
    const menuItems = dotMenu.querySelectorAll('.dot-menu__item');
    menuItems.forEach((item) => {
      item.addEventListener('click', (e) => {
        const href = item.getAttribute('href');
        // Only intercept internal links
        if (href.startsWith('#')) {
          e.preventDefault();
          const targetEl = document.getElementById(href.slice(1));
          if (targetEl) {
            closeMenu();
            setTimeout(() => {
              const offset = targetEl.offsetTop - 20;
              window.scrollTo({ top: offset, behavior: 'smooth' });
            }, 200);
          }
        } else {
          // External links (Instagram) — just close menu
          closeMenu();
        }
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dotMenu.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  // ========================
  // SMOOTH SCROLL FOR ALL ANCHOR LINKS
  // ========================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      // Skip bottom nav and dot menu items (handled separately)
      if (anchor.closest('.bottom-nav') || anchor.closest('.dot-menu')) return;

      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href').slice(1);
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          const offset = targetEl.offsetTop - 20;
          window.scrollTo({ top: offset, behavior: 'smooth' });
        }
      });
    });
  }

  // ========================
  // CARD MICRO-INTERACTIONS
  // ========================
  function initMicroInteractions() {
    // Touch feedback for interactive cards
    const interactiveCards = document.querySelectorAll(
      '.interest-card, .subject-card, .value-card, .fun-card, .social__link'
    );

    interactiveCards.forEach((card) => {
      card.addEventListener('touchstart', () => {
        card.classList.add('pressed');
      }, { passive: true });

      card.addEventListener('touchend', () => {
        setTimeout(() => card.classList.remove('pressed'), 150);
      }, { passive: true });

      card.addEventListener('touchcancel', () => {
        card.classList.remove('pressed');
      }, { passive: true });
    });

    // Button press feedback
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach((btn) => {
      btn.addEventListener('touchstart', () => {
        btn.classList.add('pressed');
      }, { passive: true });

      btn.addEventListener('touchend', () => {
        setTimeout(() => btn.classList.remove('pressed'), 150);
      }, { passive: true });

      btn.addEventListener('touchcancel', () => {
        btn.classList.remove('pressed');
      }, { passive: true });
    });
  }

  // ========================
  // FLOATING DECORATION PARALLAX
  // ========================
  function initParallax() {
    const decors = document.querySelectorAll('.hero__decor');
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          decors.forEach((decor, i) => {
            const speed = 0.03 + i * 0.015;
            decor.style.transform = `translateY(${scrollY * speed}px)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ========================
  // SCROLL EVENT HANDLER (throttled)
  // ========================
  let scrollTicking = false;
  function onScroll() {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        updateScrollProgress();
        updateBackToTop();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }

  // ========================
  // INITIALIZE EVERYTHING
  // ========================
  function init() {
    initSplash();
    initScrollAnimations();
    initProgressBars();
    initBottomNav();
    initDotMenu();
    initSmoothScroll();
    initMicroInteractions();
    initParallax();

    window.addEventListener('scroll', onScroll, { passive: true });
    backToTopBtn.addEventListener('click', scrollToTop);
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
