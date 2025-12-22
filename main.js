// main.js — smooth scrolling and active nav link on scroll
(function () {
  const links = Array.from(document.querySelectorAll('.nav-link'));
  const sections = links.map(l => document.querySelector(l.getAttribute('href')));
  const offset = 80;

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - 72,
        behavior: 'smooth'
      });
    });
  });

  function onScroll() {
    const y = window.scrollY + offset;
    let current = links[0];
    for (let i = 0; i < sections.length; i++) {
      if (!sections[i]) continue;
      const top = sections[i].offsetTop;
      if (y >= top) current = links[i];
    }
    links.forEach(l => l.classList.toggle('active', l === current));
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
})();