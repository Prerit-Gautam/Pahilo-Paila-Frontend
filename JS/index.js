// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    const preloader = document.querySelector('.preloader');
    window.addEventListener('load', function() {
        preloader.style.opacity = '0';
        setTimeout(function() {
            preloader.style.display = 'none';
        }, 500);
    });

    // Navbar scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Interactive Map Functionality
    const mapPins = document.querySelectorAll('.pin, .map-pin');
    const messageText = document.querySelector('.message-text');
    const locationName = document.querySelector('.location-name');

    if (mapPins.length > 0) {
        // Set default message
        messageText.textContent = 'Discover the unique stories of Nepal\'s rural communities';
        locationName.textContent = '';

        // Add click event to each pin
        mapPins.forEach(pin => {
            pin.addEventListener('click', function() {
                // Remove active class from all pins
                mapPins.forEach(p => p.classList.remove('active'));

                // Add active class to clicked pin
                this.classList.add('active');

                // Get data attributes from the pin element or parent container
                let location, message;

                if (this.classList.contains('pin')) {
                    // New pin structure - data is on the pin itself
                    location = this.getAttribute('data-location');
                    message = this.getAttribute('data-message');
                } else {
                    // Old SVG structure - data is on parent container
                    const container = this.parentElement;
                    location = container.getAttribute('data-location');
                    message = container.getAttribute('data-message');
                }

                // Update message display with animation
                messageText.style.opacity = '0';
                locationName.style.opacity = '0';

                setTimeout(() => {
                    messageText.textContent = message;
                    locationName.textContent = location;
                    messageText.style.opacity = '1';
                    locationName.style.opacity = '1';
                }, 300);
            });
        });

        // Trigger click on first pin to show initial message
        setTimeout(() => {
            mapPins[0].click();
        }, 1000);
    }

    // Add animation to elements when they come into view
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.destination-card, .about-content, .testimonial, .nepal-map-container');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.classList.add('animate');
            }
        });
    };

    // Initial check for elements in view
    animateOnScroll();
    
    // Check for elements in view on scroll
    window.addEventListener('scroll', animateOnScroll);
});

// Add CSS class for scroll animation
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
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