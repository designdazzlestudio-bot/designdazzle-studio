document.addEventListener('DOMContentLoaded', () => {

    /* ===============================
       1. STICKY NAVBAR & SCROLL HIGHLIGHT
    =============================== */
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.navbar nav a');

    window.addEventListener('scroll', () => {
        // Sticky navbar background
        if (window.scrollY > 50) {
            navbar.classList.add('sticky');
        } else {
            navbar.classList.remove('sticky');
        }

        // Highlight active section link
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100; // offset for navbar

        sections.forEach(section => {
            const offsetTop = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= offsetTop && scrollPos < offsetTop + height) {
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.navbar nav a[href="#${id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    });

    /* ===============================
       2. SMOOTH SCROLL FOR NAV LINKS
    =============================== */
    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 70, // navbar offset
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ===============================
       3. HERO PROFILE IMAGE AUTO-SIZER
    =============================== */
    const profileFrame = document.querySelector('.profile-frame img');
    const syncProfileSize = () => {
        if (profileFrame) {
            profileFrame.style.height = `${profileFrame.offsetWidth}px`;
        }
    };
    window.addEventListener('resize', syncProfileSize);
    syncProfileSize();

    /* ===============================
       4. SKILLS SECTION ANIMATION
    =============================== */
    const skillCards = document.querySelectorAll('.skill-card');

    const revealSkills = () => {
        const triggerBottom = window.innerHeight * 0.85;
        skillCards.forEach(card => {
            const cardTop = card.getBoundingClientRect().top;
            if (cardTop < triggerBottom) {
                card.classList.add('show');
            }
        });
    };

    window.addEventListener('scroll', revealSkills);
    revealSkills();

    skillCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = "translateY(-10px)";
            card.style.transition = "0.3s ease";
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = "translateY(0)";
        });
    });

    // Intersection Observer for smoother animation
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }
        });
    }, { threshold: 0.2 });

    skillCards.forEach(card => observer.observe(card));

    /* ===============================
       5. PORTFOLIO FILTER BUTTONS
    =============================== */
    const filterBtns = document.querySelectorAll("#portfolio .filter-btn");
    const portfolioItems = document.querySelectorAll("#portfolio .portfolio-item");

    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            // Remove 'active' from all buttons
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filterValue = btn.getAttribute("data-filter");

            portfolioItems.forEach(item => {
                if (filterValue === "all" || item.getAttribute("data-category") === filterValue) {
                    item.style.display = "block";
                } else {
                    item.style.display = "none";
                }
            });
        });
    });

    /* ===============================
       6. COURSES CARDS CLICK GLOW
    =============================== */
    const courseCards = document.querySelectorAll('.course-card');
    courseCards.forEach(card => {
        card.addEventListener('click', () => {
            courseCards.forEach(c => c.classList.remove('active-course'));
            card.classList.add('active-course');
        });
    });

    /* ===============================
       7. CTA BUTTON SCROLL
    =============================== */
    const ctaButton = document.querySelector('.hire-btn-large');
    if(ctaButton){
        ctaButton.addEventListener('click', (e) => {
            e.preventDefault();
            const contactSection = document.querySelector('#contact');
            if(contactSection){
                contactSection.scrollIntoView({ behavior: 'smooth' });
            } else {
                console.warn('Contact section not found!');
            }
        });
    }

});