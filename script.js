const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.documentElement.classList.add("js");
if (prefersReducedMotion) {
  document.documentElement.classList.add("reduce-motion");
}

window.addEventListener('load', () => {
  // Desktop layout starts strictly above 900px in CSS.
  // Below that, the header is not positioned with large offsets, so we must NOT apply desktop GSAP x values.
  const isNarrow = window.matchMedia('(max-width: 900px)').matches; // This line is retained for context

  if (prefersReducedMotion) {
    const loadContainer = document.querySelector('.load-container');
    if (loadContainer) {
      loadContainer.style.display = 'none';
    }

    // Mettre directement le header dans son état final (sans animation)
    if (window.gsap) {
      // With the new header CSS, the final state is always x:0.
      gsap.set('.header-bloc', { x: 0 });
      gsap.set('.header-tache-yellow', { x: 0 });
      gsap.set('.header-tache-blue', { x: 0 });
      gsap.set('.header-tache-green', { x: 0 });
      gsap.set('.header-tache-red', { x: 0 });
      gsap.set('.header-tache-orange', { x: 0 });
    }

    return;
  }

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  loader(); // Call loader without parameters
  initScrollTimelines();
  initSkillsAnimations();
  initSectionRevealAnimations();
  initMeAnimations();
  initProjectsAnimations();
  initContactAnimations();
  initFooterAnimations();
});
function initFooterAnimations() {
  if (!window.gsap || !window.ScrollTrigger) return;

  const footer = document.querySelector('footer');
  if (!footer || prefersReducedMotion) return;

  const info = footer.querySelector('.footer-info');
  const links = gsap.utils.toArray('.footer-links a');
  const socials = gsap.utils.toArray('.footer-socials a');

  if (info) gsap.set(info, { opacity: 0, y: 16 });
  if (links.length) gsap.set(links, { opacity: 0, y: 16 });
  if (socials.length) gsap.set(socials, { opacity: 0, y: 16 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: footer,
      start: 'top 90%',
      once: true,
    }
  });

  if (info) tl.to(info, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
  if (links.length) tl.to(links, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.08 }, '-=0.2');
  if (socials.length) tl.to(socials, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.08 }, '-=0.3');
}
function initContactAnimations() {
  if (!window.gsap || !window.ScrollTrigger) return;

  const contactSection = document.querySelector('.contact');
  const cards = gsap.utils.toArray('.contact .contact-list');
  if (!contactSection || !cards.length) return;

  if (prefersReducedMotion) {
    gsap.set(cards, { opacity: 1, y: 0, clearProps: 'transform' });
    return;
  }

  gsap.set(cards, { opacity: 0, y: 24 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: contactSection,
      start: 'top 85%',
      once: true,
    }
  });

  tl.to(cards, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.12 });
}
function initProjectsAnimations() {
  if (!window.gsap || !window.ScrollTrigger) return;

  const blocks = gsap.utils.toArray('#projects .project-container');
  if (!blocks.length) return;

  if (prefersReducedMotion) {
    blocks.forEach((block) => {
      const top = block.querySelector('.top-project-container');
      const dev = block.querySelector('.dev-container');
      const cards = dev ? gsap.utils.toArray(dev.querySelectorAll('.project-card')) : [];
      gsap.set(block, { opacity: 1, y: 0, clearProps: 'all' });
      if (top) gsap.set(top, { opacity: 1, x: 0 });
      if (dev) gsap.set(dev, { opacity: 1, y: 0 });
      if (cards.length) gsap.set(cards, { opacity: 1, y: 0 });
    });
    return;
  }

  blocks.forEach((block, index) => {
    const isEven = index % 2 === 0;
    const top = block.querySelector('.top-project-container');
    const dev = block.querySelector('.dev-container');
    const cards = dev ? gsap.utils.toArray(dev.querySelectorAll('.project-card')) : [];

    // Initial states
    gsap.set(block, { opacity: 0, y: 24 });
    if (top) gsap.set(top, { opacity: 0, x: -40 });
    if (dev) gsap.set(dev, { opacity: 0, y: 30 });
    if (cards.length) gsap.set(cards, { opacity: 0, y: 20 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: block,
        start: 'top 85%',
        once: true,
      }
    });

    tl.to(block, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
    if (top) tl.to(top, { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }, '-=0.45');
    if (dev) tl.to(dev, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4');
    if (cards.length) tl.to(cards, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.1 }, '-=0.35');

    // Subtle vertical parallax for the dev container and cards on page scroll
    if (dev) {
      gsap.to(dev, {
        yPercent: isEven ? -4 : 4,
        ease: 'none',
        scrollTrigger: {
          trigger: block,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5,
        }
      });
    }
    if (cards.length) {
      gsap.to(cards, {
        y: isEven ? 8 : -8,
        ease: 'none',
        scrollTrigger: {
          trigger: block,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5,
        }
      });
    }
  });
}

function loader(isNarrow) {
  // Animate from an offset to the CSS layout position (x:0)
  const titleStartX = 0; // title moves to final position
  const persoStartX = 0; // character moves to final position
  const tacheStartXLeft = 0;
  const tacheStartXRight = 0;

  // Ensure the layout container stays centered; animate elements inside.
  gsap.set('.header-bloc', { x: 0 });
  gsap.set('.header-tache-yellow', { x: 0 });
  gsap.set('.header-tache-blue', { x: 0 });
  gsap.set('.header-tache-green', { x: 0 });
  gsap.set('.header-tache-red', { x: 0 });
  gsap.set('.header-tache-orange', { x: 0 });

  const TLLOAD = gsap.timeline();
  TLLOAD
  .to('.images-container', {height: 400, duration: 1.3, delay: 0.4, ease : 'power2.out'})
  .to('.bloc-txt', {height: 'auto', duration: 0.6, delay: 0.6, ease : 'power2.out'}, '-=0.8')
 
  .to('.bloc-txt h2', {y: 0, ease : 'power2.out'}, '-=0.6')

  .to('.f2', {y: 0, duration : 0.4, ease : 'power2.out'})
  .add(() => {
    document.querySelector('.flip-img1').style.backgroundColor = "";
    // document.querySelector('.flip-img1').style.backgroundImage = "url('ressources/image1.jpg')";
    const flipText = document.querySelector('.flip-img1 p');
    if (flipText) flipText.textContent = 'Animer';
  })
  .to('.f2', {y: '-100%'})

  .to('.load-container', {opacity: 0, duration: .8, delay: .7})
  .add(()=> {
    document.querySelector('.load-container').style.display = "none";
  })
  .to('.header-bloc', {x: -750, duration: 1.3, ease: 'power2.out'}, '-=1') 
  .to('.header-tache-yellow', {x: -250, duration: 1.3, ease: 'power2.out'}, '-=1.3') 
  .to('.header-tache-blue', {x: 250, duration: 1.3, ease: 'power2.out'}, '-=1.3')
  .to('.header-tache-green', {x: 250, duration: 1.3, ease: 'power2.out'}, '-=1.3')
  .to('.header-tache-red', {x: -250, duration: 1.3, ease: 'power2.out'}, '-=1.3')
    .to('.header-tache-orange', {x: 250, duration: 1.3, ease: 'power2.out'}, '-=1.3')
    // Header elements entrance
    .from('.header-container h1', {opacity: 0, y: -24, rotate: -2, duration: 0.8, ease: 'power2.out'}, '-=0.6')
    .from('.header-perso', {opacity: 0, x: 80, scale: 0.98, transformOrigin: '50% 50%', duration: 0.9, ease: 'power3.out'}, '-=0.7');

    // Gentle wobble loop on the character (skip if reduced motion)
    if (!prefersReducedMotion) {
      gsap.to('.header-perso', { rotate: 1.2, duration: 2.4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    }
}

function initScrollTimelines() {
  if (!window.gsap) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: "header",
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
    }
  });

  tl.to('.header-tache-yellow', { y: -300, duration: 1 }, 0)
    .to('.header-tache-blue', { y: -300, duration: 1 }, 0)
    .to('.header-tache-green', { y: -300, duration: 1 }, 0)
    .to('.header-tache-red', { y: -300, duration: 1 }, 0)
    .to('.header-tache-orange', { y: -300, duration: 1 }, 0);

    // Header parallax: subtle motion while scrolling the header
    const header = document.querySelector('.header-container');
    if (header && !prefersReducedMotion) {
      gsap.to('.header-bloc', {
        y: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: header,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
        }
      });

      gsap.to('.header-perso', {
        y: -20,
        scale: 1.02,
        ease: 'none',
        scrollTrigger: {
          trigger: header,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
        }
      });
    }

  // Remove old me animation block
  const isMobile = window.matchMedia('(max-width: 600px)').matches;
  if (isMobile) return;
  
  const meContainer = document.querySelector('.me-container');
  const meCard = document.querySelector('.me-card');
  const meDetails = document.querySelector('.me-details');
  if (!meContainer || (!meCard && !meDetails)) return;
  
  const containerRect = meContainer.getBoundingClientRect();
  const isAlreadyVisible = containerRect.top < window.innerHeight * 0.85;
  if (isAlreadyVisible) {
    gsap.set([meCard, meDetails].filter(Boolean), { x: 0, opacity: 1, clearProps: 'transform' });
    return;
  }
  
  const tlMe = gsap.timeline({
    scrollTrigger: {
      trigger: meContainer,
      start: "top 85%",
      once: true,
    }
  });
  
  if (meCard) {
    tlMe.fromTo(
      meCard,
      { opacity: 0, x: -40 },
      { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out', immediateRender: false },
      0
    );
  }
  
  if (meDetails) {
    tlMe.fromTo(
      meDetails,
      { opacity: 0, x: 40 },
      { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out', immediateRender: false },
      0.08
    );
  }
}

function initMeAnimations() {
  if (!window.gsap || !window.ScrollTrigger) return;
  if (prefersReducedMotion) return;

  const meContainer = document.querySelector('.me-container');
  const meCard = document.querySelector('.me-card');
  const meDetails = document.querySelector('.me-details');
  if (!meContainer || (!meCard && !meDetails)) return;

  const isMobile = window.matchMedia('(max-width: 600px)').matches;

  if (meCard) {
    gsap.set(meCard, { opacity: 0, x: isMobile ? 0 : -60, rotate: isMobile ? 0 : -2 });
    gsap.set('.me-card-title', { opacity: 0, y: -20 });
    gsap.set('.me-card img', { opacity: 0, scale: 0.96 });
  }
  if (meDetails) {
    gsap.set(meDetails, { opacity: 0, x: isMobile ? 0 : 60, rotate: isMobile ? 0 : 2 });
  }

  const tlMe = gsap.timeline({
    scrollTrigger: {
      trigger: meContainer,
      start: 'top 80%',
      once: true,
    }
  });

  if (meCard) {
    tlMe.to(meCard, { opacity: 1, x: 0, rotate: 0, duration: 0.8, ease: 'power3.out' })
        .to('.me-card-title', { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.4')
        .to('.me-card img', { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }, '-=0.4');
  }

  if (meDetails) {
    tlMe.to(meDetails, { opacity: 1, x: 0, rotate: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
        .from('.me-details details', { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out', stagger: 0.15 }, '-=0.4');
  }
}

function initSkillsAnimations() {
  if (!window.gsap || !window.ScrollTrigger) return;

  const cards = gsap.utils.toArray('#containerSkills .skills-card');
  if (!cards.length) return;

  document.documentElement.classList.add('skills-anim');

    if (prefersReducedMotion) {
      cards.forEach((card) => {
        gsap.set(card, { opacity: 1, y: 0, clearProps: 'all' });
        const bg = card.querySelector('.skills-card-background');
        const text = card.querySelector('.skills-card-text');
        if (bg) gsap.set(bg, { opacity: 1, scale: 1 });
        if (text) gsap.set(text, { opacity: 1, y: 0 });
      });
      return;
    }

    cards.forEach((card, index) => {
      const isEven = index % 2 === 0;
      const bg = card.querySelector('.skills-card-background');
      const text = card.querySelector('.skills-card-text');
      const floats = bg ? gsap.utils.toArray(bg.querySelectorAll('img')) : [];

      // Initial states
      gsap.set(card, { opacity: 0, y: 30, rotate: isEven ? -1.5 : 1.5 });
      if (bg) gsap.set(bg, { opacity: 0.85, scale: 0.96 });
      if (text) gsap.set(text, { opacity: 0, y: 24 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          once: true,
        }
      });

      tl.to(card, { opacity: 1, y: 0, rotate: 0, duration: 0.7, ease: 'power3.out' });
      if (bg) tl.to(bg, { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }, '-=0.4');
      if (text) tl.to(text, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4');
      if (floats.length) tl.from(floats, { opacity: 0, y: isEven ? -16 : 16, duration: 0.5, ease: 'power2.out', stagger: 0.12 }, '-=0.3');

      // Parallax scrub effects on scroll
      if (bg) {
        gsap.to(bg, {
          yPercent: isEven ? -8 : 8,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5,
          }
        });
      }
      if (floats.length) {
        gsap.to(floats, {
          y: isEven ? 10 : -10,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5,
          }
        });
      }
    });
}

function initSectionRevealAnimations() {
  if (!window.gsap || !window.ScrollTrigger) return;

  // Projets : révéler chaque catégorie (sans toucher au scroll horizontal)
  const projectBlocks = gsap.utils.toArray('#projects .project-container');
  projectBlocks.forEach((block, index) => {
    const header = block.querySelector('.top-project-container');
    const scroller = block.querySelector('.dev-container');

    const fromX = index % 2 === 0 ? 30 : -30;
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: block,
        start: 'top 85%',
        once: true,
      },
    });

    if (header) {
      tl.fromTo(
        header,
        { opacity: 0, y: 18, x: fromX },
        { opacity: 1, y: 0, x: 0, duration: 0.65, ease: 'power3.out' },
        0
      );
    }

    if (scroller) {
      tl.fromTo(
        scroller,
        { opacity: 0, y: 26 },
        { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' },
        header ? 0.1 : 0
      );
    }
  });

  // Opquast
  const opquast = document.querySelector('.opquast');
  if (opquast) {
    gsap.fromTo(
      opquast,
      { opacity: 0, y: 34 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: opquast,
          start: 'top 85%',
          once: true,
        },
      }
    );
  }

  // Contact
  const contact = document.querySelector('#contact');
  if (contact) {
    const contactTop = contact.querySelector('.contact-top');
    const contactItems = gsap.utils.toArray('#contact .contact-list');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: contact,
        start: 'top 85%',
        once: true,
      },
    });

    if (contactTop) {
      tl.fromTo(
        contactTop,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        0
      );
    }

    if (contactItems.length) {
      tl.fromTo(
        contactItems,
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out', stagger: 0.12 },
        contactTop ? 0.12 : 0
      );
    }
  }
}



const navBar = document.querySelector('nav')
const openButton = document.getElementById('open-sidebar-button')
const closeButton = document.getElementById('close-sidebar-button')
const overlay = document.getElementById('overlay')

const media = window.matchMedia("(max-width: 900px)");

media.addEventListener('change', (e)=> updateNavbar(e))

function updateNavbar (e) {
  const isMobile = e.matches
  if (isMobile) {
    navBar.setAttribute('inert','')
  } else {
    navBar.removeAttribute('inert')
  }
}

updateNavbar(media)

let lastNavActiveElement = null;

function openSidebar() {
  lastNavActiveElement = document.activeElement;
  navBar.classList.add('show');
  openButton.setAttribute('aria-expanded', 'true');
  navBar.removeAttribute('inert');

  document.documentElement.classList.add('nav-open');
  document.body.classList.add('nav-open');
  if (overlay) overlay.setAttribute('aria-hidden', 'false');

  if (closeButton && typeof closeButton.focus === 'function') {
    closeButton.focus();
  }
}

function closeSidebar() {
  navBar.classList.remove('show');
  openButton.setAttribute('aria-expanded', 'false');
  if (media.matches) {
    navBar.setAttribute('inert', '');
  }

  document.documentElement.classList.remove('nav-open');
  document.body.classList.remove('nav-open');
  if (overlay) overlay.setAttribute('aria-hidden', 'true');

  if (lastNavActiveElement && typeof lastNavActiveElement.focus === 'function') {
    lastNavActiveElement.focus();
  }
  lastNavActiveElement = null;
}

const navLinks = document.querySelectorAll('nav a');

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (media.matches) { // Vérifie si l'écran est en mode mobile (max-width: 900px)
      closeSidebar();
    }
    else {
      navBar.classList.remove('show');
      openButton.setAttribute('aria-expanded', 'false');
    }
  });
});

// Fermer la nav au clavier
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (navBar && navBar.classList.contains('show')) {
    closeSidebar();
  }
});

// Lien actif selon la section visible (scroll)
initActiveNavLinkOnScroll();

function initActiveNavLinkOnScroll() {
  const nav = document.getElementById('navbar') || document.querySelector('nav');
  if (!nav) return;

  const links = Array.from(nav.querySelectorAll('a[href^="#"]'));
  if (!links.length) return;

  const sections = links
    .map((a) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return null;
      const el = document.querySelector(id);
      return el ? { id, el } : null;
    })
    .filter(Boolean);

  if (!sections.length) return;

  const setActive = (href) => {
    links.forEach((a) => {
      const isActive = a.getAttribute('href') === href;
      a.classList.toggle('active-link', isActive);
      if (isActive) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  };

  let ticking = false;
  const update = () => {
    ticking = false;

    // On garde une petite marge en haut (nav fixe)
    const topOffset = 140;
    let currentHref = sections[0].id;

    for (const s of sections) {
      const rect = s.el.getBoundingClientRect();
      if (rect.top - topOffset <= 0) {
        currentHref = s.id;
      }
    }

    setActive(currentHref);
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
}




function nextSlide(button) {
  const wrapper = button.closest('.project-container') || button.closest('section.project');
  if (!wrapper) return;
  const container = wrapper.querySelector('.dev-container');
  if (!container) return;
  const gap = parseFloat(getComputedStyle(container).gap) || 0;
  const scrollAmount = container.offsetWidth + gap;
    container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
    });
}

function previousSlide(button) {
    const wrapper = button.closest('.project-container') || button.closest('section.project');
    if (!wrapper) return;
    const container = wrapper.querySelector('.dev-container');
    if (!container) return;
    const gap = parseFloat(getComputedStyle(container).gap) || 0;
    const scrollAmount = container.offsetWidth + gap;
    container.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
    });
}

// Petites optimisations (sans changer le rendu)
document.querySelectorAll('#projects img').forEach((img) => {
  if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
  if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
});

document.querySelectorAll('#projects video').forEach((video) => {
  if (!video.hasAttribute('preload')) video.setAttribute('preload', 'metadata');
  video.playsInline = true;
});

initProjectLightbox();

function initProjectLightbox() {
  const lightbox = document.getElementById('project-lightbox');
  if (!lightbox) return;

  const mediaContainer = lightbox.querySelector('.lightbox__media');
  const closeButton = lightbox.querySelector('.lightbox__close');
  const openLink = lightbox.querySelector('.lightbox__open-link');

  if (!mediaContainer || !closeButton || !openLink) return;

  let lastActiveElement = null;

  const clearMedia = () => {
    mediaContainer.innerHTML = '';
  };

  const setOpenLink = (href) => {
    const cleanHref = (href || '').trim();
    if (!cleanHref) {
      openLink.hidden = true;
      openLink.removeAttribute('href');
      return;
    }
    openLink.hidden = false;
    openLink.href = cleanHref;
  };

  const isYouTubeUrl = (url) => {
    try {
      const u = new URL(url);
      return (
        u.hostname === 'youtu.be' ||
        u.hostname === 'www.youtu.be' ||
        u.hostname === 'youtube.com' ||
        u.hostname === 'www.youtube.com'
      );
    } catch {
      return false;
    }
  };

  const toYouTubeEmbedUrl = (url) => {
    const u = new URL(url);
    if (u.hostname === 'youtu.be' || u.hostname === 'www.youtu.be') {
      const id = u.pathname.replace('/', '').trim();
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }
    const id = u.searchParams.get('v');
    return id ? `https://www.youtube.com/embed/${id}` : url;
  };

  const openLightbox = () => {
    document.documentElement.classList.add('lightbox-open');
    lightbox.hidden = false;
    lightbox.setAttribute('aria-hidden', 'false');
    closeButton.focus();
  };

  const closeLightbox = () => {
    if (lightbox.hidden) return;
    clearMedia();
    lightbox.hidden = true;
    lightbox.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('lightbox-open');

    if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
      lastActiveElement.focus();
    }
    lastActiveElement = null;
  };

  closeButton.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  document.addEventListener('click', (e) => {
    const link = e.target.closest('#projects .dev-container a');
    if (!link) return;

    // Laisse le comportement natif pour ouvrir dans un nouvel onglet, etc.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    const card = link.querySelector('.project-card');
    if (!card) return;

    // On ouvre la lightbox à la place de la navigation
    e.preventDefault();
    lastActiveElement = link;

    const href = (link.getAttribute('href') || '').trim();
    const title = (card.querySelector('h3')?.textContent || 'Projet').trim();

    setOpenLink(href);
    clearMedia();

    const cardVideo = card.querySelector('video');
    const cardImg = card.querySelector('img');

    if (href && isYouTubeUrl(href)) {
      const iframe = document.createElement('iframe');
      iframe.src = toYouTubeEmbedUrl(href);
      iframe.title = title;
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      mediaContainer.appendChild(iframe);
      openLightbox();
      return;
    }

    if (cardVideo) {
      const video = document.createElement('video');
      video.src = cardVideo.currentSrc || cardVideo.getAttribute('src') || '';
      video.controls = true;
      video.autoplay = true;
      video.loop = cardVideo.loop;
      video.playsInline = true;
      video.muted = false;
      mediaContainer.appendChild(video);
      openLightbox();
      video.play().catch(() => {});
      return;
    }

    if (cardImg) {
      const img = document.createElement('img');
      img.src = cardImg.currentSrc || cardImg.getAttribute('src') || '';
      img.alt = cardImg.getAttribute('alt') || title;
      mediaContainer.appendChild(img);
      openLightbox();
      return;
    }

    // Fallback: si rien à afficher, on ouvre le lien s'il existe
    if (href) {
      window.open(href, '_blank', 'noopener');
    }
  });
}



// containerSkills = document.querySelector('.skills-container')

// const skillsData = [
//   {
//       "id": 1,
//       "title": "Créativité",
//       "image_class": "crea",
//       "image_name": "menu-ps",  // Nom de la première image
//       "image_name2": "photoshopcolor", // Nom de la deuxième image
//       "image_name3": "photoshop-toolBar",  // Nom de la troisième image
//       "text": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vitae id optio quas, reprehenderit ipsum quos qui pariatur maiores sunt maxime.",
//       "format" : "jpg"
//   },
//   {
//       "id": 2,
//       "title": "Développement Web",
//       "image_class": "dev",
//       "image_name": "HTML5",  // Nom de la première image
//       "image_name2": "CSS3", // Nom de la deuxième image
//       "image_name3": "Javascript",  // Nom de la troisième image
//       "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac urna nisi. Proin at neque et dui ultricies tincidunt.",
//       "format" :"svg"
//   },
//   {
//       "id": 3,
//       "title": "3D",
//       "image_class": "unreal",
//       "image_name": "ue5-tool",  // Nom de la première image
//       "image_name2": "ue5-dock", // Nom de la deuxième image
//       "image_name3": "ue5-file",  // Nom de la troisième image
//       "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent euismod justo vitae neque fringilla, ac pretium ligula condimentum.",
//       "format" : "png"
//   },
//   {
//       "id": 4,
//       "title": "Montage vidéo",
//       "image_class": "video",
//       "image_name": "toolbar",  // Nom de la première image
//       "image_name2": "timeline", // Nom de la deuxième image
//       "image_name3": "effect",  // Nom de la troisième image
//       "text": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet quos eveniet cupiditate tempora. Suscipit rerum commodi distinctio molestias.",
//       "format" : "png"
//   }
// ];

// const lengthData = skillsData.length; 
// for (let i = 0; i < lengthData; i++) {
//   const skill = skillsData[i];  // récupère l'élément actuel

//   // Construction des chemins des images avec les noms dynamiques
//   const imagePath1 = `img/${skill.image_name}.${skill.format}`;
//   const imagePath2 = `img/${skill.image_name2}.${skill.format}`;
//   const imagePath3 = `img/${skill.image_name3}.${skill.format}`;

//   const cardHTML = `
//       <div class="skills-card">
//           <div class="skills-card-background ${skill.image_class}">
//           <img src="${imagePath1}" alt="" class="${skill.image_name}">
//               <img src="${imagePath2}" alt="" class="${skill.image_name2}">
//               <img src="${imagePath3}" alt="" class="${skill.image_name3}">
//           </div>
//           <div class="skills-card-text">
//               ${skill.text}
//           </div>
              
//       </div>
//   `;

//   // Ajoute la carte générée au container
//   containerSkills.innerHTML += cardHTML;
// }