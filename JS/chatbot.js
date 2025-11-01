// DOM Elements
const chatMessages = document.getElementById("chatMessages");
const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");
const resultsSection = document.getElementById("resultsSection");
const guidesContainer = document.getElementById("guidesContainer");
const eventsContainer = document.getElementById("eventsContainer");
const activitiesContainer = document.getElementById("activitiesContainer");
const placeName = document.getElementById("placeName");
const placeDescription = document.getElementById("placeDescription");
const matchExplanation = document.getElementById("matchExplanation");

// Navigation buttons
const navButtons = document.querySelectorAll(".nav-btn");

// Event Listeners
sendButton.addEventListener("click", handleUserMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleUserMessage();
});

// Suggestion buttons
document.querySelectorAll(".suggestion-btn").forEach((button, index) => {
  button.addEventListener("click", () => {
    userInput.value = button.textContent.trim();
    handleUserMessage();
  });

  // Add a subtle animation delay for each button
  button.style.animationDelay = `${index * 0.1}s`;
});

// Quick action buttons
document.getElementById("findGuidesBtn").addEventListener("click", () => {
  userInput.value = "Find local guides in Nepal";
  handleUserMessage();
});

document.getElementById("exploreEventsBtn").addEventListener("click", () => {
  userInput.value = "What cultural events are happening in Nepal?";
  handleUserMessage();
});

document
  .getElementById("suggestActivitiesBtn")
  .addEventListener("click", () => {
    userInput.value = "Suggest activities for a cultural tour in Nepal";
    handleUserMessage();
  });

// Navigation button event listeners
navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Remove active class from all buttons
    navButtons.forEach((btn) => btn.classList.remove("active"));
    // Add active class to clicked button
    button.classList.add("active");

    // Get the tab type
    const tabType = button.getAttribute("data-tab");

    // Handle tab switching logic here if needed
    switch (tabType) {
      case "events":
        // Show only events section
        break;
      case "activities":
        // Show only activities section
        break;
      case "place-info":
        // Show only place info section
        break;
      case "all":
        // Show all sections
        break;
    }
  });
});

// Add hover effects to all action buttons
document.querySelectorAll(".action-btn, .suggestion-btn").forEach((button) => {
  button.addEventListener("mouseenter", () => {
    button.style.transform = "translateY(-3px)";
  });

  button.addEventListener("mouseleave", () => {
    button.style.transform = "translateY(0)";
  });
});

// Function to handle user messages
function handleUserMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  // Add user message to chat
  addMessageToChat(message, "user");

  // Clear input
  userInput.value = "";

  // Show typing indicator
  showTypingIndicator();

  // Process the message (simulate API call)
  setTimeout(() => {
    processUserMessage(message);
  }, 1000);
}

// Function to add message to chat
function addMessageToChat(content, sender) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message");
  messageDiv.classList.add(sender + "-message");

  messageDiv.innerHTML = `
    <div class="message-content">
      <p>${content}</p>
    </div>
  `;

  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to show typing indicator
function showTypingIndicator() {
  // Remove any existing typing indicator
  const existingIndicator = document.getElementById("typingIndicator");
  if (existingIndicator) {
    existingIndicator.remove();
  }

  const typingDiv = document.createElement("div");
  typingDiv.classList.add("message", "bot-message");
  typingDiv.id = "typingIndicator";

  typingDiv.innerHTML = `
    <div class="message-content">
      <p><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></p>
    </div>
  `;

  chatMessages.appendChild(typingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to hide typing indicator
function hideTypingIndicator() {
  const typingIndicator = document.getElementById("typingIndicator");
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

// Function to process user message
function processUserMessage(message) {
  // Hide typing indicator
  hideTypingIndicator();

  // For demo purposes, we'll simulate different responses based on keywords
  let response =
    "I can help you discover amazing places in Nepal, find local guides, and provide information about cultural events and activities. What specifically would you like to know?";

  // Show results section
  resultsSection.classList.remove("hidden");

  // Update results based on message content
  if (
    message.toLowerCase().includes("guide") ||
    message.toLowerCase().includes("guides")
  ) {
    response =
      "I found some excellent local guides for you. You can connect with verified experts who know Nepal's hidden gems.";
    updateGuidesSection();
  } else if (
    message.toLowerCase().includes("event") ||
    message.toLowerCase().includes("festival")
  ) {
    response =
      "Here are some exciting cultural events happening in Nepal right now.";
    updateEventsSection();
  } else if (
    message.toLowerCase().includes("activity") ||
    message.toLowerCase().includes("activities")
  ) {
    response = "I've found some unique activities that match your interests.";
    updateActivitiesSection();
  } else if (
    message.toLowerCase().includes("place") ||
    message.toLowerCase().includes("location")
  ) {
    response =
      "I've discovered a perfect place for you based on your interests.";
    updatePlaceSection();
  } else {
    // Default response with all sections
    updatePlaceSection();
    updateGuidesSection();
    updateEventsSection();
    updateActivitiesSection();
  }

  // Add bot response to chat
  addMessageToChat(response, "bot");
}

// Function to update place section
function updatePlaceSection() {
  placeName.textContent = "Ghandruk, Annapurna Region";
  placeDescription.textContent =
    "A beautiful Gurung village in the Annapurna Conservation Area, known for its stunning mountain views, traditional architecture, and rich cultural heritage. The village offers excellent trekking opportunities and authentic experiences with the local Gurung community.";
  matchExplanation.textContent =
    "This location matches your interest in cultural experiences and trekking with spectacular mountain views.";
}

// Function to update guides section
function updateGuidesSection() {
  guidesContainer.innerHTML = `
    <div class="guide-item">
      <h4>Bikash Gurung</h4>
      <p class="guide-detail"><i class="fas fa-star"></i> 4.9 (127 reviews)</p>
      <p class="guide-detail"><i class="fas fa-map-marker-alt"></i> Ghandruk, Annapurna Region</p>
      <p class="guide-detail"><i class="fas fa-comment"></i> English, Nepali</p>
      <p class="guide-price">$65/day</p>
      <button class="btn">View Profile</button>
    </div>
    <div class="guide-item">
      <h4>Maya Thapa</h4>
      <p class="guide-detail"><i class="fas fa-star"></i> 4.8 (89 reviews)</p>
      <p class="guide-detail"><i class="fas fa-map-marker-alt"></i> Ghandruk, Annapurna Region</p>
      <p class="guide-detail"><i class="fas fa-comment"></i> English, German</p>
      <p class="guide-price">$55/day</p>
      <button class="btn">View Profile</button>
    </div>
    <div class="guide-item">
      <h4>Rajesh Bhandari</h4>
      <p class="guide-detail"><i class="fas fa-star"></i> 5.0 (156 reviews)</p>
      <p class="guide-detail"><i class="fas fa-map-marker-alt"></i> Ghandruk, Annapurna Region</p>
      <p class="guide-detail"><i class="fas fa-comment"></i> English, French</p>
      <p class="guide-price">$75/day</p>
      <button class="btn">View Profile</button>
    </div>
    <div class="guide-item">
      <h4>Sunita Rai</h4>
      <p class="guide-detail"><i class="fas fa-star"></i> 4.7 (94 reviews)</p>
      <p class="guide-detail"><i class="fas fa-map-marker-alt"></i> Pokhara Region</p>
      <p class="guide-detail"><i class="fas fa-comment"></i> English, Hindi</p>
      <p class="guide-price">$50/day</p>
      <button class="btn">View Profile</button>
    </div>
    <div class="guide-item">
      <h4>Pemba Sherpa</h4>
      <p class="guide-detail"><i class="fas fa-star"></i> 5.0 (203 reviews)</p>
      <p class="guide-detail"><i class="fas fa-map-marker-alt"></i> Everest Region</p>
      <p class="guide-detail"><i class="fas fa-comment"></i> English, Tibetan</p>
      <p class="guide-price">$95/day</p>
      <button class="btn">View Profile</button>
    </div>
  `;
}

// Function to update events section
function updateEventsSection() {
  eventsContainer.innerHTML = `
    <div class="event-item">
      <h4>Dashain Festival</h4>
      <p class="event-detail"><i class="fas fa-calendar"></i> October 15-29, 2025</p>
      <p class="event-detail"><i class="fas fa-map-marker-alt"></i> Nationwide</p>
      <p class="event-description">Nepal's biggest and most important festival, celebrating the victory of good over evil with family gatherings, feasting, and kite flying.</p>
    </div>
    <div class="event-item">
      <h4>Ghandruk Music Festival</h4>
      <p class="event-detail"><i class="fas fa-calendar"></i> November 10-12, 2025</p>
      <p class="event-detail"><i class="fas fa-map-marker-alt"></i> Ghandruk Village</p>
      <p class="event-description">A celebration of traditional Gurung music and dance, featuring local artists and cultural performances in the scenic mountain village.</p>
    </div>
  `;
}

// Function to update activities section
function updateActivitiesSection() {
  activitiesContainer.innerHTML = `
    <div class="activity-item">
      <h4>Village Homestay Experience</h4>
      <p class="activity-detail"><i class="fas fa-clock"></i> 2 days</p>
      <p class="activity-detail"><i class="fas fa-users"></i> Group activity</p>
      <p class="activity-description">Live with a local family, participate in daily activities, learn traditional cooking, and experience authentic Gurung culture.</p>
    </div>
    <div class="activity-item">
      <h4>Annapurna Base Camp Trek</h4>
      <p class="activity-detail"><i class="fas fa-clock"></i> 7 days</p>
      <p class="activity-detail"><i class="fas fa-mountain"></i> Moderate difficulty</p>
      <p class="activity-description">A scenic trek through rhododendron forests to the base of Annapurna massif, offering breathtaking mountain views and cultural encounters.</p>
    </div>
    <div class="activity-item">
      <h4>Traditional Weaving Workshop</h4>
      <p class="activity-detail"><i class="fas fa-clock"></i> 4 hours</p>
      <p class="activity-detail"><i class="fas fa-users"></i> Individual or small group</p>
      <p class="activity-description">Learn the ancient art of traditional weaving from local artisans and create your own handmade textile souvenir.</p>
    </div>
  `;
}

<<<<<<< HEAD
// Function to process URL parameters
function processUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get("query");

  if (query) {
    // Set the query in the input field
    userInput.value = query;
    // Process the query
    handleUserMessage();
  }
=======
// Guides Carousel Functionality
function initGuidesCarousel() {
  const guidesContainer = document.getElementById("guidesContainer");
  const prevBtn = document.getElementById("guidesPrev");
  const nextBtn = document.getElementById("guidesNext");

  if (!guidesContainer || !prevBtn || !nextBtn) {
    return;
  }

  // Scroll amount (one card width + gap)
  const scrollAmount = 320;

  // Prev button click
  prevBtn.addEventListener("click", () => {
    guidesContainer.scrollBy({
      left: -scrollAmount,
      behavior: "smooth",
    });
  });

  // Next button click
  nextBtn.addEventListener("click", () => {
    guidesContainer.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  });

  // Update button states based on scroll position
  function updateButtonStates() {
    const isAtStart = guidesContainer.scrollLeft <= 0;
    const isAtEnd =
      guidesContainer.scrollLeft + guidesContainer.clientWidth >=
      guidesContainer.scrollWidth - 1;

    prevBtn.disabled = isAtStart;
    nextBtn.disabled = isAtEnd;
  }

  // Listen to scroll events
  guidesContainer.addEventListener("scroll", updateButtonStates);

  // Initial button state
  updateButtonStates();

  // Update button states when guides are loaded
  const observer = new MutationObserver(updateButtonStates);
  observer.observe(guidesContainer, {
    childList: true,
    subtree: true,
  });
>>>>>>> 30644b2351ce0364e52ce5b19dcf96c06bc1d317
}

// Initialize the chat with a welcome message
document.addEventListener("DOMContentLoaded", () => {
  // Add initial bot message with animation
  setTimeout(() => {
    addMessageToChat(
      "Hello! I'm your AI travel guide for Nepal. I can help you discover authentic experiences, find local guides, recommend activities, and provide information about cultural events. What would you like to know?",
      "bot"
    );
  }, 500);

  // Add animation to suggestion buttons
  document.querySelectorAll(".suggestion-btn").forEach((button, index) => {
    setTimeout(() => {
      button.style.opacity = "1";
      button.style.transform = "translateY(0)";
    }, 1000 + index * 200);
  });

<<<<<<< HEAD
  // Process URL parameters if any
  processUrlParams();
=======
  // Initialize guides carousel
  initGuidesCarousel();
>>>>>>> 30644b2351ce0364e52ce5b19dcf96c06bc1d317
});
