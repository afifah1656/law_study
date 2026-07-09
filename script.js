document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  });
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Scroll progress rule + header shadow + scroll-top button ---------- */
  const progressRule = document.getElementById('progressRule');
  const scrollTopBtn = document.getElementById('scrollTop');

  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressRule.style.width = pct + '%';
    scrollTopBtn.classList.toggle('show', scrollTop > 480);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Active nav link on scroll (scrollspy) ---------- */
  const navLinks = document.querySelectorAll('[data-nav]');
  const sections = Array.from(navLinks)
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = '#' + entry.target.id;
      const link = document.querySelector(`[data-nav][href="${id}"]`);
      if (!link) return;
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active-link'));
        link.classList.add('active-link');
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px' });

  sections.forEach(sec => spyObserver.observe(sec));

  /* ---------- Ledger entries reveal on scroll ---------- */
  const ledgerEntries = document.querySelectorAll('.ledger-entry');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });
  ledgerEntries.forEach(entry => revealObserver.observe(entry));

  /* ---------- Testimonial carousel ---------- */
  const slides = Array.from(document.querySelectorAll('.quote-slide'));
  const dotsWrap = document.getElementById('quoteDots');
  const prevBtn = document.getElementById('prevQuote');
  const nextBtn = document.getElementById('nextQuote');
  let current = 0;
  let autoTimer = null;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', 'Testimoni ' + (i + 1));
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function goToSlide(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    restartAutoplay();
  }

  prevBtn.addEventListener('click', () => goToSlide(current - 1));
  nextBtn.addEventListener('click', () => goToSlide(current + 1));

  function restartAutoplay() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goToSlide(current + 1), 6000);
  }
  restartAutoplay();

  /* ---------- Case study modal ---------- */
  const caseData = {
    1: {
      tag: 'Manufaktur',
      title: 'Restrukturisasi Rantai Pasok Regional',
      body: 'Klien menghadapi keterlambatan pengiriman kronis akibat jaringan distribusi yang tumbuh secara tidak terencana selama satu dekade. Kami memetakan ulang seluruh alur logistik, mengonsolidasikan titik distribusi, dan menerapkan sistem pemantauan berbasis data untuk memberi visibilitas penuh kepada tim operasional.',
      stats: [['Durasi', '5 bulan'], ['Tim', '4 konsultan'], ['Hasil Utama', 'Waktu tunggu -31%'], ['Cakupan', '6 provinsi']]
    },
    2: {
      tag: 'Jasa Keuangan',
      title: 'Kerangka Tata Kelola Risiko',
      body: 'Menjelang pemeriksaan regulator, klien membutuhkan kerangka manajemen risiko yang lebih kokoh dan terdokumentasi. Kami menyusun kebijakan baru, melatih tim kepatuhan internal, dan membangun mekanisme pelaporan risiko yang selaras dengan standar industri.',
      stats: [['Durasi', '4 bulan'], ['Tim', '3 konsultan'], ['Hasil Utama', 'Nihil temuan material'], ['Cakupan', 'Seluruh unit bisnis']]
    },
    3: {
      tag: 'Ritel',
      title: 'Model Operasi Ekspansi Multi-Kota',
      body: 'Klien berencana memperluas jaringan toko ke delapan kota baru dalam tiga tahun. Kami menyusun struktur organisasi yang dapat direplikasi, proyeksi keuangan per fase pembukaan, dan kerangka evaluasi kesiapan pasar untuk setiap lokasi kandidat.',
      stats: [['Durasi', '3 bulan'], ['Tim', '2 konsultan'], ['Hasil Utama', '8 kota terpetakan'], ['Cakupan', 'Proyeksi 3 tahun']]
    }
  };

  const modal = document.getElementById('caseModal');
  const modalTag = document.getElementById('modalTag');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalStats = document.getElementById('modalStats');
  const modalClose = document.getElementById('modalClose');
  let lastFocused = null;

  document.querySelectorAll('.case-link').forEach(btn => {
    btn.addEventListener('click', () => {
      const data = caseData[btn.dataset.case];
      if (!data) return;
      modalTag.textContent = data.tag;
      modalTitle.textContent = data.title;
      modalBody.textContent = data.body;
      modalStats.innerHTML = data.stats
        .map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`)
        .join('');
      lastFocused = document.activeElement;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      modalClose.focus();
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  /* ---------- Contact form validation ---------- */
  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  function setError(field, message) {
    const row = field.closest('.form-row');
    const errorEl = row.querySelector('.form-error');
    if (message) {
      row.classList.add('error');
      errorEl.textContent = message;
    } else {
      row.classList.remove('error');
      errorEl.textContent = '';
    }
  }

  function validateField(field) {
    const value = field.value.trim();
    if (field.hasAttribute('required') && !value) {
      setError(field, 'Wajib diisi.');
      return false;
    }
    if (field.type === 'email' && value) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        setError(field, 'Format surel tidak valid.');
        return false;
      }
    }
    setError(field, '');
    return true;
  }

  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fields = Array.from(form.querySelectorAll('input, select, textarea'));
    const allValid = fields.map(validateField).every(Boolean);

    if (allValid) {
      formSuccess.classList.add('show');
      form.reset();
      setTimeout(() => formSuccess.classList.remove('show'), 6000);
    } else {
      formSuccess.classList.remove('show');
      const firstError = form.querySelector('.form-row.error input, .form-row.error select, .form-row.error textarea');
      if (firstError) firstError.focus();
    }
  });

});
