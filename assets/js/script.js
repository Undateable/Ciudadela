const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
let currentMainSlide = 0;
let resizeTimer;
const analyticsStorageKey = 'ciudadelaAnalytics';

function respectsReducedMotion() {
    return reducedMotionQuery.matches;
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    const header = document.querySelector('.header');

    if (!element || !header) {
        return;
    }

    const elementPosition = element.offsetTop - header.offsetHeight;

    window.scrollTo({
        top: elementPosition,
        behavior: respectsReducedMotion() ? 'auto' : 'smooth'
    });
}

function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
    const header = document.querySelector('.header');

    if (!header) {
        return;
    }

    let current = sections[0] ? sections[0].id : '';
    const offset = header.offsetHeight + 120;

    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - offset) {
            current = section.id;
        }
    });

    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });

    bottomNavItems.forEach(item => {
        item.classList.toggle('active', item.getAttribute('data-section') === current);
    });
}

function applyBackgroundImages() {
    const slides = document.querySelectorAll('.carousel-slide');
    const gameImages = [
        './assets/img_game/box_boy.png',
        './assets/img_game/gaucho_runner.png',
        './assets/img_game/ruinas_de_skersher.png'
    ];

    slides.forEach((slide, index) => {
        const showcase = slide.querySelector('.game-showcase');
        if (!showcase) {
            return;
        }

        showcase.style.backgroundImage = window.innerWidth <= 768 && gameImages[index]
            ? `url('${gameImages[index]}')`
            : '';
    });
}

function updateCarousel() {
    const track = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');

    if (!track || !slides.length || !indicators.length) {
        return;
    }

    const slideWidth = 100 / slides.length;
    track.style.transform = `translateX(-${currentMainSlide * slideWidth}%)`;
    track.style.transition = respectsReducedMotion() ? 'none' : 'transform 0.5s ease-in-out';

    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentMainSlide);
        slide.setAttribute('aria-hidden', index === currentMainSlide ? 'false' : 'true');
    });

    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentMainSlide);
        indicator.setAttribute('aria-pressed', index === currentMainSlide ? 'true' : 'false');
    });
}

function changeMainSlide(direction) {
    const totalSlides = document.querySelectorAll('.carousel-slide').length;
    if (!totalSlides) {
        return;
    }

    currentMainSlide = (currentMainSlide + direction + totalSlides) % totalSlides;
    updateCarousel();
}

function goToSlide(slideIndex) {
    const totalSlides = document.querySelectorAll('.carousel-slide').length;
    if (!totalSlides) {
        return;
    }

    currentMainSlide = Math.max(0, Math.min(slideIndex, totalSlides - 1));
    updateCarousel();
}

function observeElements() {
    if (respectsReducedMotion() || !('IntersectionObserver' in window)) {
        return;
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.contact-item, .member-card, .stat-card').forEach(element => {
        observer.observe(element);
    });
}

function addMainCarouselTouchSupport() {
    const mainCarousel = document.querySelector('.main-carousel');

    if (!mainCarousel) {
        return;
    }

    let startX = 0;
    let startY = 0;
    let isDragging = false;
    let isMouseDown = false;
    let mouseStartX = 0;

    mainCarousel.addEventListener('touchstart', event => {
        startX = event.touches[0].clientX;
        startY = event.touches[0].clientY;
        isDragging = true;
    }, { passive: true });

    mainCarousel.addEventListener('touchmove', event => {
        if (!isDragging) {
            return;
        }

        const diffX = Math.abs(event.touches[0].clientX - startX);
        const diffY = Math.abs(event.touches[0].clientY - startY);

        if (diffX > diffY) {
            event.preventDefault();
        }
    }, { passive: false });

    mainCarousel.addEventListener('touchend', event => {
        if (!isDragging) {
            return;
        }

        const diffX = startX - event.changedTouches[0].clientX;
        if (Math.abs(diffX) > 30) {
            changeMainSlide(diffX > 0 ? 1 : -1);
        }

        isDragging = false;
    }, { passive: true });

    mainCarousel.addEventListener('mousedown', event => {
        isMouseDown = true;
        mouseStartX = event.clientX;
        mainCarousel.style.cursor = 'grabbing';
    });

    mainCarousel.addEventListener('mouseup', event => {
        if (!isMouseDown) {
            return;
        }

        const diffX = mouseStartX - event.clientX;
        if (Math.abs(diffX) > 50) {
            changeMainSlide(diffX > 0 ? 1 : -1);
        }

        isMouseDown = false;
        mainCarousel.style.cursor = 'grab';
    });

    mainCarousel.addEventListener('mouseleave', () => {
        if (!isMouseDown) {
            return;
        }

        isMouseDown = false;
        mainCarousel.style.cursor = 'grab';
    });
}

function applyAccessibilityPreferences() {
    if (!respectsReducedMotion()) {
        return;
    }

    const style = document.createElement('style');
    style.textContent = `
        *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
        }
    `;

    document.head.appendChild(style);
}

function setupFocusStyles() {
    const focusStyle = document.createElement('style');
    focusStyle.textContent = `
        .user-is-tabbing *:focus {
            outline: 2px solid #66e2da !important;
            outline-offset: 2px !important;
        }

        *:focus:not(.user-is-tabbing *) {
            outline: none !important;
        }
    `;

    document.head.appendChild(focusStyle);
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function updateFormStatus(message, type = '') {
    const formStatus = document.getElementById('form-status');
    if (!formStatus) {
        return;
    }

    formStatus.textContent = message;
    formStatus.classList.remove('is-error', 'is-success');

    if (type) {
        formStatus.classList.add(type === 'error' ? 'is-error' : 'is-success');
    }
}

function readAnalytics() {
    try {
        return JSON.parse(localStorage.getItem(analyticsStorageKey)) || { clicks: {}, sections: {} };
    } catch {
        return { clicks: {}, sections: {} };
    }
}

function writeAnalytics(data) {
    localStorage.setItem(analyticsStorageKey, JSON.stringify(data));
}

function trackClick(name) {
    const analytics = readAnalytics();
    analytics.clicks[name] = (analytics.clicks[name] || 0) + 1;
    writeAnalytics(analytics);
}

function trackSectionView(sectionId) {
    const analytics = readAnalytics();
    analytics.sections[sectionId] = (analytics.sections[sectionId] || 0) + 1;
    writeAnalytics(analytics);
}

function setupAnalytics() {
    document.querySelectorAll('[data-track]').forEach(element => {
        element.addEventListener('click', () => {
            trackClick(element.getAttribute('data-track'));
        });
    });

    if (!('IntersectionObserver' in window)) {
        return;
    }

    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target.id) {
                trackSectionView(entry.target.id);
            }
        });
    }, {
        threshold: 0.45
    });

    document.querySelectorAll('section[id]').forEach(section => {
        sectionObserver.observe(section);
    });
}

function setupContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) {
        return;
    }

    form.addEventListener('submit', event => {
        event.preventDefault();

        const name = form.elements.namedItem('name')?.value.trim() || '';
        const email = form.elements.namedItem('email')?.value.trim() || '';
        const subject = form.elements.namedItem('subject')?.value.trim() || '';
        const message = form.elements.namedItem('message')?.value.trim() || '';

        if (!name || !email || !subject || !message) {
            updateFormStatus('Completa todos los campos antes de continuar.', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            updateFormStatus('Ingresa un correo valido para que el estudio pueda responderte.', 'error');
            return;
        }

        const body = [
            `Nombre: ${name}`,
            `Email: ${email}`,
            '',
            message
        ].join('\n');

        const mailtoUrl = `mailto:laciudadelastudios@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        trackClick('contact-form-submit');
        updateFormStatus('Se abrira tu cliente de correo con el mensaje listo para enviar.', 'success');
        window.location.href = mailtoUrl;
    });
}

function setupLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeButton = document.getElementById('lightbox-close');

    if (!lightbox || !lightboxImage || !lightboxCaption || !closeButton) {
        return;
    }

    const closeLightbox = () => {
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        lightboxImage.src = '';
        lightboxImage.alt = '';
        lightboxCaption.textContent = '';
    };

    document.querySelectorAll('.lightbox-trigger').forEach(image => {
        image.addEventListener('click', () => {
            const fullSrc = image.getAttribute('data-fullsrc') || image.getAttribute('src') || '';
            const caption = image.getAttribute('data-caption') || image.getAttribute('alt') || '';

            lightboxImage.src = fullSrc;
            lightboxImage.alt = caption;
            lightboxCaption.textContent = caption;
            lightbox.classList.add('is-open');
            lightbox.setAttribute('aria-hidden', 'false');
            trackClick(`lightbox-${caption.toLowerCase().replace(/\s+/g, '-')}`);
        });
    });

    closeButton.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', event => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && lightbox.classList.contains('is-open')) {
            closeLightbox();
        }
    });
}

window.changeMainSlide = changeMainSlide;
window.goToSlide = goToSlide;
window.scrollToSection = scrollToSection;

window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    const heroTitle = document.querySelector('.hero-title');
    const bottomNav = document.querySelector('.mobile-bottom-nav');

    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, respectsReducedMotion() ? 0 : 800);
    }

    if (heroTitle) {
        heroTitle.style.opacity = '0';
        heroTitle.style.transform = 'translateY(20px)';

        setTimeout(() => {
            heroTitle.style.transition = respectsReducedMotion() ? 'none' : 'all 1s ease-out';
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 200);
    }

    if (bottomNav && window.innerWidth <= 768 && !respectsReducedMotion()) {
        bottomNav.style.transform = 'translateY(100%)';
        bottomNav.style.transition = 'transform 0.5s ease';

        setTimeout(() => {
            bottomNav.style.transform = 'translateY(0)';
        }, 300);
    }
});

window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    const floatingElements = document.querySelector('.floating-elements');

    updateActiveNavigation();

    if (hero && floatingElements && window.scrollY < hero.offsetHeight && !respectsReducedMotion()) {
        floatingElements.style.transform = `translateY(${window.scrollY * 0.3}px)`;
    }
});

window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        applyBackgroundImages();
        updateCarousel();
        updateActiveNavigation();
    }, 200);
});

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.nav-link, .bottom-nav-item').forEach(link => {
        link.addEventListener('click', event => {
            const target = link.getAttribute('href') || `#${link.getAttribute('data-section')}`;
            if (!target || !target.startsWith('#')) {
                return;
            }

            event.preventDefault();
            scrollToSection(target.slice(1));
        });
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'ArrowLeft') {
            changeMainSlide(-1);
        }

        if (event.key === 'ArrowRight') {
            changeMainSlide(1);
        }

        if (event.key === 'Tab') {
            document.body.classList.add('user-is-tabbing');
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('user-is-tabbing');
    });

    applyAccessibilityPreferences();
    setupFocusStyles();
    setupAnalytics();
    setupContactForm();
    setupLightbox();
    applyBackgroundImages();
    updateCarousel();
    updateActiveNavigation();
    observeElements();
    addMainCarouselTouchSupport();
});