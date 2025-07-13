// Ensure the DOM is fully loaded before running scripts
document.addEventListener('DOMContentLoaded', function() {

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent default jump behavior (and hash from appearing immediately)

            const targetId = this.getAttribute('href'); // e.g., "#projects"
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth' // Enable smooth scrolling
                });

                // After scrolling, update the URL without the hash
                // This uses the History API to change the URL in the address bar
                // without causing a page reload.
                if (history.pushState) {
                    // Get the current base URL (without any hash)
                    const baseUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
                    // Update the URL to the base URL, effectively removing the hash
                    history.pushState(null, null, baseUrl);
                }
            }
        });
    });

    // Set current year in footer
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Optional: Add active class to nav links on scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - sectionHeight / 3) {
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

    // Basic Form submission (for the disabled form, no actual submission here)
    const contactForm = document.querySelector('form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission
            console.log('Form submission attempted (currently disabled).');
        });
    }
});
