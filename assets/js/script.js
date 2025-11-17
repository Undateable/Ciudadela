// Preloader
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    
    // Esperar 2 segundos antes de ocultar el preloader
    setTimeout(() => {
        preloader.classList.add('fade-out');
        
        // Remover el preloader del DOM después de la animación
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }, 2000);
});

// Navegación móvil
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Menú móvil del header desactivado - solo se usa navegación inferior
    // navToggle.addEventListener('click', function() {
    //     navMenu.classList.toggle('active');
    //     navToggle.classList.toggle('active');
    // });

    // navLinks.forEach(link => {
    //     link.addEventListener('click', function() {
    //         navMenu.classList.remove('active');
    //         navToggle.classList.remove('active');
    //     });
    // });

    // document.addEventListener('click', function(e) {
    //     if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
    //         navMenu.classList.remove('active');
    //         navToggle.classList.remove('active');
    //     }
    // });
    
    // Navegación inferior móvil
    const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
    
    bottomNavItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover clase active de todos los items
            bottomNavItems.forEach(navItem => {
                navItem.classList.remove('active');
            });
            
            // Agregar clase active al item clickeado
            this.classList.add('active');
            
            // Scroll suave a la sección
            const sectionId = this.getAttribute('data-section');
            scrollToSection(sectionId);
            
            // Menú superior desactivado en móvil
            // navMenu.classList.remove('active');
            // navToggle.classList.remove('active');
        });
    });
});

// Smooth scrolling para navegación
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const elementPosition = element.offsetTop - headerHeight;
        
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }
}

// Navegación activa basada en scroll
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
    const headerHeight = document.querySelector('.header').offsetHeight;
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 100;
        const sectionHeight = section.offsetHeight;
        
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    // Actualizar navegación superior
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
    
    // Actualizar navegación inferior móvil
    bottomNavItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-section') === current) {
            item.classList.add('active');
        }
    });
});



// Intersection Observer para animaciones
const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observar elementos para animaciones
document.addEventListener('DOMContentLoaded', function() {
    const elementsToAnimate = document.querySelectorAll('.contact-item');
    
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
});

// Formulario de contacto removido - ahora es sección About Us
// document.getElementById('contactForm').addEventListener('submit', function(e) {
//     e.preventDefault();
//     
//     // Obtener datos del formulario
//     const formData = new FormData(this);
//     const name = formData.get('name');
//     const email = formData.get('email');
//     const subject = formData.get('subject');
//     const message = formData.get('message');
//     
//     // Validación simple
//     if (!name || !email || !subject || !message) {
//         showNotification('Por favor, completa todos los campos', 'error');
//         return;
//     }
//     
//     if (!isValidEmail(email)) {
//         showNotification('Por favor, ingresa un email válido', 'error');
//         return;
//     }
//     
//     // Simular envío del formulario
//     const submitBtn = this.querySelector('button[type="submit"]');
//     const originalText = submitBtn.textContent;
//     
//     submitBtn.textContent = 'Enviando...';
//     submitBtn.disabled = true;
//     
//     // Simular delay de envío
//     setTimeout(() => {
//         showNotification('¡Mensaje enviado con éxito! Te contactaremos pronto.', 'success');
//         this.reset();
//         submitBtn.textContent = originalText;
//         submitBtn.disabled = false;
//     }, 2000);
// });

// Validación de email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Sistema de notificaciones
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Estilos para la notificación
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#00ff88' : type === 'error' ? '#ff4757' : '#3742fa'};
        color: ${type === 'success' ? '#000' : '#fff'};
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        max-width: 400px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    // Estilos para el contenido
    const content = notification.querySelector('.notification-content');
    content.style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 500;
    `;
    
    // Estilos para el botón de cerrar
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: inherit;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    `;
    
    // Agregar al DOM
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Función para cerrar notificación
    const closeNotification = () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    };
    
    // Event listeners
    closeBtn.addEventListener('click', closeNotification);
    
    // Auto cerrar después de 5 segundos
    setTimeout(closeNotification, 5000);
}

// Efecto parallax suave para el hero
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const floatingElements = document.querySelector('.floating-elements');
    
    if (hero && floatingElements && scrolled < hero.offsetHeight) {
        floatingElements.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});



// Inicializar animación de fade-in para el título principal
window.addEventListener('load', function() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        // Aplicar una animación de fade-in suave preservando el HTML y clases
        heroTitle.style.opacity = '0';
        heroTitle.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            heroTitle.style.transition = 'all 1s ease-out';
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 300);
    }
});

// Aplicar imágenes de fondo en dispositivos móviles
function applyBackgroundImages() {
    if (window.innerWidth <= 768) {
        const slides = document.querySelectorAll('.carousel-slide');
        const gameImages = [
            './assets/img_game/box_boy.png',
            './assets/img_game/gaucho_runner.png',
            './assets/img_game/ruinas_de_skersher.png'
        ];
        
        slides.forEach((slide, index) => {
            const showcase = slide.querySelector('.game-showcase');
            if (showcase && gameImages[index]) {
                showcase.style.backgroundImage = `url('${gameImages[index]}')`;
            }
        });
    } else {
        // Remover imágenes de fondo en desktop
        const slides = document.querySelectorAll('.carousel-slide');
        slides.forEach(slide => {
            const showcase = slide.querySelector('.game-showcase');
            if (showcase) {
                showcase.style.backgroundImage = '';
            }
        });
    }
}

// Manejo de redimensionamiento de ventana
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        // Reaplicar imágenes de fondo según el tamaño de pantalla
        applyBackgroundImages();
        
        // Recalcular posiciones si es necesario
        const floatingCards = document.querySelectorAll('.floating-card');
        floatingCards.forEach(card => {
            // Reposicionar elementos flotantes en móvil
            if (window.innerWidth <= 768) {
                card.style.position = 'relative';
                card.style.top = 'auto';
                card.style.left = 'auto';
                card.style.right = 'auto';
                card.style.bottom = 'auto';
                card.style.margin = '1rem auto';
            }
        });
    }, 250);
});

// Lazy loading para imágenes (si se agregan más tarde)
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Inicializar lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Carrusel Principal de Juegos
let currentMainSlide = 0;
let totalSlides = 3;
let autoPlayInterval;

function changeMainSlide(direction) {
    const track = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    
    // Remover clase active del slide actual
    slides[currentMainSlide].classList.remove('active');
    indicators[currentMainSlide].classList.remove('active');
    
    // Calcular nuevo índice
    currentMainSlide += direction;
    
    // Manejar wrap around
    if (currentMainSlide >= totalSlides) {
        currentMainSlide = 0;
    } else if (currentMainSlide < 0) {
        currentMainSlide = totalSlides - 1;
    }
    
    // Aplicar transformación
    updateCarousel();
}

function goToSlide(slideIndex) {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    
    // Remover clase active del slide actual
    slides[currentMainSlide].classList.remove('active');
    indicators[currentMainSlide].classList.remove('active');
    
    // Actualizar índice
    currentMainSlide = slideIndex;
    
    // Aplicar transformación
    updateCarousel();
}

function updateCarousel() {
    const track = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    
    // Mover el track
    const translateX = -currentMainSlide * 33.33; // 33.33% por slide
    track.style.transform = `translateX(${translateX}%)`;
    
    // Activar slide e indicador actual
    slides[currentMainSlide].classList.add('active');
    indicators[currentMainSlide].classList.add('active');
    
    // Efecto de escala suave
    track.style.transition = 'transform 0.5s ease-in-out';
}

// Auto-play del carrusel
function startMainAutoPlay() {
    autoPlayInterval = setInterval(() => {
        changeMainSlide(1);
    }, 6000); // 6 segundos por slide
}

function stopMainAutoPlay() {
    clearInterval(autoPlayInterval);
}

// Funciones de descarga/redirección
function downloadGame(gameId) {
    const gameLinks = {
        box_boy: 'https://example.com/download/box-boy',
        el_infierno_pawling: 'https://example.com/download/el-infierno-de-pawling',
        gaucho_runner: 'https://example.com/download/gaucho-runner',
        ruinas_skersher: 'https://example.com/play/ruinas-de-skersher',
        the_nameless: 'https://example.com/download/the-nameless'
    };
    
    const gameNames = {
        box_boy: 'Box Boy',
        el_infierno_pawling: 'El Infierno de Pawling',
        gaucho_runner: 'Gaucho Runner',
        ruinas_skersher: 'Ruinas de Skersher',
        the_nameless: 'The Nameless'
    };
    
    // Mostrar notificación
    showNotification(`Redirigiendo a ${gameNames[gameId]}...`, 'info');
    
    // Simular redirección (reemplazar con URLs reales)
    setTimeout(() => {
        // window.open(gameLinks[gameId], '_blank');
        showNotification(`¡${gameNames[gameId]} se está preparando para descargar!`, 'success');
    }, 1000);
    
    // Prevenir comportamiento por defecto
    return false;
}

// Inicializar carrusel principal cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Aplicar imágenes de fondo inicialmente
    applyBackgroundImages();
    
    // Auto-play desactivado - solo navegación manual
    // startMainAutoPlay();
    
    // Eventos de hover removidos ya que no hay auto-play
    const mainCarousel = document.querySelector('.main-carousel');
    // if (mainCarousel) {
    //     mainCarousel.addEventListener('mouseenter', stopMainAutoPlay);
    //     mainCarousel.addEventListener('mouseleave', startMainAutoPlay);
    // }
    
    // Agregar soporte para navegación con teclado
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            changeMainSlide(-1);
        } else if (e.key === 'ArrowRight') {
            changeMainSlide(1);
        }
    });
});

// Animación de entrada para navegación inferior
window.addEventListener('load', function() {
    const bottomNav = document.querySelector('.mobile-bottom-nav');
    if (bottomNav && window.innerWidth <= 768) {
        bottomNav.style.transform = 'translateY(100%)';
        bottomNav.style.transition = 'transform 0.5s ease';
        
        setTimeout(() => {
            bottomNav.style.transform = 'translateY(0)';
        }, 500);
    }
});

// Función para detectar si el usuario prefiere movimiento reducido
function respectsReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Aplicar configuraciones de accesibilidad
if (respectsReducedMotion()) {
    // Desactivar animaciones si el usuario prefiere movimiento reducido
    const style = document.createElement('style');
    style.textContent = `
        *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    `;
    document.head.appendChild(style);
}

// Soporte táctil para el carrusel principal
function addMainCarouselTouchSupport() {
    const mainCarousel = document.querySelector('.main-carousel');
    
    if (mainCarousel) {
        let startX = 0;
        let endX = 0;
        let isDragging = false;
        
        mainCarousel.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
            isDragging = true;
        }, { passive: true });
        
        mainCarousel.addEventListener('touchmove', function(e) {
            if (!isDragging) return;
            // No prevenir el scroll vertical, solo horizontal si es necesario
            const diffX = Math.abs(e.touches[0].clientX - startX);
            const diffY = Math.abs(e.touches[0].clientY - (e.touches[0].clientY || 0));
            
            if (diffX > diffY) {
                e.preventDefault(); // Solo prevenir scroll si es swipe horizontal
            }
        }, { passive: false });
        
        mainCarousel.addEventListener('touchend', function(e) {
            if (!isDragging) return;
            
            endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;
            
            // Mínima distancia para considerar swipe (reducida para mejor UX móvil)
            if (Math.abs(diffX) > 30) {
                if (diffX > 0) {
                    // Swipe left - siguiente slide
                    changeMainSlide(1);
                } else {
                    // Swipe right - slide anterior
                    changeMainSlide(-1);
                }
            }
            
            isDragging = false;
        }, { passive: true });
        
        // Manejo de mouse para desktop (opcional)
        let isMouseDown = false;
        let mouseStartX = 0;
        
        mainCarousel.addEventListener('mousedown', function(e) {
            isMouseDown = true;
            mouseStartX = e.clientX;
            mainCarousel.style.cursor = 'grabbing';
        });
        
        mainCarousel.addEventListener('mousemove', function(e) {
            if (!isMouseDown) return;
            e.preventDefault();
        });
        
        mainCarousel.addEventListener('mouseup', function(e) {
            if (!isMouseDown) return;
            
            const diffX = mouseStartX - e.clientX;
            
            if (Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    changeMainSlide(1);
                } else {
                    changeMainSlide(-1);
                }
            }
            
            isMouseDown = false;
            mainCarousel.style.cursor = 'grab';
        });
        
        mainCarousel.addEventListener('mouseleave', function() {
            if (isMouseDown) {
                isMouseDown = false;
                mainCarousel.style.cursor = 'grab';
            }
        });
    }
}

// Inicializar soporte táctil para carrusel principal
document.addEventListener('DOMContentLoaded', addMainCarouselTouchSupport);

// Manejo de focus para accesibilidad
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        document.body.classList.add('user-is-tabbing');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('user-is-tabbing');
});

// Añadir estilos para focus visible solo cuando se usa teclado
const focusStyle = document.createElement('style');
focusStyle.textContent = `
    .user-is-tabbing *:focus {
        outline: 2px solid #00ff88 !important;
        outline-offset: 2px !important;
    }
    
    *:focus:not(.user-is-tabbing *) {
        outline: none !important;
    }
`;
document.head.appendChild(focusStyle);