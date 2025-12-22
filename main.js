// main.js — smooth scroll helper and safe nav highlight
(function () {
  // find nav links (if any)
  const links = Array.from(document.querySelectorAll('.nav-link'));
  if (!links || links.length === 0) return; // nothing to do

  const sections = links.map(l => document.querySelector(l.getAttribute('href')));
  const offset = 72; // pixels to account for any fixed header if present

  // Smooth scrolling
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset);
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // Highlight active link on scroll
  function onScroll() {
    const y = window.scrollY + offset + 1;
    let current = links[0];
    for (let i = 0; i < sections.length; i++) {
      const sec = sections[i];
      if (!sec) continue;
      if (y >= sec.offsetTop) current = links[i];
    }
    links.forEach(l => l.classList.toggle('active', l === current));
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
})();

// Post expand/collapse: reveal hidden paragraphs when a post is clicked
(function () {
  const posts = Array.from(document.querySelectorAll('.post'));
  if (!posts.length) return;

  posts.forEach(post => {
    // make the title look interactive
    const title = post.querySelector('.post-title');
    if (title) title.style.cursor = 'pointer';

    post.addEventListener('click', (e) => {
      // ignore clicks on links inside a post
      if (e.target && e.target.closest && e.target.closest('a')) return;
      post.classList.toggle('expanded');
      // for accessibility, update aria-hidden on content
      const content = post.querySelector('.post-content');
      if (content) content.setAttribute('aria-hidden', String(!post.classList.contains('expanded')));
      // scroll the expanded content into view smoothly
      if (post.classList.contains('expanded')) {
        content?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });
})();