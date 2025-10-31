// Initialize map
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Leaflet map
    const map = L.map('map').setView([28.3949, 84.1240], 7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add sample guide markers
    const guides = [
        {lat: 27.9881, lng: 86.9250, name: 'Pemba Sherpa', region: 'Everest'},
        {lat: 28.2096, lng: 83.9856, name: 'Maya Gurung', region: 'Annapurna'},
        {lat: 28.2380, lng: 85.4438, name: 'Rajesh Tamang', region: 'Langtang'},
        {lat: 29.1492, lng: 82.8140, name: 'Karma Lama', region: 'Dolpo'}
    ];

    guides.forEach(guide => {
        L.marker([guide.lat, guide.lng])
            .addTo(map)
            .bindPopup(`<strong>${guide.name}</strong><br>${guide.region} Region`);
    });

    // View toggle functionality
    const gridViewBtn = document.getElementById('gridView');
    const listViewBtn = document.getElementById('listView');
    const guideGrid = document.getElementById('guideGrid');

    gridViewBtn.addEventListener('click', function() {
        guideGrid.className = 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6';
        gridViewBtn.classList.add('bg-white', 'shadow-sm', 'text-text-primary');
        gridViewBtn.classList.remove('text-text-secondary');
        listViewBtn.classList.remove('bg-white', 'shadow-sm', 'text-text-primary');
        listViewBtn.classList.add('text-text-secondary');
    });

    listViewBtn.addEventListener('click', function() {
        guideGrid.className = 'space-y-6';
        listViewBtn.classList.add('bg-white', 'shadow-sm', 'text-text-primary');
        listViewBtn.classList.remove('text-text-secondary');
        gridViewBtn.classList.remove('bg-white', 'shadow-sm', 'text-text-primary');
        gridViewBtn.classList.add('text-text-secondary');
    });

    // Comparison modal functionality
    const comparisonModal = document.getElementById('comparisonModal');
    const closeComparison = document.getElementById('closeComparison');
    const compareButtons = document.querySelectorAll('button:contains("Compare")');

    closeComparison.addEventListener('click', function() {
        comparisonModal.classList.add('hidden');
    });

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function() {
        // Implement search logic here
        console.log('Searching for:', this.value);
    });

    // Filter functionality
    const filterCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Implement filter logic here
            console.log('Filter changed:', this.nextElementSibling.textContent);
        });
    });

    // Quick filter buttons
    const quickFilters = document.querySelectorAll('button[class*="bg-primary-100"], button[class*="bg-gray-100"]');
    quickFilters.forEach(button => {
        button.addEventListener('click', function() {
            // Toggle active state
            quickFilters.forEach(btn => {
                btn.classList.remove('bg-primary-100', 'text-primary');
                btn.classList.add('bg-gray-100', 'text-text-secondary');
            });
            this.classList.remove('bg-gray-100', 'text-text-secondary');
            this.classList.add('bg-primary-100', 'text-primary');
        });
    });
});
