(() => {
  document.documentElement.classList.add('js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Header turns solid once you leave the hero
  const header = document.querySelector('[data-header]');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();

  // Reveal (content stays visible without JS)
  const targets = document.querySelectorAll('.section-head, .work-head, .steps li, .quotes blockquote, .picker');
  targets.forEach(el => el.setAttribute('data-reveal', ''));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    targets.forEach(el => io.observe(el));
  } else targets.forEach(el => el.classList.add('in'));

  // Services: swap the sticky photo with a crossfade
  const imgs = document.querySelectorAll('.svc-img');
  const items = document.querySelectorAll('.svc-item');
  let front = 0;
  const show = item => {
    if (item.classList.contains('is-active')) return;
    items.forEach(i => i.classList.toggle('is-active', i === item));
    if (!imgs.length) return;
    const back = imgs[1 - front];
    back.src = item.dataset.img;
    const swap = () => { imgs[front].classList.remove('is-on'); back.classList.add('is-on'); front = 1 - front; };
    back.complete ? swap() : back.addEventListener('load', swap, { once: true });
  };
  items.forEach(item => {
    const pre = new Image(); pre.src = item.dataset.img;
    item.addEventListener('mouseenter', () => show(item));
    item.addEventListener('focus', () => show(item));
    item.addEventListener('click', () => show(item));
  });
  // On scroll (desktop), the row nearest the middle of the screen drives the photo
  if ('IntersectionObserver' in window && matchMedia('(min-width: 901px)').matches) {
    const mid = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) show(e.target); }),
      { rootMargin: '-45% 0px -45% 0px' });
    items.forEach(i => mid.observe(i));
  }

  // Materials picker (accessible tabs)
  const picker = document.querySelector('[data-picker]');
  if (picker) {
    const tabs = [...picker.querySelectorAll('[role=tab]')];
    const house = picker.querySelector('[data-house]');
    const select = tab => {
      tabs.forEach(t => {
        const on = t === tab;
        t.setAttribute('aria-selected', on);
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
      const mat = tab.dataset.mat;
      house.dataset.house = mat;
      house.querySelectorAll('.roof-tex').forEach(r => r.classList.toggle('is-on', r.classList.contains('t-' + mat)));
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', e => {
        const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        const n = tabs[(i + d + tabs.length) % tabs.length];
        n.focus(); select(n);
      });
    });
  }

  // Work strip arrows
  const track = document.querySelector('[data-strip-track]');
  document.querySelectorAll('[data-strip]').forEach(b => b.addEventListener('click', () => {
    const step = track.querySelector('figure').getBoundingClientRect().width + 16;
    track.scrollBy({ left: step * Number(b.dataset.strip), behavior: reduce ? 'auto' : 'smooth' });
  }));

  // Hero postcode box: carry the postcode into the full form
  const zip = document.querySelector('[data-zip]');
  const form = document.querySelector('[data-form]');
  if (zip && form) {
    zip.addEventListener('submit', e => {
      e.preventDefault();
      const v = zip.elements.zip.value.trim();
      if (v) form.elements.zip.value = v;
      document.getElementById('quote').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
      setTimeout(() => {
        form.elements.name.focus({ preventScroll: true });
        form.classList.remove('flash'); void form.offsetWidth; form.classList.add('flash');
      }, reduce ? 0 : 650);
    });
  }

  // Quote form: inline validation + success state.
  // NOTE: no backend is wired. Set FORM_ENDPOINT (e.g. a Formspree URL) to send real enquiries.
  const FORM_ENDPOINT = '';
  if (form) {
    const required = ['name', 'phone', 'zip'];
    const check = name => {
      const input = form.elements[name];
      const field = input.closest('.field');
      let ok = input.value.trim().length > 0;
      if (name === 'phone') ok = input.value.replace(/\D/g, '').length >= 7;
      field.classList.toggle('invalid', !ok);
      input.setAttribute('aria-invalid', String(!ok));
      input.setAttribute('aria-describedby', 'e-' + name);
      return ok;
    };
    required.forEach(n => {
      form.elements[n].addEventListener('blur', () => { if (form.elements[n].value) check(n); });
      form.elements[n].addEventListener('input', () => {
        if (form.elements[n].closest('.field').classList.contains('invalid')) check(n);
      });
    });
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const results = required.map(check);
      if (results.includes(false)) { form.elements[required[results.indexOf(false)]].focus(); return; }
      const btn = form.querySelector('button[type=submit]');
      btn.disabled = true; btn.textContent = 'Sending…';
      try {
        if (FORM_ENDPOINT) {
          const res = await fetch(FORM_ENDPOINT, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
          if (!res.ok) throw new Error('send failed');
        }
        form.querySelectorAll('.field, .btn, .form-note').forEach(el => el.hidden = true);
        form.querySelector('.form-done').hidden = false;
      } catch {
        btn.disabled = false; btn.textContent = 'Request my inspection';
        alert("Sorry, that didn't send. Please call us on (555) 014-2290.");
      }
    });
  }
})();
