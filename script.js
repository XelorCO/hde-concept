document.addEventListener('DOMContentLoaded', function() {
  // --- Animation au défilement ---
  const animatedElements = document.querySelectorAll('.fade-in-element');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  animatedElements.forEach(el => observer.observe(el));

  // --- Header on scroll ---
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  });

  // --- Menu mobile ---
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  const navLinks = document.querySelectorAll('.main-nav a');

  const toggleNav = () => {
    const isVisible = mainNav.getAttribute('data-visible') === 'true';
    mainNav.setAttribute('data-visible', (!isVisible).toString());
    mobileNavToggle.setAttribute('aria-expanded', (!isVisible).toString());
    document.body.classList.toggle('nav-open');
  };

  if (mobileNavToggle) {
    mobileNavToggle.addEventListener('click', toggleNav);
  }
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mainNav.getAttribute('data-visible') === 'true') toggleNav();
    });
  });

  // --- Rail horizontal (réalisations) ---
  const rails = document.querySelectorAll('.rail-wrap');
  rails.forEach(rail => {
    const container = rail.querySelector('.realisation-images');
    const prev = rail.querySelector('.rail-prev');
    const next = rail.querySelector('.rail-next');

    const scrollByAmount = () => Math.max(320, container.clientWidth * 0.9);
    prev.addEventListener('click', () => container.scrollBy({ left: -scrollByAmount(), behavior: 'smooth' }));
    next.addEventListener('click', () => container.scrollBy({ left:  scrollByAmount(), behavior: 'smooth' }));

    // Drag to scroll
    let isDown = false, startX = 0, startLeft = 0;
    container.addEventListener('pointerdown', (e) => {
      isDown = true; container.setPointerCapture(e.pointerId);
      startX = e.clientX; startLeft = container.scrollLeft;
      container.style.cursor = 'grabbing';
    });
    container.addEventListener('pointermove', (e) => {
      if (!isDown) return; const dx = e.clientX - startX; container.scrollLeft = startLeft - dx;
    });
    const endDrag = () => { isDown = false; container.style.cursor = 'grab'; };
    container.addEventListener('pointerup', endDrag);
    container.addEventListener('pointerleave', endDrag);
  });

  // --- LIGHTBOX (Visionneuse d'images) ---
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lightboxImg = document.getElementById('lightbox-img');
    const caption = document.getElementById('lightbox-caption');
    const counter = document.getElementById('lightbox-counter');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    const realisationImages = document.querySelectorAll('.realisation-images img');

    let currentImageIndex = 0;
    let currentGallery = [];

    const openLightbox = (img, gallery) => {
      lightbox.style.display = 'block';
      lightbox.setAttribute('aria-hidden', 'false');
      currentGallery = Array.from(gallery.children);
      currentImageIndex = currentGallery.indexOf(img);
      updateLightbox();
    };

    const updateLightbox = () => {
      const el = currentGallery[currentImageIndex];
      lightboxImg.src = el.src;
      caption.textContent = el.alt || '';
      counter.textContent = `${currentImageIndex + 1} / ${currentGallery.length}`;
    };

    realisationImages.forEach(img => {
      img.addEventListener('click', () => openLightbox(img, img.parentElement));
    });

    const showImage = (index) => {
      if (!currentGallery.length) return;
      if (index < 0) index = currentGallery.length - 1;
      if (index >= currentGallery.length) index = 0;
      currentImageIndex = index; updateLightbox();
    };

    prevBtn.addEventListener('click', () => showImage(currentImageIndex - 1));
    nextBtn.addEventListener('click', () => showImage(currentImageIndex + 1));

    const closeLightbox = () => {
      lightbox.style.display = 'none';
      lightbox.setAttribute('aria-hidden', 'true');
    };

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

    // Clavier
    document.addEventListener('keydown', (e) => {
      if (lightbox.style.display !== 'block') return;
      if (e.key === 'Escape') return closeLightbox();
      if (e.key === 'ArrowLeft') return showImage(currentImageIndex - 1);
      if (e.key === 'ArrowRight') return showImage(currentImageIndex + 1);
    });

    // Gestes tactiles
    let touchStartX = 0;
    lightbox.addEventListener('touchstart', (e) => { if(e.touches[0]) touchStartX = e.touches[0].clientX; }, {passive:true});
    lightbox.addEventListener('touchend', (e) => {
      const endX = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientX : 0;
      const dx = endX - touchStartX;
      if (Math.abs(dx) > 40) { dx > 0 ? showImage(currentImageIndex - 1) : showImage(currentImageIndex + 1); }
    });
  }
});
