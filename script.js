/* ===================================
   BENSO - JavaScript Functionality
=================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            
            // Animate hamburger icon
            const spans = this.querySelectorAll('span');
            spans.forEach(span => {
                span.classList.toggle('active');
            });
        });
    }

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                nav.classList.remove('active');
            }
        });
    });

    // Set active navigation link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add scroll effect to header
    const header = document.querySelector('header');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 30px rgba(0, 44, 106, 0.3)';
        } else {
            header.style.boxShadow = '0 4px 20px rgba(0, 44, 106, 0.15)';
        }

        lastScroll = currentScroll;
    });

    // Simple form validation (for contact page)
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            const nombre = document.getElementById('nombre');
            const email = document.getElementById('email');
            const mensaje = document.getElementById('mensaje');
            let isValid = true;

            // Simple validation
            if (nombre && nombre.value.trim() === '') {
                isValid = false;
                nombre.style.borderColor = '#e74c3c';
            } else if (nombre) {
                nombre.style.borderColor = '#e6e6e6';
            }

            if (email && !isValidEmail(email.value)) {
                isValid = false;
                email.style.borderColor = '#e74c3c';
            } else if (email) {
                email.style.borderColor = '#e6e6e6';
            }

            if (mensaje && mensaje.value.trim() === '') {
                isValid = false;
                mensaje.style.borderColor = '#e74c3c';
            } else if (mensaje) {
                mensaje.style.borderColor = '#e6e6e6';
            }

            if (!isValid) {
                e.preventDefault();
                alert('Por favor, complete todos los campos correctamente.');
            }
        });
    }

    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Animate cards on scroll (simple animation) - Progressive enhancement
    // Cards are visible by default via CSS; this adds subtle animation when scrolling
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, observerOptions);

        const animatedElements = document.querySelectorAll('.bento-card, .mvv-card, .gallery-item');
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }
});
