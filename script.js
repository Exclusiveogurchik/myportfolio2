/* ============================================
   MARK.DEV — PORTFOLIO SCRIPTS
   ============================================ */

// ─── Typing Effect ─────────────────────────
const roleEl = document.getElementById('typed-role');

if (roleEl) {
  const roles = [
    'Junior Programmer',
    'Frontend Developer',
    'Backend Engineer',
    'Fullstack Developer',
    'React Enthusiast'
  ];

  let roleIndex = 0;
  let charIndex = roles[0].length;
  let isDeleting = false;

  function typeRole() {
    const current = roles[roleIndex];

    if (isDeleting) {
      roleEl.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      roleEl.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? 35 : 75;

    if (!isDeleting && charIndex === current.length) {
      delay = 2800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 400;
    }

    setTimeout(typeRole, delay);
  }

  setTimeout(typeRole, 2000);
}

// ─── Navigation ────────────────────────────
const nav = document.getElementById('nav');
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobile-menu');

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

if (burger && mobileMenu) {
  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  });
});

// Active nav link tracking
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link');

function updateActiveLink() {
  let current = '';
  sections.forEach(section => {
    if (window.pageYOffset >= section.offsetTop - 200) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveLink);

// ─── Scroll Reveal ─────────────────────────
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // stagger siblings
      const parent = entry.target.parentElement;
      const siblings = parent.querySelectorAll('.reveal');
      let delay = 0;
      siblings.forEach((sibling, i) => {
        if (sibling === entry.target) delay = i * 80;
      });

      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);

      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -30px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ─── Counter Animation ────────────────────
const counters = document.querySelectorAll('[data-count]');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-count'));
      const duration = 1800;
      const start = performance.now();

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(target * eased);
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = target;
        }
      }

      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

counters.forEach(el => counterObserver.observe(el));

// ─── Tabs ──────────────────────────────────
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.getAttribute('data-tab');

    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    tabContents.forEach(content => {
      content.classList.remove('active');
      if (content.id === `tab-${target}`) {
        content.classList.add('active');
        // re-observe reveal elements inside
        content.querySelectorAll('.reveal:not(.visible)').forEach(el => {
          revealObserver.observe(el);
        });
      }
    });
  });
});

// ─── 3D Tilt on Cards ─────────────────────
if (window.innerWidth > 768) {
  const tiltCards = document.querySelectorAll('[data-tilt]');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rx = ((y - cy) / cy) * -3;
      const ry = ((x - cx) / cx) * 3;

      card.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s ease';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none';
    });
  });
}

// ─── Badge Mouse Parallax ─────────────────
const badge = document.getElementById('badge');
const heroVisual = document.getElementById('hero-visual');

if (badge && heroVisual && window.innerWidth > 768) {
  heroVisual.addEventListener('mousemove', (e) => {
    const rect = heroVisual.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;

    badge.style.animationPlayState = 'paused';
    badge.style.transform = `perspective(800px) rotateY(${-6 + x * 12}deg) rotateX(${2 + y * -8}deg)`;
  });

  heroVisual.addEventListener('mouseleave', () => {
    badge.style.animationPlayState = '';
    badge.style.transform = '';
  });
}

// ─── Stars Burst on Load ──────────────────
function createStarsBurst() {
  const container = document.getElementById('stars-burst');
  if (!container) return;

  const starTypes = [
    { cls: 'star--point', sizes: [10, 14, 18, 22] },
    { cls: 'star--cross', content: '+', sizes: [10, 13, 16] },
    { cls: 'star--dot', sizes: [3, 4, 5] },
    { cls: 'star--diamond', sizes: [5, 7, 9] },
    { cls: 'star--sparkle', content: '✦', sizes: [8, 11, 14] },
    { cls: 'star--sparkle', content: '✧', sizes: [10, 13, 16] },
    { cls: 'star--cross', content: '×', sizes: [9, 12, 15] },
  ];

  const count = 22;

  for (let i = 0; i < count; i++) {
    const type = starTypes[Math.floor(Math.random() * starTypes.length)];
    const size = type.sizes[Math.floor(Math.random() * type.sizes.length)];

    const star = document.createElement('div');
    star.className = `star ${type.cls}`;

    if (type.content) {
      star.textContent = type.content;
      star.style.fontSize = size + 'px';
    } else {
      star.style.width = size + 'px';
      star.style.height = size + 'px';
    }

    // Random fly direction — radial burst
    const angle = (Math.PI * 2 * i / count) + (Math.random() - 0.5) * 0.6;
    const distance = 80 + Math.random() * 140;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;
    const rot = (Math.random() - 0.5) * 180;
    const duration = 0.8 + Math.random() * 0.6;
    const delay = 0.3 + Math.random() * 0.5;
    const finalOpacity = 0.15 + Math.random() * 0.3;

    star.style.setProperty('--tx', tx + 'px');
    star.style.setProperty('--ty', ty + 'px');
    star.style.setProperty('--rot', rot + 'deg');
    star.style.setProperty('--duration', duration + 's');
    star.style.setProperty('--delay', delay + 's');
    star.style.setProperty('--final-opacity', finalOpacity);
    star.style.setProperty('--twinkle-delay', (Math.random() * 3) + 's');

    container.appendChild(star);

    // Trigger fly animation
    requestAnimationFrame(() => {
      star.classList.add('animate');
    });

    // After fly animation completes, switch to twinkle
    const totalTime = (delay + duration) * 1000 + 100;
    setTimeout(() => {
      star.classList.remove('animate');
      star.style.opacity = finalOpacity;
      star.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(1) rotate(${rot}deg)`;
      star.classList.add('twinkle');
    }, totalTime);
  }
}

// ─── Page Load ─────────────────────────────
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
    // Launch stars after fade-in
    setTimeout(createStarsBurst, 400);
  });
});
