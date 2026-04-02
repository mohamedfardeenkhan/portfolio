document.addEventListener('DOMContentLoaded', () => {
    // 1. Loading Animation
    const loader = document.getElementById('loader');
    
    // Simulate initial loading time for visual effect (optional)
    setTimeout(() => {
        loader.classList.add('hidden');
        // Trigger initial reveal once loaded
        reveal();
    }, 800);

    // 2. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-link');

    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        
        // Toggle icon between bars and times
        const icon = mobileMenuBtn.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu on link click
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        });
    });

    // 3. Theme Toggle (Dark/Light Mode)
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    const body = document.body;

    // Check saved theme in local storage
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        body.classList.remove('light-mode', 'dark-mode');
        body.classList.add(currentTheme);
        
        if (currentTheme === 'dark-mode') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }

    themeToggleBtn.addEventListener('click', () => {
        if (body.classList.contains('light-mode')) {
            body.classList.replace('light-mode', 'dark-mode');
            localStorage.setItem('theme', 'dark-mode');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            body.classList.replace('dark-mode', 'light-mode');
            localStorage.setItem('theme', 'light-mode');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    });

    // 4. Sticky Navbar & Scroll to Top & Active Link Highlight
    const navbar = document.getElementById('navbar');
    const scrollTopBtn = document.getElementById('scroll-top');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let currentScroll = window.scrollY;

        // Sticky Navbar styling
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Scroll to Top Button Visibility
        if (currentScroll > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }

        // Active Link Highlight
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (currentScroll >= (sectionTop - 150) && currentScroll < (sectionTop + sectionHeight - 150)) {
                let id = section.getAttribute('id');
                navLinksItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    // Scroll to Top action
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 5. Scroll Animations (Reveal Elements)
    function reveal() {
        const reveals = document.querySelectorAll('.reveal');
        
        reveals.forEach(element => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 100;

            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', reveal);

    // 6. Form Submission (AJAX without redirect)
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Set Loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
            formStatus.style.display = 'none';

            const formData = new FormData(contactForm);
            // Authenticates to Web3Forms to deliver email securely to your inbox!
            formData.append("access_key", "1aa99623-5275-4d81-8e77-5b234b8a4a2d");
            formData.append("subject", "New Contact Message from Portfolio Website");

            try {
                const response = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    body: formData
                });
                const data = await response.json();

                if (data.success) {
                    formStatus.style.display = 'block';
                    formStatus.style.color = '#10b981';
                    formStatus.innerText = 'Message sent successfully! I will get back to you soon.';
                    contactForm.reset();
                } else {
                    formStatus.style.display = 'block';
                    formStatus.style.color = '#ef4444';
                    formStatus.innerText = 'Error: ' + data.message;
                }
            } catch (error) {
                formStatus.style.display = 'block';
                formStatus.style.color = '#ef4444';
                formStatus.innerText = 'Failed to connect. Please try again later.';
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span>Send Message</span> <i class="fa-solid fa-paper-plane"></i>';
            }
        });
    }
});
