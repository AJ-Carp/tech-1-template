// Utilities
const $  = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

const header = $('#site-header');
const tabs   = $$('#tabs .nav__link');

// Mobile nav toggle
const navToggle = $('#nav-toggle');
const nav       = $('#site-nav');

navToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});

// Close mobile nav on link click
tabs.forEach(a => a.addEventListener('click', () => {
  if (nav.classList.contains('open')) {
    nav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
}));

// Robust active section spy (stable, low-jitter)
(function sectionSpy(){
  const sections = ['home','about','projects','contact']
    .map(id => document.getElementById(id))
    .filter(Boolean);

  if (!sections.length) return;

  const headerPx = header?.getBoundingClientRect().height || 64;
  const topMargin = -(headerPx + 8);
  const bottomMargin = '-45%';

  const io = new IntersectionObserver((entries) => {
    const vis = entries
      .filter(e => e.isIntersecting)
      .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!vis) return;

    const id = `#${vis.target.id}`;
    tabs.forEach(t => t.classList.toggle('active', t.dataset.target === id || t.getAttribute('href') === id));
    history.replaceState(null, '', id);
  }, {
    root: null,
    rootMargin: `${topMargin}px 0px ${bottomMargin} 0px`,
    threshold: [0.15, 0.3, 0.6, 0.85]
  });

  sections.forEach(s => io.observe(s));

  window.addEventListener('load', () => {
    const hash = location.hash || '#home';
    setTimeout(() => {
      const el = document.getElementById(hash.slice(1));
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 10);
  });
})();

// Reveal-on-scroll animations
(function reveal(){
  const els = $$('[data-reveal]');
  if (!els.length) return;

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });

  els.forEach(el => io.observe(el));
})();

// Footer year
$('#year').textContent = new Date().getFullYear();

// Fake contact submit handler (demo)
$('#send-btn')?.addEventListener('click', () => {
  const name = $('#name').value.trim();
  const email = $('#email').value.trim();
  const msg = $('#message').value.trim();
  const status = $('#form-status');

  if (!name || !email || !msg) {
    status.textContent = 'Please fill in all fields.';
    status.style.color = '#ffb3b3';
    return;
  }
  status.textContent = 'Thanks! Your message has been queued (demo).';
  status.style.color = '#a0f0c5';
});
