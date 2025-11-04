// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Global variables
let stories = [];
let currentUser = 'TravelExplorer'; // Simulated user
let selectedImages = [];

// Initialize application
function initializeApp() {
    // Hide preloader
    setTimeout(() => {
        document.querySelector('.preloader').style.opacity = '0';
        setTimeout(() => {
            document.querySelector('.preloader').style.display = 'none';
        }, 500);
    }, 1000);

    // Initialize navigation
    initializeNavigation();

    // Load stories from localStorage or use sample data
    loadStoriesFromStorage();

    // Initialize event listeners
    initializeEventListeners();

    // Display initial stories
    displayStories('all');
}

// Modern Mobile Navigation
function initializeNavigation() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const body = document.body;

    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
            body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close mobile menu when clicking on a link
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                body.style.overflow = '';
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenu.contains(event.target) &&
                !mobileMenuToggle.contains(event.target) &&
                mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                body.style.overflow = '';
            }
        });
    }
}

// Event Listeners
function initializeEventListeners() {
    // Create Story Button
    const createStoryBtn = document.querySelector('.create-story-btn');
    createStoryBtn?.addEventListener('click', openCreateStoryModal);

    // Modal Close Buttons
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', closeModals);
    });

    // Cancel Button
    const cancelBtn = document.querySelector('.cancel-btn');
    cancelBtn?.addEventListener('click', closeModals);

    // Create Story Form
    const createStoryForm = document.getElementById('createStoryForm');
    createStoryForm?.addEventListener('submit', handleCreateStory);

    // Image Upload
    const imageUploadArea = document.getElementById('imageUploadArea');
    const imageInput = document.getElementById('storyImages');

    imageUploadArea?.addEventListener('click', (e) => {
        if (!e.target.closest('.remove-image')) {
            imageInput.click();
        }
    });

    imageInput?.addEventListener('change', handleImageSelection);

    // Filter Tabs
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const filter = tab.dataset.filter;
            displayStories(filter);
        });
    });

    // Close modal on outside click
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModals();
            }
        });
    });
}

// Open Create Story Modal
function openCreateStoryModal() {
    const modal = document.getElementById('createStoryModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close All Modals
function closeModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = 'auto';

    // Reset form and images
    const form = document.getElementById('createStoryForm');
    form?.reset();
    selectedImages = [];
    updateImagePreview();
}

// Handle Image Selection
function handleImageSelection(e) {
    const files = Array.from(e.target.files);

    files.forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                selectedImages.push({
                    file: file,
                    dataUrl: event.target.result
                });
                updateImagePreview();
            };
            reader.readAsDataURL(file);
        }
    });

    // Reset input to allow selecting same files again
    e.target.value = '';
}

// Update Image Preview
function updateImagePreview() {
    const container = document.getElementById('imagePreviewContainer');
    const placeholder = document.querySelector('.upload-placeholder');

    if (selectedImages.length > 0) {
        placeholder.style.display = 'none';
        container.innerHTML = selectedImages.map((img, index) => `
            <div class="image-preview">
                <img src="${img.dataUrl}" alt="Preview ${index + 1}">
                <button type="button" class="remove-image" onclick="removeImage(${index})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    } else {
        placeholder.style.display = 'block';
        container.innerHTML = '';
    }
}

// Remove Image
function removeImage(index) {
    selectedImages.splice(index, 1);
    updateImagePreview();
}

// Handle Create Story Submission
function handleCreateStory(e) {
    e.preventDefault();

    const title = document.getElementById('storyTitle').value.trim();
    const location = document.getElementById('storyLocation').value.trim();
    const content = document.getElementById('storyContent').value.trim();
    const tagsInput = document.getElementById('storyTags').value.trim();
    const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()) : [];

    if (!title || !location || !content) {
        alert('Please fill in all required fields!');
        return;
    }

    const newStory = {
        id: Date.now(),
        author: currentUser,
        title: title,
        location: location,
        content: content,
        tags: tags,
        images: selectedImages.map(img => img.dataUrl),
        likes: 0,
        comments: [],
        timestamp: new Date().toISOString(),
        liked: false
    };

    stories.unshift(newStory);
    saveStoriesToStorage();
    displayStories('all');
    closeModals();

    // Show success message
    showNotification('Story published successfully!');
}

// Display Stories
function displayStories(filter) {
    const grid = document.getElementById('storiesGrid');
    let filteredStories = [...stories];

    // Apply filters
    switch(filter) {
        case 'trending':
            filteredStories = filteredStories.sort((a, b) => b.likes - a.likes);
            break;
        case 'recent':
            filteredStories = filteredStories.sort((a, b) =>
                new Date(b.timestamp) - new Date(a.timestamp)
            );
            break;
        case 'my-stories':
            filteredStories = filteredStories.filter(story => story.author === currentUser);
            break;
    }

    if (filteredStories.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i class="fas fa-compass"></i>
                <h3>No stories yet</h3>
                <p>Be the first to share your travel experience!</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = filteredStories.map(story => createStoryCard(story)).join('');

    // Add click handlers to story cards
    document.querySelectorAll('.story-card').forEach((card, index) => {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.action-btn')) {
                openStoryDetail(filteredStories[index].id);
            }
        });
    });
}

// Create Story Card HTML
function createStoryCard(story) {
    const timeAgo = getTimeAgo(story.timestamp);
    const authorInitials = story.author.substring(0, 2).toUpperCase();
    const mainImage = story.images.length > 0 ? story.images[0] :
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800';

    return `
        <div class="story-card" data-id="${story.id}">
            <img src="${mainImage}" alt="${story.title}" class="story-image">
            <div class="story-card-content">
                <div class="story-header">
                    <div class="author-avatar">${authorInitials}</div>
                    <div class="story-meta">
                        <div class="author-name">${story.author}</div>
                        <div class="story-location">
                            <i class="fas fa-map-marker-alt"></i>
                            ${story.location}
                        </div>
                        <div class="story-time">${timeAgo}</div>
                    </div>
                </div>
                <h3 class="story-title">${story.title}</h3>
                <p class="story-excerpt">${story.content.substring(0, 150)}${story.content.length > 150 ? '...' : ''}</p>
                ${story.tags.length > 0 ? `
                    <div class="story-tags">
                        ${story.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                    </div>
                ` : ''}
                <div class="story-actions">
                    <button class="action-btn ${story.liked ? 'liked' : ''}" onclick="event.stopPropagation(); toggleLike(${story.id})">
                        <i class="fas fa-heart"></i>
                        <span>${story.likes}</span>
                    </button>
                    <button class="action-btn" onclick="event.stopPropagation(); openStoryDetail(${story.id})">
                        <i class="fas fa-comment"></i>
                        <span>${story.comments.length}</span>
                    </button>
                    <button class="action-btn" onclick="event.stopPropagation(); shareStory(${story.id})">
                        <i class="fas fa-share"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Open Story Detail Modal
function openStoryDetail(storyId) {
    const story = stories.find(s => s.id === storyId);
    if (!story) return;

    const modal = document.getElementById('viewStoryModal');
    const content = document.getElementById('storyDetailContent');

    const authorInitials = story.author.substring(0, 2).toUpperCase();
    const timeAgo = getTimeAgo(story.timestamp);

    const imagesHTML = story.images.length > 0 ? `
        <div class="story-detail-images">
            ${story.images.length === 1 ? `
                <img src="${story.images[0]}" alt="${story.title}">
            ` : `
                <div class="image-gallery">
                    ${story.images.map(img => `<img src="${img}" alt="${story.title}">`).join('')}
                </div>
            `}
        </div>
    ` : '';

    content.innerHTML = `
        <div class="story-detail-header">
            <h2 class="story-detail-title">${story.title}</h2>
            <div class="story-detail-meta">
                <div class="story-detail-author">
                    <div class="author-avatar">${authorInitials}</div>
                    <div>
                        <div class="author-name">${story.author}</div>
                        <div class="story-location">
                            <i class="fas fa-map-marker-alt"></i> ${story.location}
                        </div>
                        <div class="story-time">${timeAgo}</div>
                    </div>
                </div>
            </div>
        </div>

        ${imagesHTML}

        <div class="story-detail-content">
            <p class="story-detail-text">${story.content}</p>
            ${story.tags.length > 0 ? `
                <div class="story-tags">
                    ${story.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                </div>
            ` : ''}
        </div>

        <div class="story-detail-actions">
            <button class="action-btn ${story.liked ? 'liked' : ''}" onclick="toggleLike(${story.id})">
                <i class="fas fa-heart"></i>
                <span>${story.likes} Likes</span>
            </button>
            <button class="action-btn">
                <i class="fas fa-comment"></i>
                <span>${story.comments.length} Comments</span>
            </button>
            <button class="action-btn" onclick="shareStory(${story.id})">
                <i class="fas fa-share"></i>
                <span>Share</span>
            </button>
        </div>

        <div class="comments-section">
            <h3 class="comments-header">Comments</h3>
            <div class="comment-input">
                <input type="text" placeholder="Add a comment..." id="commentInput-${story.id}">
                <button class="btn primary-btn" onclick="addComment(${story.id})">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
            <div class="comments-list" id="commentsList-${story.id}">
                ${story.comments.map(comment => createCommentHTML(comment)).join('')}
                ${story.comments.length === 0 ? '<p style="text-align: center; color: #999;">No comments yet. Be the first to comment!</p>' : ''}
            </div>
        </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Create Comment HTML
function createCommentHTML(comment) {
    const initials = comment.author.substring(0, 2).toUpperCase();
    const timeAgo = getTimeAgo(comment.timestamp);

    return `
        <div class="comment">
            <div class="comment-avatar">${initials}</div>
            <div class="comment-content">
                <div class="comment-author">${comment.author}</div>
                <div class="comment-text">${comment.text}</div>
                <div class="comment-time">${timeAgo}</div>
            </div>
        </div>
    `;
}

// Add Comment
function addComment(storyId) {
    const input = document.getElementById(`commentInput-${storyId}`);
    const text = input.value.trim();

    if (!text) return;

    const story = stories.find(s => s.id === storyId);
    if (!story) return;

    const comment = {
        author: currentUser,
        text: text,
        timestamp: new Date().toISOString()
    };

    story.comments.push(comment);
    saveStoriesToStorage();

    // Update comments list
    const commentsList = document.getElementById(`commentsList-${storyId}`);
    commentsList.innerHTML = story.comments.map(c => createCommentHTML(c)).join('');

    // Update comment count in actions
    const actionBtns = document.querySelectorAll('.story-detail-actions .action-btn');
    actionBtns[1].querySelector('span').textContent = `${story.comments.length} Comments`;

    // Clear input
    input.value = '';

    // Update display
    displayStories(document.querySelector('.filter-tab.active').dataset.filter);
}

// Toggle Like
function toggleLike(storyId) {
    const story = stories.find(s => s.id === storyId);
    if (!story) return;

    story.liked = !story.liked;
    story.likes += story.liked ? 1 : -1;

    saveStoriesToStorage();
    displayStories(document.querySelector('.filter-tab.active').dataset.filter);

    // Update modal if open
    const modal = document.getElementById('viewStoryModal');
    if (modal.classList.contains('active')) {
        const likeBtn = document.querySelector('.story-detail-actions .action-btn');
        likeBtn.classList.toggle('liked', story.liked);
        likeBtn.querySelector('span').textContent = `${story.likes} Likes`;
    }
}

// Share Story
function shareStory(storyId) {
    const story = stories.find(s => s.id === storyId);
    if (!story) return;

    if (navigator.share) {
        navigator.share({
            title: story.title,
            text: story.content.substring(0, 100) + '...',
            url: window.location.href
        }).catch(() => {});
    } else {
        // Fallback: copy link
        const dummy = document.createElement('input');
        document.body.appendChild(dummy);
        dummy.value = window.location.href;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
        showNotification('Link copied to clipboard!');
    }
}

// Get Time Ago
function getTimeAgo(timestamp) {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return past.toLocaleDateString();
}

// Show Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Storage Functions
function saveStoriesToStorage() {
    try {
        localStorage.setItem('travelStories', JSON.stringify(stories));
    } catch (e) {
        console.error('Failed to save stories:', e);
    }
}

function loadStoriesFromStorage() {
    try {
        const stored = localStorage.getItem('travelStories');
        if (stored) {
            stories = JSON.parse(stored);
        } else {
            // Load sample stories if none exist
            stories = getSampleStories();
            saveStoriesToStorage();
        }
    } catch (e) {
        console.error('Failed to load stories:', e);
        stories = getSampleStories();
    }
}

// Sample Stories
function getSampleStories() {
    return [
        {
            id: 1,
            author: 'Priya Sharma',
            title: 'Sunrise at Poon Hill - A Magical Experience',
            location: 'Poon Hill, Annapurna',
            content: 'The trek to Poon Hill was one of the most rewarding experiences of my life. Waking up at 4 AM, we hiked through the rhododendron forest under the starlit sky. As we reached the summit, the first rays of sun painted the Annapurna and Dhaulagiri ranges in gold. The panoramic view of the Himalayas stretching across the horizon left me speechless. The cold mountain air, the warmth of tea, and the company of fellow trekkers made this moment unforgettable.',
            tags: ['trekking', 'mountains', 'sunrise', 'annapurna'],
            images: ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800'],
            likes: 124,
            comments: [
                {
                    author: 'Rajesh Kumar',
                    text: 'Amazing! I visited last year and it was breathtaking!',
                    timestamp: new Date(Date.now() - 86400000).toISOString()
                }
            ],
            timestamp: new Date(Date.now() - 172800000).toISOString(),
            liked: false
        },
        {
            id: 2,
            author: 'John Anderson',
            title: 'Lost in the Streets of Bhaktapur',
            location: 'Bhaktapur Durbar Square',
            content: 'Bhaktapur is a living museum. Walking through the ancient streets felt like traveling back in time. The intricate wood carvings on the temples, the pottery square with artisans at work, and the taste of fresh juju dhau (king curd) made my day perfect. I spent hours just wandering around, capturing the essence of this medieval city. The locals were incredibly warm and welcoming.',
            tags: ['culture', 'heritage', 'photography', 'bhaktapur'],
            images: ['https://images.unsplash.com/photo-1605649461784-edc01e5d6e1b?q=80&w=800'],
            likes: 89,
            comments: [],
            timestamp: new Date(Date.now() - 259200000).toISOString(),
            liked: false
        },
        {
            id: 3,
            author: 'Sita Rai',
            title: 'Paragliding Over Pokhara Valley',
            location: 'Pokhara, Sarangkot',
            content: 'Flying like a bird over the Pokhara valley with views of Phewa Lake and the Annapurna range was absolutely thrilling! The takeoff from Sarangkot was smooth, and soon I was soaring high above the city. The 30-minute flight felt like a dream. My pilot was experienced and even let me control the paraglider for a bit. This is a must-do adventure for anyone visiting Nepal!',
            tags: ['adventure', 'paragliding', 'pokhara', 'thrilling'],
            images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800'],
            likes: 156,
            comments: [
                {
                    author: 'Mike Chen',
                    text: 'This looks incredible! Adding to my bucket list!',
                    timestamp: new Date(Date.now() - 43200000).toISOString()
                },
                {
                    author: 'Sarah Williams',
                    text: 'I did this last month! Best experience ever!',
                    timestamp: new Date(Date.now() - 21600000).toISOString()
                }
            ],
            timestamp: new Date(Date.now() - 345600000).toISOString(),
            liked: false
        },
        {
            id: 4,
            author: 'David Thompson',
            title: 'Village Life in Bandipur',
            location: 'Bandipur Village',
            content: 'Bandipur is a hidden gem perched on a hilltop with stunning mountain views. This preserved Newari town offers a glimpse into traditional village life. I stayed in a homestay where the family treated me like their own. We cooked traditional meals together, I helped in their fields, and learned about their daily routines. The simplicity and warmth of village life was humbling and beautiful.',
            tags: ['village', 'culture', 'homestay', 'authentic'],
            images: ['https://images.unsplash.com/photo-1609137144813-7d9921338f24?q=80&w=800'],
            likes: 67,
            comments: [],
            timestamp: new Date(Date.now() - 432000000).toISOString(),
            liked: false
        }
    ];
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
