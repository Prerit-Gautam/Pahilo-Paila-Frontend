// Guide Marketplace JavaScript
// Array to store registered guides
let registeredGuides = [];

document.addEventListener("DOMContentLoaded", function () {
  // ===== MOBILE MENU =====
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const navLinks = document.querySelector(".nav-links");

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", function () {
      navLinks.classList.toggle("active");
    });
  }

  // ===== LEAFLET MAP INITIALIZATION =====
  if (document.getElementById("map")) {
    const map = L.map("map").setView([28.3949, 84.124], 7);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 18,
    }).addTo(map);

    // Add guide location markers
    const guides = [
      { lat: 27.9881, lng: 86.925, name: "Pemba Sherpa", region: "Everest" },
      { lat: 28.2096, lng: 83.9856, name: "Maya Gurung", region: "Annapurna" },
      { lat: 28.238, lng: 85.4438, name: "Rajesh Tamang", region: "Langtang" },
      { lat: 29.1492, lng: 82.814, name: "Karma Lama", region: "Dolpo" },
      { lat: 27.0, lng: 87.0, name: "Sita Rai", region: "Eastern Hills" },
      { lat: 28.0, lng: 84.5, name: "Binod Thapa", region: "Multiple Regions" },
    ];

    guides.forEach((guide) => {
      L.marker([guide.lat, guide.lng])
        .addTo(map)
        .bindPopup(`<strong>${guide.name}</strong><br>${guide.region} Region`);
    });
  }

  // ===== VIEW TOGGLE (GRID/LIST) =====
  const gridViewBtn = document.getElementById("gridViewBtn");
  const listViewBtn = document.getElementById("listViewBtn");
  const guidesGrid = document.getElementById("guidesGrid");

  if (gridViewBtn && listViewBtn && guidesGrid) {
    gridViewBtn.addEventListener("click", function () {
      guidesGrid.style.display = "grid";
      gridViewBtn.classList.add("active");
      listViewBtn.classList.remove("active");
    });

    listViewBtn.addEventListener("click", function () {
      guidesGrid.style.display = "flex";
      guidesGrid.style.flexDirection = "column";
      listViewBtn.classList.add("active");
      gridViewBtn.classList.remove("active");
    });
  }

  // ===== QUICK FILTERS =====
  const filterButtons = document.querySelectorAll(".filter-btn");

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      // Add active class to clicked button
      this.classList.add("active");

      // Log the filter (in real app, this would filter guides)
      console.log("Filter applied:", this.textContent);
    });
  });

  // ===== SEARCH FUNCTIONALITY =====
  const searchInput = document.getElementById("searchInput");

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase();
      console.log("Searching for:", searchTerm);
      // In real app, this would filter the guide cards
    });
  }

  // ===== FILTER CHECKBOXES =====
  const filterCheckboxes = document.querySelectorAll(
    '.filter-group input[type="checkbox"]'
  );

  filterCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      const filterText = this.nextElementSibling.textContent;
      console.log("Filter changed:", filterText, "Checked:", this.checked);
      // In real app, this would filter guides
    });
  });

  // ===== PRICE RANGE SLIDER =====
  const priceRange = document.getElementById("priceRange");

  if (priceRange) {
    priceRange.addEventListener("input", function () {
      console.log("Price range:", this.value);
      // In real app, this would filter guides by price
    });
  }

  // ===== CLEAR FILTERS =====
  const clearFiltersBtn = document.getElementById("clearFilters");

  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener("click", function () {
      // Uncheck all checkboxes
      filterCheckboxes.forEach((checkbox) => {
        checkbox.checked = false;
      });

      // Reset price range
      if (priceRange) {
        priceRange.value = 100;
      }

      // Reset quick filters
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      if (filterButtons.length > 0) {
        filterButtons[0].classList.add("active");
      }

      // Clear search
      if (searchInput) {
        searchInput.value = "";
      }

      console.log("All filters cleared");
    });
  }

  // ===== FAVORITE BUTTONS =====
  const favoriteButtons = document.querySelectorAll(".favorite-btn");

  favoriteButtons.forEach((button) => {
    button.addEventListener("click", function () {
      this.classList.toggle("active");
      console.log("Favorite toggled");
    });
  });

  // ===== COMPARISON MODAL =====
  const comparisonModal = document.getElementById("comparisonModal");
  const modalClose = document.getElementById("modalClose");
  const compareButtons = document.querySelectorAll(".compare-btn");

  compareButtons.forEach((button) => {
    button.addEventListener("click", function () {
      comparisonModal.classList.add("active");
    });
  });

  if (modalClose) {
    modalClose.addEventListener("click", function () {
      comparisonModal.classList.remove("active");
    });
  }

  // Close modal when clicking outside
  if (comparisonModal) {
    comparisonModal.addEventListener("click", function (e) {
      if (e.target === comparisonModal) {
        comparisonModal.classList.remove("active");
      }
    });
  }

  // ===== SORT SELECT =====
  const sortSelect = document.querySelector(".sort-select");

  if (sortSelect) {
    sortSelect.addEventListener("change", function () {
      console.log("Sort by:", this.value);
      // In real app, this would sort the guides
    });
  }

  // ===== PAGINATION =====
  const pageButtons = document.querySelectorAll(".page-btn");

  pageButtons.forEach((button) => {
    button.addEventListener("click", function () {
      if (!this.disabled && !this.textContent.includes("...")) {
        // Remove active from all
        pageButtons.forEach((btn) => btn.classList.remove("active"));
        // Add active to clicked
        this.classList.add("active");

        console.log("Page changed to:", this.textContent);
        // In real app, this would load different page

        // Scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  });

  // ===== GUIDE REGISTRATION MODAL =====
  const registerGuideBtn = document.getElementById("registerGuideBtn");
  const registerModal = document.getElementById("registerGuideModal");
  const registerModalClose = document.getElementById("registerModalClose");
  const cancelRegisterBtn = document.getElementById("cancelRegisterBtn");
  const guideRegistrationForm = document.getElementById(
    "guideRegistrationForm"
  );

  // Open registration modal
  if (registerGuideBtn) {
    registerGuideBtn.addEventListener("click", function () {
      registerModal.classList.add("active");
    });
  }

  // Close registration modal
  if (registerModalClose) {
    registerModalClose.addEventListener("click", function () {
      registerModal.classList.remove("active");
    });
  }

  // Cancel registration
  if (cancelRegisterBtn) {
    cancelRegisterBtn.addEventListener("click", function () {
      registerModal.classList.remove("active");
    });
  }

  // Close modal when clicking outside
  if (registerModal) {
    registerModal.addEventListener("click", function (e) {
      if (e.target === registerModal) {
        registerModal.classList.remove("active");
      }
    });
  }

  // Handle form submission
  if (guideRegistrationForm) {
    guideRegistrationForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form data
      const guideData = {
        name: document.getElementById("guideName").value,
        email: document.getElementById("guideEmail").value,
        phone: document.getElementById("guidePhone").value,
        location: document.getElementById("guideLocation").value,
        experience: document.getElementById("guideExperience").value,
        expertise: document.getElementById("guideExpertise").value,
        languages: document.getElementById("guideLanguages").value,
        rate: document.getElementById("guideRate").value,
        bio: document.getElementById("guideBio").value,
      };

      // Add to registered guides array
      registeredGuides.push(guideData);

      // Add guide to the display
      addGuideToDisplay(guideData);

      // In a real application, this would send data to a server
      console.log("Guide registration data:", guideData);

      // Show success message
      alert(
        "Thank you for registering as a guide! Your information has been submitted successfully."
      );

      // Reset form and close modal
      guideRegistrationForm.reset();
      registerModal.classList.remove("active");
    });
  }

  // Function to add a new guide to the display
  function addGuideToDisplay(guide) {
    const guidesGrid = document.getElementById("guidesGrid");

    if (guidesGrid) {
      // Create a new guide card
      const guideCard = document.createElement("article");
      guideCard.className = "guide-card";

      // Format expertise as tags
      const expertiseArray = guide.expertise
        .split(",")
        .map((item) => item.trim());
      const expertiseTags = expertiseArray
        .map((exp) => `<span class="tag">${exp}</span>`)
        .join("");

      // Format languages
      const languagesArray = guide.languages
        .split(",")
        .map((item) => item.trim());
      const languagesText = languagesArray.join(", ");

      guideCard.innerHTML = `
                <div class="guide-image">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop" alt="${
                      guide.name
                    }">
                    <div class="guide-badges">
                        <span class="badge available">Available</span>
                        <span class="badge verified">Verified</span>
                    </div>
                    <button class="favorite-btn">❤</button>
                </div>
                <div class="guide-info">
                    <div class="guide-header">
                        <div>
                            <h3>${guide.name}</h3>
                            <p class="guide-region">${guide.location} • ${
        guide.experience
      } years</p>
                        </div>
                        <div class="rating">
                            <span class="star">⭐</span>
                            <span>0.0</span>
                            <span class="reviews">(0)</span>
                        </div>
                    </div>
                    <div class="tags">
                        ${expertiseTags}
                    </div>
                    <p class="guide-description">${guide.bio.substring(
                      0,
                      100
                    )}${guide.bio.length > 100 ? "..." : ""}</p>
                    <div class="guide-meta">
                        <span>🕐 Responds in 24h</span>
                        <span>💬 ${languagesText}</span>
                    </div>
                    <div class="guide-footer">
                        <div class="price">
                            <strong>$${guide.rate}</strong>
                            <span>/day</span>
                        </div>
                        <div class="actions">
                            <button class="btn-secondary compare-btn">Compare</button>
                            <a href="#" class="btn-primary">View Profile</a>
                        </div>
                    </div>
                </div>
            `;

      // Add the new guide card to the beginning of the grid
      guidesGrid.insertBefore(guideCard, guidesGrid.firstChild);

      // Add event listener to the new favorite button
      const newFavoriteBtn = guideCard.querySelector(".favorite-btn");
      if (newFavoriteBtn) {
        newFavoriteBtn.addEventListener("click", function () {
          this.classList.toggle("active");
        });
      }

      // Add event listener to the new compare button
      const newCompareBtn = guideCard.querySelector(".compare-btn");
      if (newCompareBtn) {
        const comparisonModal = document.getElementById("comparisonModal");
        newCompareBtn.addEventListener("click", function () {
          if (comparisonModal) {
            comparisonModal.classList.add("active");
          }
        });
      }
    }
  }

  console.log("Guide Marketplace loaded successfully!");
});
