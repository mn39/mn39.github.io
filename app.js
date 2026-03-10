(() => {
  const eyes = document.querySelectorAll('.eye');

  function trackEyes(clientX, clientY) {
    eyes.forEach(eye => {
      const pupil = eye.querySelector('.pupil');
      const rect = eye.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const dx = clientX - cx;
      const dy = clientY - cy;
      const angle = Math.atan2(dy, dx);
      const dist = Math.hypot(dx, dy);

      const maxX = rect.width * 0.18;
      const maxY = rect.height * 0.18;
      const ease = Math.min(dist / 200, 1);

      const x = Math.cos(angle) * maxX * ease;
      const y = Math.sin(angle) * maxY * ease;

      pupil.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    });
  }

  // Center pupils initially
  eyes.forEach(eye => {
    const pupil = eye.querySelector('.pupil');
    pupil.style.left = '50%';
    pupil.style.top = '50%';
    pupil.style.transform = 'translate(-50%, -50%)';
  });

  document.addEventListener('mousemove', e => trackEyes(e.clientX, e.clientY));

  document.addEventListener('touchmove', e => {
    const t = e.touches[0];
    trackEyes(t.clientX, t.clientY);
  }, { passive: true });

  // Card entrance animation
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.project-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(40px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
  });
})();
