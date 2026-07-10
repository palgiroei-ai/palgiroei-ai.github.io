const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  }
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

const routePath = document.querySelector('.route path');
if (routePath && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const drawRoute = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(1, window.scrollY / max) : 1;
    routePath.style.strokeDashoffset = String(1 - p);
  };
  window.addEventListener('scroll', () => requestAnimationFrame(drawRoute), { passive: true });
  window.addEventListener('resize', drawRoute);
  drawRoute();
}
