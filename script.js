const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  }
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

const routePaths = document.querySelectorAll('.route path');
if (routePaths.length && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const drawRoute = () => {
    // The drawn tip tracks a point just above mid-viewport, so the lines
    // visibly form in the middle of the screen while scrolling.
    const doc = document.documentElement;
    const p = Math.min(1, (window.scrollY + window.innerHeight * 0.55) / doc.scrollHeight);
    routePaths.forEach((path, i) => {
      const pi = Math.max(0, Math.min(1, p - i * 0.05));
      path.style.strokeDashoffset = String(1 - pi);
    });
  };
  window.addEventListener('scroll', () => requestAnimationFrame(drawRoute), { passive: true });
  window.addEventListener('resize', drawRoute);
  drawRoute();
}

// --- Fun: chalk dust on tap/click ---
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion) {
  window.addEventListener('pointerdown', (e) => {
    for (let i = 0; i < 12; i++) {
      const d = document.createElement('div');
      d.className = 'chalk';
      d.style.left = e.clientX + 'px';
      d.style.top = e.clientY + 'px';
      document.body.appendChild(d);
      const ang = Math.random() * Math.PI * 2;
      const dist = 18 + Math.random() * 42;
      const dx = Math.cos(ang) * dist;
      const dy = Math.sin(ang) * dist - 12;
      const s = 0.5 + Math.random();
      d.animate([
        { transform: `translate(-50%, -50%) scale(${s})`, opacity: 0.9 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.1)`, opacity: 0 }
      ], {
        duration: 450 + Math.random() * 300,
        easing: 'cubic-bezier(0.2, 0.7, 0.3, 1)'
      }).onfinish = () => d.remove();
    }
  }, { passive: true });
}

// --- Fun: logo dyno + triple-tap hold confetti ---
const logo = document.querySelector('.hero-logo');

const holdConfetti = () => {
  const colors = ['#f5d90a', '#ef4444', '#22c55e', '#3b82f6', '#b16ce8', '#fb923c'];
  for (let i = 0; i < 26; i++) {
    const h = document.createElement('div');
    h.className = 'hold-confetti';
    const size = 10 + Math.random() * 10;
    h.style.width = size + 'px';
    h.style.height = size + 'px';
    h.style.left = Math.random() * 100 + 'vw';
    h.style.background = colors[Math.floor(Math.random() * colors.length)];
    h.style.borderRadius = '58% 42% 55% 45% / 45% 60% 40% 55%';
    document.body.appendChild(h);
    h.animate([
      { transform: 'translateY(-30px) rotate(0deg)', opacity: 1 },
      { transform: `translateY(105vh) rotate(${180 + Math.random() * 540}deg)`, opacity: 0.85 }
    ], {
      duration: 1800 + Math.random() * 1400,
      easing: 'cubic-bezier(0.35, 0, 0.8, 1)',
      delay: Math.random() * 250
    }).onfinish = () => h.remove();
  }
};

if (logo && !reduceMotion) {
  let taps = 0;
  let tapTimer;
  logo.addEventListener('click', () => {
    logo.classList.remove('dyno');
    void logo.offsetWidth;
    logo.classList.add('dyno');
    taps++;
    clearTimeout(tapTimer);
    tapTimer = setTimeout(() => { taps = 0; }, 1200);
    if (taps >= 3) {
      taps = 0;
      holdConfetti();
    }
  });
  logo.addEventListener('animationend', () => logo.classList.remove('dyno'));
}

// --- Ambient chalk motes (drift up; streak with scroll velocity) ---
if (!reduceMotion) {
  const wrap = document.createElement('div');
  wrap.className = 'motes';
  document.body.appendChild(wrap);

  const count = Math.min(60, Math.round(window.innerWidth * window.innerHeight / 26000));
  const motes = [];
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'mote';
    const size = 2 + Math.random() * 3;
    el.style.width = size + 'px';
    el.style.height = size + 'px';
    el.style.opacity = (0.12 + Math.random() * 0.25).toFixed(2);
    wrap.appendChild(el);
    motes.push({
      el,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vy: 8 + Math.random() * 14,
      amp: 6 + Math.random() * 18,
      phase: Math.random() * Math.PI * 2,
      freq: 0.2 + Math.random() * 0.5
    });
  }

  let scrollVel = 0;
  let lastY = window.scrollY;
  let lastScrollT = performance.now();
  window.addEventListener('scroll', () => {
    const now = performance.now();
    const dt = Math.max(8, now - lastScrollT);
    scrollVel = scrollVel * 0.7 + ((window.scrollY - lastY) / dt) * 1000 * 0.3;
    lastY = window.scrollY;
    lastScrollT = now;
  }, { passive: true });

  let lastT = performance.now();
  const tick = (now) => {
    const dt = Math.min(0.05, (now - lastT) / 1000);
    lastT = now;
    scrollVel *= 0.92;
    const streak = 1 + Math.min(3, Math.abs(scrollVel) / 900);
    const drag = scrollVel * 0.12;
    const h = window.innerHeight;
    const w = window.innerWidth;
    for (const m of motes) {
      m.y -= (m.vy + drag) * dt;
      m.phase += m.freq * dt;
      if (m.y < -30) { m.y = h + 30; m.x = Math.random() * w; }
      else if (m.y > h + 30) { m.y = -30; m.x = Math.random() * w; }
      const x = m.x + Math.sin(m.phase) * m.amp;
      m.el.style.transform = `translate3d(${x}px, ${m.y}px, 0) scaleY(${streak})`;
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// --- Stats count-up (HTML holds final values; JS animates from 0) ---
const counters = document.querySelectorAll('.stat-num span[data-count]');
if (counters.length && !reduceMotion) {
  counters.forEach((s) => { s.textContent = '0'; });
  const cio = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      cio.unobserve(entry.target);
      const target = parseInt(entry.target.dataset.count, 10);
      const t0 = performance.now();
      const dur = 1400;
      const step = (now) => {
        const p = Math.min(1, (now - t0) / dur);
        entry.target.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });
  counters.forEach((s) => cio.observe(s));
}
