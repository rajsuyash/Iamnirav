(() => {
  // Sticky nav background
  const nav = document.querySelector('.nav');
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu
  const toggle = document.querySelector('.nav__toggle');
  const menu = document.getElementById('nav-menu');
  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.classList.toggle('open', open);
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

  // Company "step" indicators (6 squares, n filled)
  document.querySelectorAll('.steps').forEach((el) => {
    const n = Number(el.dataset.n);
    el.innerHTML = Array.from({ length: 6 }, (_, i) => `<i class="${i < n ? 'on' : ''}"></i>`).join('');
  });

  // Reveal on scroll
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('in'));
  }

  // Marquee: duplicate content for a seamless loop
  const track = document.querySelector('.marquee__track');
  if (track) track.innerHTML += track.innerHTML;

  // Horizontal carousels (episodes + contact cards)
  const carousel = (trackEl, buttons, dotsEl) => {
    if (!trackEl) return;
    const step = () => {
      const item = trackEl.children[0];
      return item ? item.getBoundingClientRect().width + 12 : trackEl.clientWidth;
    };
    buttons.forEach((b) => b.addEventListener('click', () => {
      trackEl.scrollBy({ left: step() * Number(b.dataset.dir), behavior: 'smooth' });
    }));
    if (!dotsEl) return;
    const pages = () => Math.max(1, Math.round((trackEl.scrollWidth - trackEl.clientWidth) / step()) + 1);
    const render = () => {
      const count = pages();
      if (dotsEl.children.length !== count) {
        dotsEl.innerHTML = Array.from({ length: count }, (_, i) => `<button aria-label="Go to slide ${i + 1}" data-i="${i}"></button>`).join('');
        dotsEl.querySelectorAll('button').forEach((d) => d.addEventListener('click', () => {
          trackEl.scrollTo({ left: step() * Number(d.dataset.i), behavior: 'smooth' });
        }));
      }
      const idx = Math.round(trackEl.scrollLeft / step());
      [...dotsEl.children].forEach((d, i) => d.classList.toggle('on', i === idx));
      dotsEl.style.visibility = count > 1 ? 'visible' : 'hidden';
    };
    trackEl.addEventListener('scroll', () => requestAnimationFrame(render), { passive: true });
    window.addEventListener('resize', render);
    render();
  };
  carousel(document.querySelector('.episodes__track'), document.querySelectorAll('.episodes__nav .round'), document.querySelector('.dots'));
  carousel(document.querySelector('.contact__track'), document.querySelectorAll('.contact__nav .square'));

  // Newsletter (AJAX to subscribe.php, falls back to normal form post)
  const form = document.querySelector('.newsletter');
  if (form && window.fetch) {
    const msg = form.querySelector('.newsletter__msg');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button');
      btn.disabled = true;
      msg.textContent = '';
      try {
        const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        const data = await res.json().catch(() => ({}));
        msg.textContent = data.message || (res.ok ? 'Thanks for subscribing!' : 'Something went wrong. Please try again.');
        if (res.ok) form.reset();
      } catch {
        msg.textContent = 'Network error. Please try again.';
      } finally {
        btn.disabled = false;
      }
    });
  }

  document.getElementById('yr').textContent = new Date().getFullYear();
})();
