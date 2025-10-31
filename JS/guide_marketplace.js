// Guide Marketplace JavaScript
document.addEventListener('DOMContentLoaded', function() {

    // ===== MOBILE MENU =====
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }

    // ===== LEAFLET MAP INITIALIZATION =====
    if (document.getElementById('map')) {
        const map = L.map('map').setView([28.3949, 84.1240], 7);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18
        }).addTo(map);

        // Add guide location markers
        const guides = [
            {lat: 27.9881, lng: 86.9250, name: 'Pemba Sherpa', region: 'Everest'},
            {lat: 28.2096, lng: 83.9856, name: 'Maya Gurung', region: 'Annapurna'},
            {lat: 28.2380, lng: 85.4438, name: 'Rajesh Tamang', region: 'Langtang'},
            {lat: 29.1492, lng: 82.8140, name: 'Karma Lama', region: 'Dolpo'},
            {lat: 27.0, lng: 87.0, name: 'Sita Rai', region: 'Eastern Hills'},
            {lat: 28.0, lng: 84.5, name: 'Binod Thapa', region: 'Multiple Regions'}
        ];

        guides.forEach(guide => {
            L.marker([guide.lat, guide.lng])
                .addTo(map)
                .bindPopup(`<strong>${guide.name}</strong><br>${guide.region} Region`);
        });
    }

    // ===== VIEW TOGGLE (GRID/LIST) =====
    const gridViewBtn = document.getElementById('gridViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');
    const guidesGrid = document.getElementById('guidesGrid');

    if (gridViewBtn && listViewBtn && guidesGrid) {
        gridViewBtn.addEventListener('click', function() {
            guidesGrid.style.display = 'grid';
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
        });

        listViewBtn.addEventListener('click', function() {
            guidesGrid.style.display = 'flex';
            guidesGrid.style.flexDirection = 'column';
            listViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
        });
    }

    // ===== QUICK FILTERS =====
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            // Log the filter (in real app, this would filter guides)
            console.log('Filter applied:', this.textContent);
        });
    });

    // ===== SEARCH FUNCTIONALITY =====
    const searchInput = document.getElementById('searchInput');

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            console.log('Searching for:', searchTerm);
            // In real app, this would filter the guide cards
        });
    }

    // ===== FILTER CHECKBOXES =====
    const filterCheckboxes = document.querySelectorAll('.filter-group input[type="checkbox"]');

    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const filterText = this.nextElementSibling.textContent;
            console.log('Filter changed:', filterText, 'Checked:', this.checked);
            // In real app, this would filter guides
        });
    });

    // ===== PRICE RANGE SLIDER =====
    const priceRange = document.getElementById('priceRange');

    if (priceRange) {
        priceRange.addEventListener('input', function() {
            console.log('Price range:', this.value);
            // In real app, this would filter guides by price
        });
    }

    // ===== CLEAR FILTERS =====
    const clearFiltersBtn = document.getElementById('clearFilters');

    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            // Uncheck all checkboxes
            filterCheckboxes.forEach(checkbox => {
                checkbox.checked = false;
            });

            // Reset price range
            if (priceRange) {
                priceRange.value = 100;
            }

            // Reset quick filters
            filterButtons.forEach(btn => btn.classList.remove('active'));
            if (filterButtons.length > 0) {
                filterButtons[0].classList.add('active');
            }

            // Clear search
            if (searchInput) {
                searchInput.value = '';
            }

            console.log('All filters cleared');
        });
    }

    // ===== FAVORITE BUTTONS =====
    const favoriteButtons = document.querySelectorAll('.favorite-btn');

    favoriteButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.classList.toggle('active');
            console.log('Favorite toggled');
        });
    });

    // ===== COMPARISON MODAL =====
    const comparisonModal = document.getElementById('comparisonModal');
    const modalClose = document.getElementById('modalClose');
    const compareButtons = document.querySelectorAll('.compare-btn');

    compareButtons.forEach(button => {
        button.addEventListener('click', function() {
            comparisonModal.classList.add('active');
        });
    });

    if (modalClose) {
        modalClose.addEventListener('click', function() {
            comparisonModal.classList.remove('active');
        });
    }

    // Close modal when clicking outside
    if (comparisonModal) {
        comparisonModal.addEventListener('click', function(e) {
            if (e.target === comparisonModal) {
                comparisonModal.classList.remove('active');
            }
        });
    }

    // ===== SORT SELECT =====
    const sortSelect = document.querySelector('.sort-select');

    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            console.log('Sort by:', this.value);
            // In real app, this would sort the guides
        });
    }

    // ===== PAGINATION =====
    const pageButtons = document.querySelectorAll('.page-btn');

    pageButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (!this.disabled && !this.textContent.includes('...')) {
                // Remove active from all
                pageButtons.forEach(btn => btn.classList.remove('active'));
                // Add active to clicked
                this.classList.add('active');

                console.log('Page changed to:', this.textContent);
                // In real app, this would load different page

                // Scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });

    console.log('Guide Marketplace loaded successfully!');
});
