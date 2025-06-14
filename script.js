document.addEventListener('DOMContentLoaded', function() {
    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link highlighting
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('text-blue-300');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('text-blue-300');
            }
        });
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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

    // Mobile menu toggle with smooth animation
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    menuBtn.addEventListener('click', () => {
        // Toggle icon between bars and times (x)
        const icon = menuBtn.querySelector('i');
        if (icon.classList.contains('fa-bars')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }

        // Toggle menu with animation
        if (mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.remove('hidden');
            // Trigger AOS animation refresh
            setTimeout(() => {
                AOS.refresh();
            }, 10);
        } else {
            // Add a class for closing animation
            mobileMenu.style.opacity = '0';
            mobileMenu.style.transform = 'translateY(-10px)';
            mobileMenu.style.transition = 'opacity 300ms, transform 300ms';

            // After animation completes, hide the menu
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
                // Reset styles for next opening
                mobileMenu.style.opacity = '';
                mobileMenu.style.transform = '';
            }, 300);
        }
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('#mobile-menu a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });

    // Fade-in Animation on Scroll
    const fadeIns = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    fadeIns.forEach(fade => observer.observe(fade));

    // Typed.js for Hero Section
    const typed = new Typed('#typed', {
        strings: ['Web Developer', 'UI/UX Designer', 'Problem Solver', 'Creative Thinker'],
        typeSpeed: 50,
        backSpeed: 30,
        loop: true,
        showCursor: true,
        cursorChar: '|',
    });

    // Dark/Light Mode Toggle with localStorage
    const themeToggle = document.getElementById('theme-toggle');
    const darkModeToggle = document.getElementById('dark-mode-toggle');

    function setTheme(isDark) {
        if (isDark) {
            document.documentElement.classList.add('dark');
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
            themeToggle.checked = true;
        } else {
            document.documentElement.classList.remove('dark');
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
            themeToggle.checked = false;
        }
    }

    // Check for saved theme preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme === 'dark' || (!currentTheme && prefersDark.matches)) {
        setTheme(true);
    } else {
        setTheme(false);
    }

    // Handle dark mode toggle click
    darkModeToggle.addEventListener('click', (e) => {
        e.preventDefault();
        const isDark = !document.documentElement.classList.contains('dark');
        setTheme(isDark);
        themeToggle.checked = isDark;
    });

    // Back to Top Button
    const backToTop = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.remove('opacity-0', 'invisible', 'scale-90');
            backToTop.classList.add('opacity-100', 'visible', 'scale-100');
        } else {
            backToTop.classList.remove('opacity-100', 'visible', 'scale-100');
            backToTop.classList.add('opacity-0', 'invisible', 'scale-90');
        }
    });

    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Animate progress bars when they come into view
    const progressBars = document.querySelectorAll('.progress');
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const percent = entry.target.getAttribute('data-percent') || '100';
                entry.target.style.width = percent + '%';
            }
        });
    }, { threshold: 0.5 });

    progressBars.forEach(bar => progressObserver.observe(bar));

    // Initialize Particle.js
    if (document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: "#ffffff" },
                shape: { type: "circle" },
                opacity: { value: 0.5, random: true },
                size: { value: 3, random: true },
                line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.4, width: 1 },
                move: { enable: true, speed: 2, direction: "none", random: true, straight: false, out_mode: "out" }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "repulse" },
                    onclick: { enable: true, mode: "push" }
                }
            }
        });
    }

    // Form submission
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Here you would typically send the form data to a server
            alert('Thank you for your message! I will get back to you soon.');
            form.reset();
        });
    }

    // Add scroll progress indicator
    const progressBar = document.createElement('div');
    progressBar.className = 'fixed top-0 left-0 h-1 bg-blue-500 z-50 transition-all duration-300';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });

    // Project filtering
    const projects = document.querySelectorAll('.project-card');
    const filterButtons = document.createElement('div');
    filterButtons.className = 'flex flex-wrap justify-center gap-4 mb-8';
    filterButtons.innerHTML = `
        <button class="filter-btn active px-4 py-2 rounded-full bg-blue-500 text-white" data-filter="all">All</button>
        <button class="filter-btn px-4 py-2 rounded-full bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300" data-filter="react">React</button>
        <button class="filter-btn px-4 py-2 rounded-full bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300" data-filter="vue">Vue</button>
    `;

    document.querySelector('#projects .container').insertBefore(
        filterButtons,
        document.querySelector('#projects .grid')
    );

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active', 'bg-blue-500', 'text-white'));
            btn.classList.add('active', 'bg-blue-500', 'text-white');

            const filter = btn.getAttribute('data-filter');
            projects.forEach(project => {
                if (filter === 'all' || project.getAttribute('data-category') === filter) {
                    project.style.display = 'block';
                } else {
                    project.style.display = 'none';
                }
            });
        });
    });

    // Form handling with validation
    const contactForm = document.querySelector('#contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Basic validation
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            if (!name || !email || !subject || !message) {
                alert('Please fill in all fields');
                return;
            }

            if (!isValidEmail(email)) {
                alert('Please enter a valid email address');
                return;
            }

            // Here you would typically send the data to a server
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                alert('Message sent successfully! I will get back to you soon.');
                contactForm.reset();
            } catch (error) {
                alert('There was an error sending your message. Please try again.');
            }
        });
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Newsletter form handling
    const newsletterForm = document.querySelector('footer form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;

            if (!email || !isValidEmail(email)) {
                alert('Please enter a valid email address');
                return;
            }

            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                alert('Thank you for subscribing to our newsletter!');
                newsletterForm.reset();
            } catch (error) {
                alert('There was an error subscribing. Please try again.');
            }
        });
    }
});
