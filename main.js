// Register GSAP or custom observers. We will use a lightweight custom vanilla JS approach.
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Entry Screen & Audio Engine
    const entryScreen = document.getElementById('entry-screen');
    const enterBtn = document.getElementById('enter-btn');
    const bgMusic = document.getElementById('bg-music');

    if(enterBtn) {
        enterBtn.addEventListener('click', () => {
            // Scroll to the very top in case the user scrolled while the overlay was active
            window.scrollTo(0, 0);

            // Initiate Music Playback
            if(bgMusic) {
                bgMusic.volume = 0.5; // Soft background volume
                bgMusic.play().catch(e => console.log('Audio playback prevented by browser:', e));
            }

            // Hide entry screen & allow scroll
            document.body.classList.remove('loading');
            entryScreen.classList.add('hidden');
            
            // Trigger hero animations after a short delay
            setTimeout(() => {
                triggerReveals(document.querySelectorAll('.hero .reveal-up, .hero .reveal-fade, .hero .reveal-scale'));
            }, 600);
        });
    }

    // 2. Scroll Reveal Engine (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal-up:not(.hero *), .reveal-fade:not(.hero *), .reveal-scale:not(.hero *)');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-revealed');
                observer.unobserve(entry.target); // Only reveal once
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Helper for manual trigger (used for hero)
    function triggerReveals(elements) {
        elements.forEach(el => el.classList.add('is-revealed'));
    }

    // 3. Smooth Parallax Effect on Scroll
    const heroBg = document.getElementById('hero-bg');
    const parallaxImg = document.querySelector('.parallax-bg');
    const imageWrappers = document.querySelectorAll('.story-img-wrapper img');
    
    let lastScrollY = window.scrollY;
    let ticking = false;

    window.addEventListener('scroll', () => {
        lastScrollY = window.scrollY;
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateParallax(lastScrollY);
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    function updateParallax(scrollY) {
        // Hero Background Parallax
        if (heroBg && scrollY < window.innerHeight) {
            // translate Y down as we scroll down, creating a slower scroll effect
            heroBg.style.transform = `translate3d(0, ${scrollY * 0.4}px, 0) scale(1.05)`;
        }

        // Parallax Divider
        if (parallaxImg) {
            const rect = parallaxImg.parentElement.getBoundingClientRect();
            // If the section is in the viewport
            if (rect.top <= window.innerHeight && rect.bottom >= 0) {
                // Calculate how far we scrolled past the element
                const scrollProgress = 1 - (rect.bottom / (window.innerHeight + rect.height));
                // Move from -15% to 15%
                const yPos = (scrollProgress * 30) - 15;
                parallaxImg.style.transform = `translate3d(0, ${yPos}%, 0)`;
            }
        }

        // Subtle Image Parallax inside story section
        imageWrappers.forEach(img => {
            const wrapper = img.parentElement;
            const rect = wrapper.getBoundingClientRect();
            if (rect.top <= window.innerHeight && rect.bottom >= 0) {
                const speed = 0.1;
                // Move the image slightly within its wrapper boundaries
                const yPos = (rect.top - window.innerHeight / 2) * speed;
                img.style.transform = `translate3d(0, ${yPos}px, 0) scale(1.1)`;
            }
        });
    }

    // 4. Custom Lightbox
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.close-btn');
    const triggers = document.querySelectorAll('.lightbox-trigger');

    triggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            lightboxImg.src = this.src;
            if(lightboxCaption) {
                lightboxCaption.innerText = this.getAttribute('data-caption') || "";
            }
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Lock scroll
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Release scroll
        // Wait for fade out to clear src (optional)
        setTimeout(() => {
            if(!lightbox.classList.contains('active')) {
                lightboxImg.src = '';
            }
        }, 500);
    };

    closeBtn.addEventListener('click', closeLightbox);
    
    lightbox.querySelector('.lightbox-overlay').addEventListener('click', closeLightbox);

    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape" && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    // 5. Light a Candle Interactive Element
    const candleBtn = document.getElementById('light-candle-btn');
    const flame = document.getElementById('memorial-flame');
    
    if (candleBtn && flame) {
        candleBtn.addEventListener('click', () => {
            if (!flame.classList.contains('lit')) {
                flame.classList.add('lit');
                candleBtn.innerText = "A flame is lit in his honor.";
                candleBtn.style.background = "var(--clr-accent)";
                candleBtn.style.color = "#fff";
                candleBtn.style.cursor = "default";
            }
        });
    }

});
