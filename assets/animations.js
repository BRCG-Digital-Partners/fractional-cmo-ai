// Modern animation utilities
class AnimationController {
    constructor() {
        this.observers = new Map();
        this.init();
    }

    init() {
        this.setupIntersectionObservers();
        this.setupParallax();
        this.setupCursorEffects();
        this.setupSmoothScroll();
        this.initCounters();
    }

    setupIntersectionObservers() {
        // Fade in animation observer
        const fadeInObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-visible');
                    fadeInObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '50px' });

        document.querySelectorAll('.fade-in').forEach(el => {
            fadeInObserver.observe(el);
        });

        // Scale in animation observer
        const scaleInObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('scale-in-visible');
                    scaleInObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.scale-in').forEach(el => {
            scaleInObserver.observe(el);
        });
    }

    setupParallax() {
        let ticking = false;
        const parallaxElements = document.querySelectorAll('[data-parallax]');

        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(el => {
                const speed = el.dataset.parallax || 0.5;
                const yPos = -(scrolled * speed);
                el.style.transform = `translateY(${yPos}px)`;
            });

            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        });
    }

    setupCursorEffects() {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);

        const cursorDot = document.createElement('div');
        cursorDot.className = 'cursor-dot';
        document.body.appendChild(cursorDot);

        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;
        let dotX = 0;
        let dotY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const animateCursor = () => {
            // Smooth follow for cursor
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;
            cursor.style.transform = `translate(${cursorX - 20}px, ${cursorY - 20}px)`;

            // Faster follow for dot
            dotX += (mouseX - dotX) * 0.3;
            dotY += (mouseY - dotY) * 0.3;
            cursorDot.style.transform = `translate(${dotX - 3}px, ${dotY - 3}px)`;

            requestAnimationFrame(animateCursor);
        };
        animateCursor();

        // Hover effects
        const hoverElements = document.querySelectorAll('a, button, .hover-target');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor-hover');
                cursorDot.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor-hover');
                cursorDot.classList.remove('cursor-hover');
            });
        });
    }

    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 100;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    initCounters() {
        const counters = document.querySelectorAll('.counter');
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    animateCounter(counter) {
        const target = parseInt(counter.dataset.target);
        const duration = parseInt(counter.dataset.duration) || 2000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        updateCounter();
    }

    // Magnetic button effect
    magneticButton(button) {
        const rect = button.getBoundingClientRect();
        const buttonCenterX = rect.left + rect.width / 2;
        const buttonCenterY = rect.top + rect.height / 2;

        button.addEventListener('mousemove', (e) => {
            const deltaX = e.clientX - buttonCenterX;
            const deltaY = e.clientY - buttonCenterY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            if (distance < 100) {
                const pullX = deltaX * 0.3;
                const pullY = deltaY * 0.3;
                button.style.transform = `translate(${pullX}px, ${pullY}px)`;
            }
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
        });
    }

    // Text scramble effect
    scrambleText(element, newText) {
        const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        const duration = 1000;
        const frameRate = 30;
        const frames = duration / (1000 / frameRate);
        let frame = 0;

        const scramble = () => {
            if (frame < frames) {
                let scrambled = '';
                for (let i = 0; i < newText.length; i++) {
                    if (i < frame / 2) {
                        scrambled += newText[i];
                    } else {
                        scrambled += chars[Math.floor(Math.random() * chars.length)];
                    }
                }
                element.textContent = scrambled;
                frame++;
                setTimeout(scramble, 1000 / frameRate);
            } else {
                element.textContent = newText;
            }
        };

        scramble();
    }

    // Typewriter effect
    typeWriter(element, text, speed = 50) {
        let i = 0;
        element.textContent = '';
        
        const type = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        };
        
        type();
    }
}

// CSS for animations
const animationStyles = `
    <style>
        /* Fade in animation */
        .fade-in {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }

        .fade-in-visible {
            opacity: 1;
            transform: translateY(0);
        }

        /* Scale in animation */
        .scale-in {
            opacity: 0;
            transform: scale(0.9);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }

        .scale-in-visible {
            opacity: 1;
            transform: scale(1);
        }

        /* Custom cursor */
        .custom-cursor {
            width: 40px;
            height: 40px;
            border: 2px solid rgba(255, 215, 0, 0.5);
            border-radius: 50%;
            position: fixed;
            pointer-events: none;
            z-index: 9999;
            transition: width 0.3s, height 0.3s, border-color 0.3s;
            mix-blend-mode: difference;
        }

        .cursor-dot {
            width: 6px;
            height: 6px;
            background: #FFD700;
            border-radius: 50%;
            position: fixed;
            pointer-events: none;
            z-index: 9999;
        }

        .custom-cursor.cursor-hover {
            width: 60px;
            height: 60px;
            border-color: rgba(255, 215, 0, 1);
        }

        .cursor-dot.cursor-hover {
            transform: scale(2);
        }

        /* Hide default cursor on desktop */
        @media (pointer: fine) {
            * {
                cursor: none !important;
            }
        }

        /* Stagger animation */
        .stagger {
            opacity: 0;
            transform: translateY(20px);
        }

        .stagger-visible {
            opacity: 1;
            transform: translateY(0);
            transition: all 0.6s ease-out;
        }

        .stagger-visible:nth-child(1) { transition-delay: 0.1s; }
        .stagger-visible:nth-child(2) { transition-delay: 0.2s; }
        .stagger-visible:nth-child(3) { transition-delay: 0.3s; }
        .stagger-visible:nth-child(4) { transition-delay: 0.4s; }
        .stagger-visible:nth-child(5) { transition-delay: 0.5s; }
        .stagger-visible:nth-child(6) { transition-delay: 0.6s; }
    </style>
`;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    // Add animation styles
    document.head.insertAdjacentHTML('beforeend', animationStyles);
    
    // Initialize animation controller
    const animations = new AnimationController();
    
    // Make it globally accessible
    window.animations = animations;
});