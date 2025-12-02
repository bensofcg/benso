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

    // FAQ Accordion functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    if (faqQuestions.length > 0) {
        faqQuestions.forEach(question => {
            // Set initial ARIA attributes
            question.setAttribute('aria-expanded', 'false');
            const answer = question.nextElementSibling;
            if (answer) {
                answer.setAttribute('aria-hidden', 'true');
            }
            
            question.addEventListener('click', function() {
                const answer = this.nextElementSibling;
                const isActive = this.classList.contains('active');
                
                // Close all other FAQs
                faqQuestions.forEach(q => {
                    q.classList.remove('active');
                    q.setAttribute('aria-expanded', 'false');
                    const a = q.nextElementSibling;
                    if (a) {
                        a.style.maxHeight = '0';
                        a.setAttribute('aria-hidden', 'true');
                    }
                });
                
                // Toggle current FAQ
                if (!isActive) {
                    this.classList.add('active');
                    this.setAttribute('aria-expanded', 'true');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    answer.setAttribute('aria-hidden', 'false');
                }
            });
        });
    }

    // Service filtering functionality
    const filterBtns = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card[data-category]');
    
    if (filterBtns.length > 0 && serviceCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const filterValue = this.getAttribute('data-filter');
                
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Filter cards
                serviceCards.forEach(card => {
                    if (filterValue === 'all') {
                        card.classList.remove('hidden');
                    } else {
                        const cardCategory = card.getAttribute('data-category');
                        if (cardCategory === filterValue) {
                            card.classList.remove('hidden');
                        } else {
                            card.classList.add('hidden');
                        }
                    }
                });
            });
        });
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
