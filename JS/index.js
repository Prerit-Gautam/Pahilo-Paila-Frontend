// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Preloader
  const preloader = document.querySelector(".preloader");
  window.addEventListener("load", function () {
    preloader.style.opacity = "0";
    setTimeout(function () {
      preloader.style.display = "none";
    }, 500);
  });

  // Navbar scroll effect
  const header = document.querySelector("header");
  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // Mobile menu toggle
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  hamburger.addEventListener("click", function () {
    navLinks.classList.toggle("active");
    hamburger.classList.toggle("active");
  });

  // Close mobile menu when clicking on a link
  const navItems = document.querySelectorAll(".nav-links a");
  navItems.forEach((item) => {
    item.addEventListener("click", function () {
      if (navLinks.classList.contains("active")) {
        navLinks.classList.remove("active");
        hamburger.classList.remove("active");
      }
    });
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        });
      }
    });
  });

  // Interactive Map Functionality
  const mapAreas = document.querySelectorAll("area[data-location]");
  const messageText = document.querySelector(".message-text");
  const locationName = document.querySelector(".location-name");
  const nepalMap = document.querySelector(".nepal-map");

  if (mapAreas.length > 0) {
    // Set default message
    messageText.textContent =
      "Click on any district to discover unique local stories and authentic experiences from rural communities";
    locationName.textContent = "Welcome to Nepal";

    // Add click event to each area
    mapAreas.forEach((area) => {
      area.addEventListener("click", function () {
        // Get data attributes from the area element
        const location = this.getAttribute("data-location");
        const message = this.getAttribute("data-message");

        // Update message display with animation
        messageText.style.opacity = "0";
        locationName.style.opacity = "0";

        setTimeout(() => {
          messageText.textContent = message;
          locationName.textContent = location;
          messageText.style.opacity = "1";
          locationName.style.opacity = "1";
        }, 300);

        // Add pulse effect to map
        nepalMap.style.transform = "scale(1.02)";
        setTimeout(() => {
          nepalMap.style.transform = "scale(1)";
        }, 300);
      });
    });

    // Trigger click on first area to show initial message
    setTimeout(() => {
      if (mapAreas[0]) {
        mapAreas[0].click();
      }
    }, 1000);
  }

  // Add animation to elements when they come into view
  const animateOnScroll = function () {
    const elements = document.querySelectorAll(
      ".destination-card, .about-content, .testimonial, .nepal-map-container, .section-header, .feature-card, .step-card, .testimonial-card"
    );

    elements.forEach((element) => {
      const elementPosition = element.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.3;

      if (elementPosition < screenPosition) {
        element.classList.add("animate");
      }
    });
  };

  // Initial check for elements in view
  animateOnScroll();

  // Check for elements in view on scroll
  window.addEventListener("scroll", animateOnScroll);

  // Typing animation for hero text (like before)
  const typingText = document.querySelector(".typing-text");
  if (typingText) {
    const text = typingText.textContent;
    typingText.textContent = "";
    typingText.style.opacity = "1";
    let i = 0;

    setTimeout(() => {
      const typeWriter = setInterval(() => {
        if (i < text.length) {
          typingText.textContent += text.charAt(i);
          i++;
        } else {
          clearInterval(typeWriter);
        }
      }, 50);
    }, 500);
  }

  // Add scroll progress indicator
  const progressBar = document.createElement("div");
  progressBar.style.position = "fixed";
  progressBar.style.top = "0";
  progressBar.style.left = "0";
  progressBar.style.height = "4px";
  progressBar.style.background = "linear-gradient(to right, #2e7d32, #ff6f00)";
  progressBar.style.width = "0%";
  progressBar.style.zIndex = "9999";
  progressBar.style.transition = "width 0.2s ease";
  document.body.appendChild(progressBar);

  window.addEventListener("scroll", function () {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + "%";
  });
});

// District Stories Carousel
document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelectorAll(".story-slide");
  const dotsContainer = document.querySelector(".slider-dots");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");
  let currentSlide = 0;

  // Create dots
  slides.forEach((_, index) => {
    const dot = document.createElement("div");
    dot.classList.add("slider-dot");
    if (index === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll(".slider-dot");

  // Function to go to a specific slide
  function goToSlide(slideIndex) {
    slides[currentSlide].classList.remove("active");
    dots[currentSlide].classList.remove("active");

    currentSlide = slideIndex;

    slides[currentSlide].classList.add("active");
    dots[currentSlide].classList.add("active");
  }

  // Next button functionality
  function nextSlide() {
    const nextIndex = (currentSlide + 1) % slides.length;
    goToSlide(nextIndex);
  }

  // Previous button functionality
  function prevSlide() {
    const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
    goToSlide(prevIndex);
  }

  // Event listeners
  nextBtn.addEventListener("click", nextSlide);
  prevBtn.addEventListener("click", prevSlide);

  // Auto-advance slides every 5 seconds
  setInterval(nextSlide, 5000);
});

// Add CSS class for scroll animation
document.addEventListener("DOMContentLoaded", function () {
  const style = document.createElement("style");
  style.textContent = `
        .destination-card, .about-content, .testimonial {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .destination-card.animate, .about-content.animate, .testimonial.animate {
            opacity: 1;
            transform: translateY(0);
        }
        
        .destination-card:nth-child(2) {
            transition-delay: 0.2s;
        }
        
        .destination-card:nth-child(3) {
            transition-delay: 0.4s;
        }
        
        .hamburger.active .bar:nth-child(1) {
            transform: translateY(8px) rotate(45deg);
        }
        
        .hamburger.active .bar:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active .bar:nth-child(3) {
            transform: translateY(-8px) rotate(-45deg);
        }
    `;
  document.head.appendChild(style);
});
