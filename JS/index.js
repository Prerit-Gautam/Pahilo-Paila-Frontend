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

  // Exit if required elements are not found
  if (!slides.length || !dotsContainer || !prevBtn || !nextBtn) {
    return;
  }

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

// Authentication UI Management
document.addEventListener("DOMContentLoaded", function () {
  // Check authentication state and update UI
  function updateAuthUI() {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const userEmail = localStorage.getItem("userEmail");

    const authButtons = document.querySelector(".auth-buttons");
    const userProfile = document.getElementById("userProfile");
    const userEmailSpan = document.getElementById("userEmail");
    const mobileAuthButtons = document.querySelector(".mobile-auth-buttons");
    const mobileUserProfile = document.getElementById("mobileUserProfile");
    const mobileUserEmailSpan = document.getElementById("mobileUserEmail");

    if (isLoggedIn && userEmail) {
      // Hide auth buttons, show user profile
      if (authButtons) authButtons.style.display = "none";
      if (userProfile) {
        userProfile.style.display = "flex";
        if (userEmailSpan) userEmailSpan.textContent = userEmail;
      }

      // Mobile view
      if (mobileAuthButtons) mobileAuthButtons.style.display = "none";
      if (mobileUserProfile) {
        mobileUserProfile.style.display = "block";
        if (mobileUserEmailSpan) mobileUserEmailSpan.textContent = userEmail;
      }
    } else {
      // Show auth buttons, hide user profile
      if (authButtons) authButtons.style.display = "flex";
      if (userProfile) userProfile.style.display = "none";

      // Mobile view
      if (mobileAuthButtons) mobileAuthButtons.style.display = "block";
      if (mobileUserProfile) mobileUserProfile.style.display = "none";
    }
  }

  // Call on page load
  updateAuthUI();

  // Handle form submission
  const authForm = document.getElementById("authForm");
  if (authForm) {
    authForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const isRegisterMode = document
        .getElementById("registerTab")
        .classList.contains("active");

      // Simple authentication (you can replace this with actual API call)
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", email);

      // Update UI
      updateAuthUI();

      // Close modal
      const authModal = document.getElementById("authModal");
      if (authModal) {
        authModal.style.display = "none";
        document.body.classList.remove("modal-open");
      }

      // Reset form
      authForm.reset();
    });
  }

  // Handle logout
  const logoutBtn = document.getElementById("logoutBtn");
  const mobileLogoutBtn = document.getElementById("mobileLogoutBtn");

  function handleLogout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    updateAuthUI();
  }

  if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);
  if (mobileLogoutBtn) mobileLogoutBtn.addEventListener("click", handleLogout);

  // Authentication modal open/close and tab handling
  (function () {
    const authModal = document.getElementById("authModal");
    if (!authModal) return;

    const loginBtnMain = document.getElementById("loginBtn");
    const registerBtnMain = document.getElementById("registerBtn");
    const mobileLoginBtn = document.getElementById("mobileLoginBtn");
    const mobileRegisterBtn = document.getElementById("mobileRegisterBtn");
    const closeBtn = authModal.querySelector(".close");
    const loginTab = document.getElementById("loginTab");
    const registerTab = document.getElementById("registerTab");
    const confirmPasswordGroup = document.getElementById(
      "confirmPasswordGroup"
    );
    const formTitle = document.getElementById("formTitle");
    const formSubtitle = document.getElementById("formSubtitle");
    const modalContent = authModal.querySelector(".modal-content");

    function openAuthModal(mode = "login") {
      authModal.style.display = "block";
      document.body.classList.add("modal-open");
      // reset scroll inside modal
      if (modalContent) modalContent.scrollTop = 0;

      if (mode === "register") {
        registerTab.classList.add("active");
        loginTab.classList.remove("active");
        confirmPasswordGroup.style.display = "block";
        formTitle.textContent = "Create your account";
        formSubtitle.textContent = "Register to get started";
      } else {
        loginTab.classList.add("active");
        registerTab.classList.remove("active");
        confirmPasswordGroup.style.display = "none";
        formTitle.textContent = "Welcome to PahiloPaila";
        formSubtitle.textContent = "Sign in to continue your journey";
      }

      // focus first input in modal after open
      setTimeout(() => {
        const firstInput = authModal.querySelector(
          ".auth-form-container input"
        );
        if (firstInput) firstInput.focus();
      }, 250);
    }

    function closeAuthModal() {
      authModal.style.display = "none";
      document.body.classList.remove("modal-open");
    }

    // Buttons that open the modal
    if (loginBtnMain)
      loginBtnMain.addEventListener("click", () => openAuthModal("login"));
    if (registerBtnMain)
      registerBtnMain.addEventListener("click", () =>
        openAuthModal("register")
      );
    if (mobileLoginBtn)
      mobileLoginBtn.addEventListener("click", () => openAuthModal("login"));
    if (mobileRegisterBtn)
      mobileRegisterBtn.addEventListener("click", () =>
        openAuthModal("register")
      );

    // Close button and clicking outside modal content closes it
    if (closeBtn) closeBtn.addEventListener("click", closeAuthModal);
    authModal.addEventListener("click", (e) => {
      if (e.target === authModal) closeAuthModal();
    });

    // Tab switching inside modal
    if (loginTab) {
      loginTab.addEventListener("click", () => {
        loginTab.classList.add("active");
        registerTab.classList.remove("active");
        confirmPasswordGroup.style.display = "none";
        formTitle.textContent = "Welcome to PahiloPaila";
        formSubtitle.textContent = "Sign in to continue your journey";
        // keep modal visible and reset scroll to top of modal content
        if (modalContent) modalContent.scrollTop = 0;
      });
    }
    if (registerTab) {
      registerTab.addEventListener("click", () => {
        registerTab.classList.add("active");
        loginTab.classList.remove("active");
        confirmPasswordGroup.style.display = "block";
        formTitle.textContent = "Create your account";
        formSubtitle.textContent = "Register to get started";
        if (modalContent) modalContent.scrollTop = 0;
      });
    }

    // Optional: close modal on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && authModal.style.display === "block") {
        closeAuthModal();
      }
    });
  })();
});

// Enhanced About Us Section Interactivity
document.addEventListener("DOMContentLoaded", function () {
  // Image tilt effect
  const tiltElements = document.querySelectorAll("[data-tilt]");
  tiltElements.forEach((element) => {
    element.addEventListener("mousemove", (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateY = (x - centerX) / 25;
      const rotateX = (centerY - y) / 25;

      element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });

    element.addEventListener("mouseleave", () => {
      element.style.transform =
        "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
    });
  });

  // Interactive stats counter animation
  const statElements = document.querySelectorAll(".stat-number[data-count]");
  const animateCounter = (element) => {
    const target = +element.getAttribute("data-count");
    const increment = target / 100;
    let current = 0;

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        element.innerText = Math.ceil(current);
        setTimeout(updateCounter, 20);
      } else {
        element.innerText = target;
      }
    };

    updateCounter();
  };

  // Observe stats elements for animation when they come into view
  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const counterElement = entry.target;
          animateCounter(counterElement);
          statObserver.unobserve(counterElement);
        }
      });
    },
    { threshold: 0.5 }
  );

  statElements.forEach((stat) => {
    statObserver.observe(stat);
  });

  // Add scroll to top button for better UX
  const scrollToTopBtn = document.createElement("button");
  scrollToTopBtn.innerHTML = "↑";
  scrollToTopBtn.setAttribute("id", "scrollToTop");
  scrollToTopBtn.style.position = "fixed";
  scrollToTopBtn.style.bottom = "30px";
  scrollToTopBtn.style.right = "30px";
  scrollToTopBtn.style.width = "50px";
  scrollToTopBtn.style.height = "50px";
  scrollToTopBtn.style.borderRadius = "50%";
  scrollToTopBtn.style.background =
    "linear-gradient(135deg, var(--secondary-color), #2980b9)";
  scrollToTopBtn.style.color = "white";
  scrollToTopBtn.style.border = "none";
  scrollToTopBtn.style.fontSize = "24px";
  scrollToTopBtn.style.cursor = "pointer";
  scrollToTopBtn.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.3)";
  scrollToTopBtn.style.zIndex = "1000";
  scrollToTopBtn.style.display = "none";
  scrollToTopBtn.style.alignItems = "center";
  scrollToTopBtn.style.justifyContent = "center";
  scrollToTopBtn.style.transition = "all 0.3s ease";

  document.body.appendChild(scrollToTopBtn);

  window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
      scrollToTopBtn.style.display = "flex";
    } else {
      scrollToTopBtn.style.display = "none";
    }
  });

  scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  scrollToTopBtn.addEventListener("mouseenter", () => {
    scrollToTopBtn.style.transform = "scale(1.1)";
  });

  scrollToTopBtn.addEventListener("mouseleave", () => {
    scrollToTopBtn.style.transform = "scale(1)";
  });

  // AI Chatbot functionality - redirect to discover page
  const aiChatbotInput = document.querySelector(".ai-chatbot-input");
  if (aiChatbotInput) {
    aiChatbotInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        const query = aiChatbotInput.value.trim();
        if (query) {
          // Redirect to discover page with query parameter
          window.location.href = `discover.html?query=${encodeURIComponent(
            query
          )}`;
        }
      }
    });

    // Also handle click on the input to redirect to discover page
    aiChatbotInput.addEventListener("click", function () {
      window.location.href = "discover.html";
    });
  }

  // Travel Stories functionality
  const loadMoreBtn = document.getElementById("loadMoreStories");
  const storiesWrapper = document.querySelector(".stories-wrapper");
  const addStoryBtn = document.getElementById("addStoryBtn");
  const addStoryForm = document.getElementById("addStoryForm");
  const cancelStoryBtn = document.getElementById("cancelStoryBtn");
  const storyForm = document.getElementById("storyForm");

  // Create share modal
  createShareModal();

  if (loadMoreBtn && storiesWrapper) {
    loadMoreBtn.addEventListener("click", function () {
      // Show loading state
      const originalText = loadMoreBtn.innerHTML;
      loadMoreBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Loading...';
      loadMoreBtn.disabled = true;

      // Simulate loading more stories
      setTimeout(() => {
        // Add more stories to the wrapper
        const newStories = `
          <!-- Story 4 -->
          <div class="story-card">
            <div class="story-header">
              <div class="author-avatar">
                TS
              </div>
              <div class="story-meta">
                <div class="author-name">Thomas Smith</div>
                <div class="story-location"><i class="fas fa-map-marker-alt"></i> Dolpo Region</div>
              </div>
            </div>
            <div class="story-content">
              <h4 class="story-title">Remote Beauty of Dolpo</h4>
              <p class="story-excerpt">The journey to Dolpo was challenging but incredibly rewarding. Our guide Lobsang led us through high mountain passes and ancient Buddhist settlements. The pristine Phoksundo Lake with its stunning turquoise color was the highlight of the trip. The unique culture and traditions of the Dolpo people, who have remained isolated for centuries, fascinated us throughout our stay.</p>
              <div class="story-actions">
                <button class="action-btn like-btn">
                  <i class="far fa-heart"></i>
                  <span>33</span>
                </button>
                <button class="action-btn comment-btn">
                  <i class="far fa-comment"></i>
                  <span>11</span>
                </button>
                <button class="action-btn share-btn">
                  <i class="fas fa-share"></i>
                </button>
              </div>
              <!-- Comment Section (Hidden by default) -->
              <div class="comment-section" style="display: none;">
                <div class="comments-list">
                  <div class="comment">
                    <div class="comment-avatar">
                      NK
                    </div>
                    <div class="comment-content">
                      <div class="comment-author">Nabin KC</div>
                      <div class="comment-text">Dolpo is on my bucket list! How difficult was the trek?</div>
                      <div class="comment-time">4 hours ago</div>
                    </div>
                  </div>
                </div>
                <div class="add-comment">
                  <div class="comment-avatar">
                    Y
                  </div>
                  <div class="comment-input-container">
                    <input type="text" class="comment-input" placeholder="Add a comment...">
                    <button class="submit-comment-btn">Post</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Story 5 -->
          <div class="story-card">
            <div class="story-header">
              <div class="author-avatar">
                AR
              </div>
              <div class="story-meta">
                <div class="author-name">Anna Roberts</div>
                <div class="story-location"><i class="fas fa-map-marker-alt"></i> Kanchenjunga Region</div>
              </div>
            </div>
            <div class="story-content">
              <h4 class="story-title">Mystical Kanchenjunga Trails</h4>
              <p class="story-excerpt">The Kanchenjunga region offered a perfect blend of adventure and spirituality. Our guide Tashi shared fascinating stories about the world's third highest peak and the local Limbu culture. The rhododendron forests in full bloom and the pristine rivers flowing through the valleys created a magical atmosphere. The respect the local communities have for their sacred mountains was truly inspiring.</p>
              <div class="story-actions">
                <button class="action-btn like-btn">
                  <i class="far fa-heart"></i>
                  <span>47</span>
                </button>
                <button class="action-btn comment-btn">
                  <i class="far fa-comment"></i>
                  <span>18</span>
                </button>
                <button class="action-btn share-btn">
                  <i class="fas fa-share"></i>
                </button>
              </div>
              <!-- Comment Section (Hidden by default) -->
              <div class="comment-section" style="display: none;">
                <div class="comments-list">
                  <div class="comment">
                    <div class="comment-avatar">
                      GT
                    </div>
                    <div class="comment-content">
                      <div class="comment-author">Ganesh Thapa</div>
                      <div class="comment-text">I'm from Kanchenjunga region! Would love to be your local guide if you visit again.</div>
                      <div class="comment-time">1 day ago</div>
                    </div>
                  </div>
                  <div class="comment">
                    <div class="comment-avatar">
                      SM
                    </div>
                    <div class="comment-content">
                      <div class="comment-author">Sophie Martin</div>
                      <div class="comment-text">The rhododendron forests sound amazing. When is the best time to see them in bloom?</div>
                      <div class="comment-time">3 days ago</div>
                    </div>
                  </div>
                </div>
                <div class="add-comment">
                  <div class="comment-avatar">
                    Y
                  </div>
                  <div class="comment-input-container">
                    <input type="text" class="comment-input" placeholder="Add a comment...">
                    <button class="submit-comment-btn">Post</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;

        storiesWrapper.insertAdjacentHTML("beforeend", newStories);

        // Restore button state
        loadMoreBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Load More';
        loadMoreBtn.disabled = false;

        // Add event listeners to new buttons
        addStoryEventListeners();
      }, 1500);
    });
  }

  // Toggle add story form
  if (addStoryBtn && addStoryForm) {
    addStoryBtn.addEventListener("click", function () {
      addStoryForm.style.display = "block";
      addStoryBtn.style.display = "none";
    });
  }

  // Cancel story form
  if (cancelStoryBtn && addStoryForm && addStoryBtn) {
    cancelStoryBtn.addEventListener("click", function () {
      addStoryForm.style.display = "none";
      addStoryBtn.style.display = "inline-block";
      // Reset form
      if (storyForm) {
        storyForm.reset();
      }
    });
  }

  // Handle story submission
  if (storyForm && storiesWrapper && addStoryForm && addStoryBtn) {
    storyForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form values
      const title = document.getElementById("storyTitle").value;
      const location = document.getElementById("storyLocation").value;
      const content = document.getElementById("storyContent").value;

      // Validate form
      if (!title || !location || !content) {
        alert("Please fill in all fields");
        return;
      }

      // Create new story element
      const currentDate = new Date();
      const formattedDate = `${currentDate.getDate()} ${
        [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ][currentDate.getMonth()]
      }`;

      const newStory = `
        <div class="story-card">
          <div class="story-header">
            <div class="author-avatar">
              Y
            </div>
            <div class="story-meta">
              <div class="author-name">You</div>
              <div class="story-location"><i class="fas fa-map-marker-alt"></i> ${location}</div>
            </div>
          </div>
          <div class="story-content">
            <h4 class="story-title">${title}</h4>
            <p class="story-excerpt">${content}</p>
            <div class="story-actions">
              <button class="action-btn like-btn">
                <i class="far fa-heart"></i>
                <span>0</span>
              </button>
              <button class="action-btn comment-btn">
                <i class="far fa-comment"></i>
                <span>0</span>
              </button>
              <button class="action-btn share-btn">
                <i class="fas fa-share"></i>
              </button>
            </div>
            <!-- Comment Section (Hidden by default) -->
            <div class="comment-section" style="display: none;">
              <div class="comments-list">
                <!-- Comments will be added here -->
              </div>
              <div class="add-comment">
                <div class="comment-avatar">
                  Y
                </div>
                <div class="comment-input-container">
                  <input type="text" class="comment-input" placeholder="Add a comment...">
                  <button class="submit-comment-btn">Post</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      // Add new story to the beginning of the stories wrapper
      storiesWrapper.insertAdjacentHTML("afterbegin", newStory);

      // Hide form and show button
      addStoryForm.style.display = "none";
      addStoryBtn.style.display = "inline-block";

      // Reset form
      storyForm.reset();

      // Add event listeners to new buttons
      addStoryEventListeners();

      // Show success message
      alert("Your story has been published successfully!");
    });
  }

  // Add event listeners to story action buttons
  function addStoryEventListeners() {
    // Like buttons
    document.querySelectorAll(".like-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const icon = this.querySelector("i");
        const countSpan = this.querySelector("span");
        let count = parseInt(countSpan.textContent);

        if (icon.classList.contains("far")) {
          // Like the story
          icon.classList.remove("far");
          icon.classList.add("fas", "liked");
          count++;
        } else {
          // Unlike the story
          icon.classList.remove("fas", "liked");
          icon.classList.add("far");
          count--;
        }

        countSpan.textContent = count;
      });
    });

    // Comment buttons
    document.querySelectorAll(".comment-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const storyCard = this.closest(".story-card");
        const commentSection = storyCard.querySelector(".comment-section");

        // Toggle comment section visibility
        if (
          commentSection.style.display === "none" ||
          commentSection.style.display === ""
        ) {
          commentSection.style.display = "block";
        } else {
          commentSection.style.display = "none";
        }
      });
    });

    // Submit comment buttons
    document.querySelectorAll(".submit-comment-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const commentInput = this.parentElement.querySelector(".comment-input");
        const commentText = commentInput.value.trim();

        if (commentText) {
          const commentSection = this.closest(".comment-section");
          const commentsList = commentSection.querySelector(".comments-list");

          // Create new comment element
          const newComment = `
            <div class="comment">
              <div class="comment-avatar">
                Y
              </div>
              <div class="comment-content">
                <div class="comment-author">You</div>
                <div class="comment-text">${commentText}</div>
                <div class="comment-time">Just now</div>
              </div>
            </div>
          `;

          // Add new comment to the list
          commentsList.insertAdjacentHTML("beforeend", newComment);

          // Clear input
          commentInput.value = "";

          // Update comment count
          const storyCard = this.closest(".story-card");
          const commentBtn = storyCard.querySelector(".comment-btn");
          const countSpan = commentBtn.querySelector("span");
          let count = parseInt(countSpan.textContent);
          count++;
          countSpan.textContent = count;
        }
      });
    });

    // Share buttons
    document.querySelectorAll(".share-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const storyCard = this.closest(".story-card");
        const storyTitle = storyCard.querySelector(".story-title").textContent;
        openShareModal(storyTitle);
      });
    });
  }

  // Create share modal
  function createShareModal() {
    const modal = document.createElement("div");
    modal.className = "share-modal";
    modal.id = "shareModal";
    modal.innerHTML = `
      <div class="share-content">
        <div class="share-header">
          <h3>Share this story</h3>
          <button class="close-share-modal">&times;</button>
        </div>
        <div class="share-options">
          <div class="share-option facebook">
            <i class="fab fa-facebook-f"></i>
            <span>Facebook</span>
          </div>
          <div class="share-option twitter">
            <i class="fab fa-twitter"></i>
            <span>Twitter</span>
          </div>
          <div class="share-option whatsapp">
            <i class="fab fa-whatsapp"></i>
            <span>WhatsApp</span>
          </div>
          <div class="share-option linkedin">
            <i class="fab fa-linkedin-in"></i>
            <span>LinkedIn</span>
          </div>
          <div class="share-option reddit">
            <i class="fab fa-reddit-alien"></i>
            <span>Reddit</span>
          </div>
          <div class="share-option copy-link">
            <i class="fas fa-link"></i>
            <span>Copy Link</span>
          </div>
        </div>
        <div class="share-link">
          <input type="text" id="shareLinkInput" readonly>
          <button id="copyLinkBtn">Copy</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Add event listeners for modal
    document
      .querySelector(".close-share-modal")
      .addEventListener("click", function () {
        document.getElementById("shareModal").classList.remove("active");
      });

    // Add event listeners for share options
    document.querySelectorAll(".share-option").forEach((option) => {
      option.addEventListener("click", function () {
        const platform = this.querySelector("span").textContent;
        alert(
          `Sharing to ${platform}!\nIn a full implementation, this would open the ${platform} sharing dialog.`
        );
        document.getElementById("shareModal").classList.remove("active");
      });
    });

    // Copy link functionality
    document
      .getElementById("copyLinkBtn")
      .addEventListener("click", function () {
        const linkInput = document.getElementById("shareLinkInput");
        linkInput.select();
        document.execCommand("copy");
        alert("Link copied to clipboard!");
      });
  }

  // Open share modal
  function openShareModal(storyTitle) {
    const modal = document.getElementById("shareModal");
    const linkInput = document.getElementById("shareLinkInput");

    // Set the share link (in a real app, this would be a real URL)
    linkInput.value = `https://pahilopaila.com/story/${encodeURIComponent(
      storyTitle.toLowerCase().replace(/\s+/g, "-")
    )}`;

    modal.classList.add("active");
  }

  // Initialize event listeners
  addStoryEventListeners();
});
