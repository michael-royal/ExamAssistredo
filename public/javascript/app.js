// Main Application Logic
class App {
  constructor() {
    this.init();
  }

  init() {
    this.addEventListeners();
  }

  addEventListeners() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    // Add fade-in animation to cards
    this.observeElements();
  }


  loadUserContent(user) {
    // Update any user-specific elements on the page
    const userElements = document.querySelectorAll('[data-user-name]');
    userElements.forEach(el => {
      el.textContent = user.name;
    });

    const avatarElements = document.querySelectorAll('[data-user-avatar]');
    avatarElements.forEach(el => {
      el.src = user.avatar;
    });
  }

  observeElements() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.feature-card, .card').forEach(card => {
      observer.observe(card);
    });
  }

  // Utility functions
  static formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  static formatTime(dateString) {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  static generateId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});