(function(){ // IIFE to contain scope

  // --- 1. Cookie Consent Manager ---
  try {
    const banner = document.getElementById('cookie-consent');
    const btnAccept = document.getElementById('cc-accept');
    const btnDecline = document.getElementById('cc-decline');
    const manage = document.getElementById('cc-manage');

    if (!banner || !btnAccept || !btnDecline) return;

    function showBanner() {
      banner.style.display = '';
      banner.setAttribute('aria-hidden', 'false');
      banner.classList.add('visible');
      banner.tabIndex = -1;
      setTimeout(() => btnAccept.focus(), 120);
    }

    function hideBanner() {
      banner.style.display = 'none';
      banner.setAttribute('aria-hidden', 'true');
    }

    function setConsent(value) {
      try {
        localStorage.setItem('cookie_consent', value);
      } catch (e) {}
    }

    btnAccept.addEventListener('click', function() {
      setConsent('granted');
      hideBanner();
      if (window.loadGtag) window.loadGtag();
    });

    btnDecline.addEventListener('click', function() {
      setConsent('denied');
      hideBanner();
      if (window.logPageViewFallback) window.logPageViewFallback();
    });

    if (manage) {
      manage.addEventListener('click', function(e) {
        e.preventDefault();
        showBanner();
      });
    }

    const stored = localStorage.getItem('cookie_consent');
    if (!stored) {
      setTimeout(showBanner, 800);
    } else if (stored === 'granted') {
      if (window.loadGtag) window.loadGtag();
    } else if (stored === 'denied') {
      if (window.logPageViewFallback) window.logPageViewFallback();
    }

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && banner.getAttribute('aria-hidden') === 'false') {
        hideBanner();
      }
    });
  } catch (e) {
    console.warn('Cookie consent manager failed', e);
  }

  // --- 2. Google Analytics Loader ---
  window.__gtag_loaded = false;
  window.loadGtag = function() {
    if (window.__gtag_loaded) return true;
    try {
      const meta = document.querySelector('meta[name="ga-measurement-id"]');
      if (!meta) return false;
      const id = (meta.content || "").trim();
      if (!id || !/^G-[A-Z0-9]{6,}$/i.test(id)) return false;

      const s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
      document.head.appendChild(s);

      window.dataLayer = window.dataLayer || [];
      function gtag() { dataLayer.push(arguments); }
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', id, { 'anonymize_ip': true });

      window.__gtag_loaded = true;
      console.log('Google Analytics loaded (consent granted).');
      return true;
    } catch (e) {
      console.warn('loadGtag failed', e);
      return false;
    }
  };

  // --- 3. Privacy-Friendly Fallback for Page Views ---
  window.logPageViewFallback = function() {
    try {
      const meta = document.querySelector('meta[name="ga-measurement-id"]');
      if (!meta) return;
      const id = (meta.content || "").trim();
      if (!id || !/^G-[A-Z0-9]{6,}$/i.test(id)) return;

      // Use navigator.sendBeacon for a lightweight, non-blocking request
      if (navigator.sendBeacon) {
        const url = `https://www.google-analytics.com/mp/collect?measurement_id=${id}&api_secret=YOUR_API_SECRET`; // Replace with your API Secret
        const payload = JSON.stringify({
          client_id: 'fallback.' + Date.now() + '.' + Math.random().toString(36).substring(2),
          events: [{ name: 'page_view_fallback' }]
        });
        navigator.sendBeacon(url, payload);
        console.log('Logged anonymous page view (consent denied).');
      }
    } catch (e) {
      console.warn('logPageViewFallback failed', e);
    }
  };

})();

(function(){ const modal = document.getElementById('projectModal'); const titleEl = modal.querySelector('.modal-title'); const bodyEl = modal.querySelector('.proj-body-text'); const tagsEl = modal.querySelector('.modal-tags'); const linkEl = modal.querySelector('.modal-open-link'); const closeBtn = modal.querySelector('.modal-close'); const thumbEl = modal.querySelector('[data-thumb]'); const toolsEl = modal.querySelector('.modal-tools'); let lastFocused = null; function openModal(data){ lastFocused = document.activeElement; titleEl.textContent = data.title; bodyEl.textContent = data.desc; // populate tools area (if provided) otherwise use tags toolsEl.innerHTML = ''; const tools = (data.tools || data.tags || '').split(',').map(t=>t.trim()).filter(Boolean); tools.forEach(t=>{ const s=document.createElement('div'); s.className='tag'; s.textContent=t; toolsEl.appendChild(s); }); // tag chips tagsEl.innerHTML = ''; (data.tags || '').split(',').map(t=>t.trim()).filter(Boolean).forEach(t=>{ const d=document.createElement('div'); d.className='tag'; d.textContent=t; tagsEl.appendChild(d); }); linkEl.href = data.link || '#'; // thumbnail thumbEl.innerHTML = ''; if(data.thumb){ const img=document.createElement('img'); img.src=data.thumb; img.alt = data.title + ' thumbnail'; img.style.width='100%'; img.style.height='100%'; img.style.objectFit='cover'; thumbEl.appendChild(img); } else { thumbEl.style.background='linear-gradient(135deg,#eef2ff,#f0f7ff)'; } modal.classList.add('show'); modal.setAttribute('aria-hidden','false'); // focus close button closeBtn.focus(); } function closeModal(){ modal.classList.remove('show'); modal.setAttribute('aria-hidden','true'); if(lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus(); } document.querySelectorAll('.projects .proj').forEach(el=>{ function handler(){ openModal({ title: el.getAttribute('data-title') || el.querySelector('h4')?.innerText || 'Project', desc: el.getAttribute('data-desc') || el.querySelector('p')?.innerText || '', tags: el.getAttribute('data-tags') || '', tools: el.getAttribute('data-tools') || el.getAttribute('data-tags') || '', thumb: el.getAttribute('data-thumb') || '', link: el.getAttribute('data-link') || '#' }); } el.addEventListener('click', handler); el.addEventListener('keydown', (ev)=>{ if(ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); handler(); } }); }); // .proj-row markup is now static in the HTML; no runtime injection required closeBtn.addEventListener('click', closeModal); modal.addEventListener('click', (ev)=>{ if(ev.target === modal) closeModal(); }); document.addEventListener('keydown', (ev)=>{ if(ev.key === 'Escape' && modal.classList.contains('show')) closeModal(); }); })(); // Theme toggle logic const themeToggle = document.getElementById('theme-toggle'); function setTheme(theme) { // reduced-motion check const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches; if(!prefersReduced){ document.documentElement.classList.add('theme-switching'); // ensure the class is removed after the CSS transition window.setTimeout(()=> document.documentElement.classList.remove('theme-switching'), 300); } document.documentElement.setAttribute('data-theme', theme); localStorage.setItem('theme', theme); if(theme === 'light') themeToggle.textContent = '☀️'; else themeToggle.textContent = '🌙'; } // On load, set theme from localStorage; default to light when not set (function(){ // Calendly lazy loader: injects an iframe only when the user requests to schedule const saved = localStorage.getItem('theme'); if(saved) { setTheme(saved); } else { // Default to light for consistent appearance unless the user has saved a preference setTheme('light'); } })(); themeToggle.addEventListener('click', function(){ const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light'; setTheme(current); // accessibility: reflect pressed state themeToggle.setAttribute('aria-pressed', String(current === 'light')); }); // utility document.getElementById('year').textContent = new Date().getFullYear(); // project modal (handled in the main script at the end of the file) // Enhance navlink focus/hover for keyboard users and add a tiny click accent for the resume button (function(){ try{ const navlinks = Array.from(document.querySelectorAll('.navlink')); navlinks.forEach(a=>{ a.addEventListener('keydown', (e)=>{ if(e.key === 'Enter' || e.key === ' ') a.click(); }); }); const resume = document.querySelector('.btn'); if(resume){ resume.addEventListener('click', (e)=>{ // tiny visual feedback: pulse the button then allow default resume.animate([ { transform: 'scale(1)', boxShadow: getComputedStyle(resume).boxShadow }, { transform: 'scale(0.98)', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }, { transform: 'scale(1)', boxShadow: getComputedStyle(resume).boxShadow } ], { duration: 260, easing: 'ease-out' }); }); } }catch(err){ console.warn('nav enhancement failed', err); } })(); // Contact card equalization is handled via CSS Grid (grid-auto-rows:1fr + height:100%) // Ensure any .proj with a data-link has a visible compact Jump button (function(){ try{ document.querySelectorAll('.proj').forEach(p=>{ const link = p.dataset.link; if(!link) return; const h4 = p.querySelector('h4'); if(!h4) return; if(h4.querySelector('.proj-icon')) return; const a = document.createElement('a'); a.className = 'proj-icon'; a.href = link; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.setAttribute('aria-label', `Jump on Project: ${p.dataset.title || 'Project'}`); a.title = 'Jump on Project'; a.innerHTML = `<svg width=