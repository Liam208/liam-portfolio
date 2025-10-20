const body = document.body;
let themeToggle;

// --- Typing Animation Logic ---
let typeInterval;

function initTypingAnimation() {
  const typingTextElement = document.getElementById("typing-text");
  if (!typingTextElement) return;

  const staticPart = "A 16 year old who likes to ";
  const phrases = ["Program", "Do Maths"];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentPhrase = phrases[phraseIndex];
    const displayedText = currentPhrase.substring(0, charIndex);

    typingTextElement.innerHTML =
      staticPart + displayedText + '<span class="typing-cursor"></span>';

    if (!isDeleting && charIndex < currentPhrase.length) {
      charIndex++;
      typeInterval = setTimeout(type, 100); // Typing speed
    } else if (isDeleting && charIndex > 0) {
      charIndex--;
      typeInterval = setTimeout(type, 50); // Deleting speed
    } else if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      typeInterval = setTimeout(type, 1500); // Pause after typing
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typeInterval = setTimeout(type, 500); // Pause before typing next phrase
    }
  }

  // Start the typing animation
  type();
}
// --- End Typing Animation Logic ---

function setTheme(mode) {
  if (!themeToggle) {
    themeToggle = document.getElementById("theme-toggle");
  }

  const iconElement = themeToggle.querySelector("i");

  if (mode === "light") {
    body.classList.add("light-mode");
    iconElement.classList.remove("fa-moon");
    iconElement.classList.add("fa-sun");
    localStorage.setItem("theme", "light");
  } else {
    body.classList.remove("light-mode");
    iconElement.classList.remove("fa-sun");
    iconElement.classList.add("fa-moon");
    localStorage.setItem("theme", "dark");
  }

  // 👇 ADD THIS LINE to automatically update the carousel theme
  updateCarouselTheme();
}

function togglePageTheme() {
  if (body.classList.contains("light-mode")) {
    setTheme("dark");
  } else {
    setTheme("light");
  }
}

// Ensure the DOM is fully loaded before running initial scripts and event listeners
document.addEventListener("DOMContentLoaded", function () {
  // Initialize themeToggle here as well, to ensure it's found when the page loads
  themeToggle = document.getElementById("theme-toggle");

  // --- Initial Theme Loading Logic ---
  const storedTheme = localStorage.getItem("theme");
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)");

  if (storedTheme) {
    setTheme(storedTheme); // Use stored preference
  } else if (prefersLight.matches) {
    setTheme("light"); // Use system preference if no stored theme
  } else {
    setTheme("dark"); // Default to dark mode
  }
  // --- End Initial Theme Loading Logic ---

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
        });

        if (history.pushState) {
          const baseUrl =
            window.location.protocol +
            "//" +
            window.location.host +
            window.location.pathname;
          history.pushState(null, null, baseUrl);
        }
      }
    });
  });

  // Set current year in footer
  const currentYearSpan = document.getElementById("current-year");
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // Optional: Add active class to nav links on scroll
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      // Adjust offset for better active state detection
      if (pageYOffset >= sectionTop - sectionHeight / 3) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href").includes(current)) {
        link.classList.add("active");
      }
    });
  });

  // Basic Form submission (for the disabled form, no actual submission here)
  const contactForm = document.querySelector("form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      console.log("Form submission attempted (currently disabled).");
    });
  }
  // animation
  const scrollAnimatedElements = document.querySelectorAll(".scroll-animate");

  const observerOptions = {
    root: null, // Use the viewport as the root
    rootMargin: "0px", // No margin around the root
    threshold: 0.1, // Trigger when 10% of the element is visible (you can adjust this)
  };

  const observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // If element is in view, add the 'is-visible' class
        entry.target.classList.add("is-visible");
        // REMOVED: observer.unobserve(entry.target); // <-- Remove this line to keep observing
      } else {
        // If element is NOT in view, remove the 'is-visible' class (this causes fade out)
        entry.target.classList.remove("is-visible");
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  scrollAnimatedElements.forEach((element) => {
    observer.observe(element);
  });
  // Initialize the typing animation
  const typingElement = document.getElementById("typing-text");
  if (typingElement && typingElement.classList.contains("scroll-animate")) {
    // If it's a scroll-animated element, start typing after it becomes visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id === "typing-text") {
            initTypingAnimation();
            observer.unobserve(entry.target); // Only start once
          }
        });
      },
      { threshold: 0.5 }
    ); // Adjust threshold as needed
    observer.observe(typingElement);
  } else {
    // If not scroll-animated, start typing directly after DOMContentLoaded
    initTypingAnimation();
  }
});

// --- Functions to detect conditions ---
function isMobile() {
  return window.innerWidth < 768;
}

function isLightMode() {
  return document.body.classList.contains("light-mode");
}

// --- Update carousel-dark for all visible carousels ---
// --- Update carousel-dark for all visible carousels ---
function updateCarouselTheme() {
  // Select all carousels you want to affect
  const carousels = document.querySelectorAll(".carousel");

  carousels.forEach((carousel) => {
    if (carousel.classList.contains("d-none")) return; // skip hidden ones

    // We ONLY need the 'carousel-dark' class if the page is in light mode.
    // If it's light mode, the carousel background is light, and we need
    // dark controls (carousel-dark) for visibility.
    // If it's dark mode, the carousel background is dark, and we want
    // default light controls (no carousel-dark).
    if (isLightMode()) {
      carousel.classList.add("carousel-dark");
    } else {
      carousel.classList.remove("carousel-dark");
    }
  });
}

// --- Show/hide cards according to category ---
function updateCardsDisplay() {
  const activeCategory = document
    .querySelector("#carouselExampleIndicators .carousel-item.active h3")
    .textContent.toLowerCase();

  // Handle "I'm 16 so no Jobs yet" card
  const noJobsCard = document.querySelector("#noJobsCard");
  if (activeCategory.includes("work")) {
    noJobsCard.classList.remove("d-none");
  } else {
    noJobsCard.classList.add("d-none");
  }

  // Handle other cards carousels
  const cardCarousels = document.querySelectorAll(".cards-carousel");
  cardCarousels.forEach((carousel) => {
    if (
      activeCategory.includes("education") &&
      carousel.id === "certificateCards"
    ) {
      carousel.classList.remove("d-none");
    } else if (activeCategory.includes("work") && carousel.id === "workCards") {
      carousel.classList.remove("d-none");
    } else {
      carousel.classList.add("d-none");
    }
  });

  updateCarouselTheme(); // apply carousel-dark to all visible carousels
}

// --- Event listeners ---
const categoryCarousel = document.getElementById("carouselExampleIndicators");
categoryCarousel.addEventListener("slid.bs.carousel", updateCardsDisplay);
window.addEventListener("resize", updateCarouselTheme);
window.addEventListener("DOMContentLoaded", () => {
  updateCardsDisplay();
});
