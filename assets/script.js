const storage = {
  get(key, fallback = null) {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? item : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch {
      console.warn(`Failed to save ${key} to localStorage`);
      return false;
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }
};

function announceToScreenReader(message) {
  const announcer = document.getElementById('sr-announcer') || (() => {
    const el = document.createElement('div');
    el.id = 'sr-announcer';
    el.setAttribute('aria-live', 'polite');
    el.setAttribute('aria-atomic', 'true');
    el.className = 'sr-only';
    document.body.appendChild(el);
    return el;
  })();
  
  announcer.textContent = message;
  setTimeout(() => announcer.textContent = '', 1000);
}

const ConsentManager = (() => {
  const STORAGE_KEY = 'cookie_consent';
  let elements = {};
  
  const init = () => {
    elements = {
      banner: document.getElementById('cookie-consent'),
      btnAccept: document.getElementById('cc-accept'),
      btnDecline: document.getElementById('cc-decline'),
      btnManage: document.getElementById('cc-manage'),
    };
    
    if (!elements.banner) return;
    
    attachEvents();
    checkStoredConsent();
  };
  
  const attachEvents = () => {
    elements.btnAccept?.addEventListener('click', () => setConsent('granted'));
    elements.btnDecline?.addEventListener('click', () => setConsent('denied'));
    elements.btnManage?.addEventListener('click', (e) => {
      e.preventDefault();
      show();
    });
    
    // ESC to dismiss
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && elements.banner.getAttribute('aria-hidden') === 'false') {
        setConsent('denied'); // Treat ESC as decline
      }
    });
  };
  
  const show = () => {
    elements.banner.style.display = '';
    elements.banner.setAttribute('aria-hidden', 'false');
    setTimeout(() => elements.btnAccept?.focus(), 120);
  };
  
  const hide = () => {
    elements.banner.style.display = 'none';
    elements.banner.setAttribute('aria-hidden', 'true');
  };
  
  const setConsent = (value) => {
    storage.set(STORAGE_KEY, value);
    hide();
    
    if (value === 'granted') {
      Analytics.load();
    }
  };
  
  const checkStoredConsent = () => {
    const consent = storage.get(STORAGE_KEY);
    
    if (!consent) {
      // Delay banner to avoid aggressive popup
      setTimeout(show, 800);
    } else if (consent === 'granted') {
      Analytics.load();
    }
  };
  
  return { init, show };
})();

const Analytics = (() => {
  let loaded = false;
  
  const load = () => {
    if (loaded) return;
    
    const id = document.querySelector('meta[name="ga-measurement-id"]')?.content?.trim();
    
    if (!id || !/^G-[A-Z0-9]{6,}$/i.test(id)) {
      console.warn('Invalid GA measurement ID');
      return;
    }
    
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
    script.onerror = () => console.error('Failed to load Google Analytics');
    document.head.appendChild(script);
    
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', id, {
      anonymize_ip: true,
      cookie_flags: 'SameSite=None;Secure'
    });
    
    loaded = true;
    console.log('✓ Analytics loaded');
  };
  
  return { load };
})();

const ModalManager = (() => {
  let modal, elements, lastFocused;
  
  const init = () => {
    modal = document.getElementById('projectModal');
    if (!modal) return;
    
    elements = {
      title: modal.querySelector('.modal-title'),
      body: modal.querySelector('.proj-body-text'),
      tags: modal.querySelector('.modal-tags'),
      tools: modal.querySelector('.modal-tools'),
      link: modal.querySelector('.modal-open-link'),
      close: modal.querySelector('.modal-close'),
      thumb: modal.querySelector('[data-thumb]'),
    };
    
    attachEvents();
    bindProjects();
  };
  
  const attachEvents = () => {
    elements.close?.addEventListener('click', close);
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) close();
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('show')) {
        close();
      }
    });
  };
  
  const bindProjects = () => {
    document.querySelectorAll('.proj[data-title]').forEach(el => {
      const openHandler = () => open(extractData(el));
      
      el.addEventListener('click', openHandler);
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openHandler();
        }
      });
    });
  };
  
  const extractData = (el) => ({
    title: el.dataset.title ?? el.querySelector('h4')?.textContent ?? 'Project',
    desc: el.dataset.desc ?? el.querySelector('p')?.textContent ?? '',
    tags: el.dataset.tags ?? '',
    tools: el.dataset.tools ?? el.dataset.tags ?? '',
    thumb: el.dataset.thumb ?? '',
    link: el.dataset.link ?? '#',
  });
  
  const open = (data) => {
    lastFocused = document.activeElement;
    
    elements.title.textContent = data.title;
    elements.body.textContent = data.desc;
    elements.link.href = data.link;
    
    // Populate tags
    renderTags(elements.tags, data.tags);
    renderTags(elements.tools, data.tools);
    
    // Thumbnail
    renderThumbnail(data.thumb, data.title);
    
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    
    elements.close.focus();
    announceToScreenReader(`Opened ${data.title} dialog`);
  };
  
  const close = () => {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    lastFocused?.focus();
  };
  
  const renderTags = (container, tagString) => {
    if (!container) return;
    container.innerHTML = '';
    
    tagString.split(',')
      .map(t => t.trim())
      .filter(Boolean)
      .forEach(tag => {
        const el = document.createElement('div');
        el.className = 'tag';
        el.textContent = tag;
        container.appendChild(el);
      });
  };
  
  const renderThumbnail = (src, alt) => {
    if (!elements.thumb) return;
    elements.thumb.innerHTML = '';
    
    if (src) {
      const img = document.createElement('img');
      img.src = src;
      img.alt = `${alt} thumbnail`;
      img.style.cssText = 'width:100%;height:100%;object-fit:cover;';
      elements.thumb.appendChild(img);
    } else {
      elements.thumb.style.background = 'linear-gradient(135deg,#eef2ff,#f0f7ff)';
    }
  };
  
  return { init, open, close };
})();

const ThemeManager = (() => {
  let toggleButton;

  const init = () => {
    toggleButton = document.getElementById('theme-toggle');
    if (!toggleButton) return;

    attachEvents();
    loadSavedTheme();
  };

  const attachEvents = () => {
    toggleButton.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      set(current);
    });
  };

  const loadSavedTheme = () => {
    const saved = storage.get('theme');
    set(saved || 'light');
  };

  const set = (theme) => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced) {
      document.documentElement.classList.add('theme-switching');
      window.setTimeout(() => document.documentElement.classList.remove('theme-switching'), 300);
    }
    document.documentElement.setAttribute('data-theme', theme);
    storage.set('theme', theme);
    toggleButton.textContent = theme === 'light' ? '☀️' : '🌙';
    toggleButton.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`);
  };

  return { init };
})();

const UIEnhancements = (() => {
  const init = () => {
    updateYear();
    enhanceProjectNav();
  };

  const updateYear = () => {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  };

  const enhanceProjectNav = () => {
    document.addEventListener('keydown', (e) => {
      const focused = document.activeElement;
      if (!focused || !focused.classList.contains('proj')) return;

      const projects = Array.from(document.querySelectorAll('.proj[tabindex="0"]'));
      if (projects.length < 2) return;

      const currentIndex = projects.indexOf(focused);
      if (currentIndex === -1) return;

      let nextIndex;
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          nextIndex = (currentIndex + 1) % projects.length;
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          nextIndex = (currentIndex - 1 + projects.length) % projects.length;
          break;
        default:
          return;
      }

      e.preventDefault();
      projects[nextIndex]?.focus();
    });
  };

  return { init };
})();

function initAll() {
  ConsentManager.init();
  ModalManager.init();
  ThemeManager.init();
  UIEnhancements.init();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}