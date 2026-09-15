document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Lógica para resaltar el menú activo al hacer scroll
    const sections = document.querySelectorAll('section, footer');
    const navLinks = document.querySelectorAll('#nav-menu a');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            // Verificamos si la posición de scroll actual está dentro de la sección
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

});
// 2. Lógica del Carrusel de Marcas
    const carousel = document.getElementById('marcas-carousel');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (carousel && prevBtn && nextBtn) {
        // Al hacer clic en siguiente
        nextBtn.addEventListener('click', () => {
            const scrollAmount = carousel.clientWidth / 2; // Desplaza media pantalla a la derecha
            carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        // Al hacer clic en anterior
        prevBtn.addEventListener('click', () => {
            const scrollAmount = carousel.clientWidth / 2; // Desplaza media pantalla a la izquierda
            carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        // Auto-Play: Mueve el carrusel automáticamente cada 3 segundos
        let autoPlayInterval = setInterval(() => {
            // Si llega al final, vuelve al principio
            if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 10) {
                carousel.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                carousel.scrollBy({ left: 250, behavior: 'smooth' });
            }
        }, 3000);

        // Opcional: Pausar el auto-play si el usuario pone el mouse encima del carrusel
        carousel.parentElement.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
    }
    // 3. Animación de los bloques completos de las propuestas
    const observerTarjetas = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Cuando la tarjeta entra en la pantalla del usuario
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, { 
        threshold: 0.2 // Se activa cuando al menos el 20% de la tarjeta es visible
    });

    // Seleccionamos todas las tarjetas y las ponemos bajo observación
    const tarjetasPropuestas = document.querySelectorAll('.card-propuesta');
    tarjetasPropuestas.forEach((tarjeta) => {
        observerTarjetas.observe(tarjeta);
    });