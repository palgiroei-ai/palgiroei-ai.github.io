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
