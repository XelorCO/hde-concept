document.addEventListener('DOMContentLoaded', function() {

    // --- Animation au défilement des sections ---
    const animatedElements = document.querySelectorAll('.fade-in-element');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    animatedElements.forEach(element => { observer.observe(element); });

    // --- Gestion de la barre de navigation ---
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });

    // --- Gestion du menu mobile ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.main-nav a');

    const toggleNav = () => {
    const isVisible = mainNav.getAttribute('data-visible') === 'true';
    mainNav.setAttribute('data-visible', !isVisible);
    mobileNavToggle.setAttribute('aria-expanded', !isVisible);
    document.body.classList.toggle('nav-open');

    // Ajoute ou retire la classe mobile-open sur le header
    header.classList.toggle('mobile-open', !isVisible);
};


    mobileNavToggle.addEventListener('click', toggleNav);
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.getAttribute('data-visible') === 'true') {
                toggleNav();
            }
        });
    });

    // --- LIGHTBOX (Visionneuse d'images) ---
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        const lightboxImg = document.getElementById('lightbox-img');
        const realisationImages = document.querySelectorAll('.realisation-images img');
        const closeBtn = document.querySelector('.lightbox-close');
        const prevBtn = document.querySelector('.lightbox-prev');
        const nextBtn = document.querySelector('.lightbox-next');

        let currentImageIndex;
        let currentGallery;

        realisationImages.forEach(img => {
            img.addEventListener('click', () => {
                lightbox.style.display = 'block';
                lightboxImg.src = img.src;
                
                // Détermine la galerie et l'index de l'image cliquée
                currentGallery = Array.from(img.parentElement.children);
                currentImageIndex = currentGallery.indexOf(img);
            });
        });

        const showImage = (index) => {
            lightboxImg.src = currentGallery[index].src;
            currentImageIndex = index;
        };

        prevBtn.addEventListener('click', () => {
            let newIndex = currentImageIndex - 1;
            if (newIndex < 0) {
                newIndex = currentGallery.length - 1;
            }
            showImage(newIndex);
        });

        nextBtn.addEventListener('click', () => {
            let newIndex = currentImageIndex + 1;
            if (newIndex >= currentGallery.length) {
                newIndex = 0;
            }
            showImage(newIndex);
        });

        const closeLightbox = () => {
            lightbox.style.display = 'none';
        };

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            // Ferme si on clique sur le fond noir (et pas sur l'image ou les flèches)
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Ferme avec la touche "Échap"
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.style.display === 'block') {
                closeLightbox();
            }
        });
    }
});