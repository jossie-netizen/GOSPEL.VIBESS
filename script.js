document.addEventListener('DOMContentLoaded', function() {

    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');

        const lines = hamburger.querySelectorAll('div');
        if (hamburger.classList.contains('active')) {
            lines[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
            lines[1].style.opacity = '0';
            lines[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
        } else {
            lines[0].style.transform = 'none';
            lines[1].style.opacity = '1';
            lines[2].style.transform = 'none';
        }
    });

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');

            const lines = hamburger.querySelectorAll('div');
            lines[0].style.transform = 'none';
            lines[1].style.opacity = '1';
            lines[2].style.transform = 'none';
        });
    });

    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');

            const lines = hamburger.querySelectorAll('div');
            lines[0].style.transform = 'none';
            lines[1].style.opacity = '1';
            lines[2].style.transform = 'none';
        }
    });

    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
                faqItem.querySelector('.faq-answer').style.maxHeight = '0';
            });
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    const header = document.querySelector('header');
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        header.style.transform = scrollTop > lastScrollTop && scrollTop > 200
            ? 'translateY(-100%)'
            : 'translateY(0)';
        lastScrollTop = scrollTop;
    });

    const style = document.createElement('style');
    style.textContent = `
        header {
            transition: all 0.3s ease;
        }
        header.scrolled {
            background: rgba(248, 232, 232, 0.95);
            backdrop-filter: blur(10px);
            box-shadow: 0 2px 20px rgba(0,0,0,0.15);
        }
    `;
    document.head.appendChild(style);

    const contactForm = document.querySelector('form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const email = formData.get('email');
            const message = formData.get('message');
            if (!email || !message) {
                showNotification('Please fill in all fields to send your gospel message.', 'error');
                return;
            }
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            const submitButton = this.querySelector('.send-button');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            setTimeout(() => {
                showNotification('Thank you! Your message of faith has been sent. We\'ll respond shortly.', 'success');
                this.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 2000);
        });
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        const styles = `
            .notification { position: fixed; top: 100px; right: 20px; z-index: 10000; max-width: 400px; padding: 1rem;
                border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); transform: translateX(100%);
                transition: transform 0.3s ease; }
            .notification-success { background: linear-gradient(135deg, #e6fffa 0%, #b2f5ea 100%);
                border-left: 4px solid #38a169; color: #2f855a; }
            .notification-error { background: linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%);
                border-left: 4px solid #e53e3e; color: #c53030; }
            .notification-info { background: linear-gradient(135deg, #ebf8ff 0%, #bee3f8 100%);
                border-left: 4px solid #3182ce; color: #2b6cb0; }
            .notification-content { display: flex; justify-content: space-between; gap: 1rem; }
            .notification-message { flex: 1; line-height: 1.4; }
            .notification-close { background: none; border: none; font-size: 1.5rem; cursor: pointer; }
            .notification.show { transform: translateX(0); }
        `;
        if (!document.querySelector('#notification-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'notification-styles';
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }
        document.body.appendChild(notification);
        setTimeout(() => notification.classList.add('show'), 100);
        notification.querySelector('.notification-close').addEventListener('click', () => {
            hideNotification(notification);
        });
        setTimeout(() => hideNotification(notification), 5000);
    }

    function hideNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.service-card, .tip-card, .gallery-card, .faq-item').forEach(el => observer.observe(el));

    const animationStyles = `
        .service-card, .tip-card, .gallery-card, .faq-item {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        .service-card.animate-in, .tip-card.animate-in, .gallery-card.animate-in, .faq-item.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    const animationStyleSheet = document.createElement('style');
    animationStyleSheet.textContent = animationStyles;
    document.head.appendChild(animationStyleSheet);

    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            if (scrolled < hero.offsetHeight) {
                hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            }
        });
    }

    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver(entries => {
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

    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        setTimeout(typeWriter, 1000);
    }

    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-5px) scale(1)';
        });
    });

    document.querySelectorAll('.gallery-img').forEach(img => {
        img.addEventListener('click', function() {
            createLightbox(this.src, this.alt);
        });
    });

    function createLightbox(src, alt) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <img src="${src}" alt="${alt}">
                <button class="lightbox-close">&times;</button>
            </div>
        `;
        const lightboxStyles = `
            .lightbox {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.9);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            .lightbox.show { opacity: 1; }
            .lightbox-content { position: relative; max-width: 90%; max-height: 90%; }
            .lightbox img { width: 100%; object-fit: contain; border-radius: 10px; }
            .lightbox-close {
                position: absolute; top: -40px; right: -40px; font-size: 2rem;
                background: none; color: white; cursor: pointer;
            }
        `;
        if (!document.querySelector('#lightbox-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'lightbox-styles';
            styleSheet.textContent = lightboxStyles;
            document.head.appendChild(styleSheet);
        }
        document.body.appendChild(lightbox);
        setTimeout(() => lightbox.classList.add('show'), 10);
        lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) closeLightbox();
        });
        function closeLightbox() {
            lightbox.classList.remove('show');
            setTimeout(() => lightbox.remove(), 300);
        }
        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                closeLightbox();
                document.removeEventListener('keydown', escHandler);
            }
        });
    }

    window.addEventListener('load', function() {
        const loader = document.querySelector('.loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 500);
        }
    });

    console.log('Gospel Vibes Website - JavaScript Loaded Successfully! 🎶🙏');

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

});
