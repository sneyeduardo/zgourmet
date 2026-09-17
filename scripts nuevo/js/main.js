document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. Lógica para resaltar el menú activo al hacer scroll
    // ==========================================
    // Añadimos '#contacto' explícitamente para que el JS lo rastree sin importar si es div, section o footer
    const sections = document.querySelectorAll('section, #contacto'); 
    const navLinks = document.querySelectorAll('#nav-menu a');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            
            // Aumentamos el margen a 250 para que detecte la sección un poco antes de llegar
            if (pageYOffset >= (sectionTop - 250)) { 
                current = section.getAttribute('id');
            }
        });

        // TRUCO PARA EL FINAL DE PÁGINA: Si el usuario llega al límite inferior de la web, 
        // forzamos a que "contacto" se marque como activo (ideal para pantallas muy grandes)
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
            current = 'contacto';
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });


    // ==========================================
    // 2. Lógica del Carrusel de Marcas (Movimiento Automático Continuo y Bucle Infinito)
    // ==========================================
    const carousel = document.getElementById('marcas-carousel');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (carousel) {
        // Clonar todos los hijos para el efecto de bucle infinito real
        const children = [...carousel.children];
        children.forEach(child => {
            const clone = child.cloneNode(true);
            carousel.appendChild(clone);
        });

        let isPaused = false;
        let scrollSpeed = 2; // Velocidad del desplazamiento automático

        function autoScroll() {
            if (!isPaused) {
                carousel.scrollLeft += scrollSpeed;
                
                // Cuando el scroll llega a la mitad, regresamos al inicio de forma imperceptible
                if (carousel.scrollLeft >= carousel.scrollWidth / 2) {
                    carousel.scrollLeft = 0;
                }
            }
            requestAnimationFrame(autoScroll); 
        }

        // Iniciar la animación continua
        requestAnimationFrame(autoScroll);

        // Pausar al pasar el ratón o tocar en móviles
        carousel.addEventListener('mouseenter', () => isPaused = true);
        carousel.addEventListener('mouseleave', () => isPaused = false);
        carousel.addEventListener('touchstart', () => isPaused = true);
        carousel.addEventListener('touchend', () => isPaused = false);

        // Botones manuales (en caso de que los uses más adelante)
        if (nextBtn && prevBtn) {
            nextBtn.addEventListener('click', () => {
                carousel.scrollBy({ left: 300, behavior: 'smooth' });
            });
            prevBtn.addEventListener('click', () => {
                carousel.scrollBy({ left: -300, behavior: 'smooth' });
            });
        }
    }


    // 3. Animación de aparición suave (IntersectionObserver unificado)
    const observerElementos = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target); 
            }
        });
    }, { 
        rootMargin: '0px 0px -50px 0px', 
        threshold: 0.1 
    });

    // Seleccionamos las tarjetas de propuestas y los nuevos elementos fade-up
    const elementosAnimados = document.querySelectorAll('.card-propuesta, .fade-up');
    elementosAnimados.forEach((elemento) => {
        observerElementos.observe(elemento);
    });


    // ==========================================
    // 4. Lógica del Hero Slider (Anuncios + Sincronización de Puntos)
    // ==========================================
    const heroSlides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dots .dot');

    if (heroSlides.length > 0) {
        let currentHeroSlide = 0;
        const slideDuration = 25000; // 25 segundos por anuncio
        let slideInterval;

        function goToSlide(index) {
            // Apagar slide y punto actual
            heroSlides[currentHeroSlide].classList.remove('active');
            if (dots.length > 0 && dots[currentHeroSlide]) {
                dots[currentHeroSlide].classList.remove('active');
            }

            // Cambiar al nuevo índice
            currentHeroSlide = index;

            // Encender nuevo slide y punto
            heroSlides[currentHeroSlide].classList.add('active');
            if (dots.length > 0 && dots[currentHeroSlide]) {
                dots[currentHeroSlide].classList.add('active');
            }
        }

        function nextHeroSlide() {
            let nextIndex = (currentHeroSlide + 1) % heroSlides.length;
            goToSlide(nextIndex);
        }

        // Iniciar el temporizador automático
        slideInterval = setInterval(nextHeroSlide, slideDuration);

        // Permitir cambiar de slide haciendo clic en los puntos indicadores
        if (dots.length > 0) {
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    goToSlide(index);
                    // Reiniciar el temporizador para que no cambie de golpe justo después del clic
                    clearInterval(slideInterval);
                    slideInterval = setInterval(nextHeroSlide, slideDuration);
                });
            });
        }
    }
    // 5. Efecto Parallax Suave con el Mouse en el Hero Slider
    const heroSection = document.querySelector('.hero-section');
    
    if (heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
            const activeSlideBg = document.querySelector('.hero-slide.active .flyer-bg');
            if (!activeSlideBg) return;

            const rect = heroSection.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Intensidad del movimiento (números más pequeños = más sutil)
            const moveX = x * 0.015;
            const moveY = y * 0.015;

            activeSlideBg.style.transform = `scale(1.08) translate(${moveX}px, ${moveY}px)`;
        });

        // Volver a la posición original cuando el mouse salga del banner
        heroSection.addEventListener('mouseleave', () => {
            const activeSlideBg = document.querySelector('.hero-slide.active .flyer-bg');
            if (activeSlideBg) {
                activeSlideBg.style.transform = 'scale(1) translate(0px, 0px)';
            }
        });
    }
});