// Dark Mode Toggle Functionality
class DarkMode {
  constructor() {
    this.init();
  }

  init() {
    // Set initial theme
    const savedTheme = Storage.getTheme();
    this.setTheme(savedTheme);
    
    // Update toggle state
    this.updateToggleState(savedTheme);
    
    // Add event listeners to all dark mode toggles
    this.addEventListeners();
  }

  addEventListeners() {
    const toggles = document.querySelectorAll('#darkModeToggle');
    toggles.forEach(toggle => {
      toggle.addEventListener('change', (e) => {
        const theme = e.target.checked ? 'dark' : 'light';
        this.setTheme(theme);
        Storage.setTheme(theme);
        
        // Sync all toggles
        this.updateToggleState(theme);
      });
    });
  }

  setTheme(theme) {
    document.documentElement.setAttribute('data-bs-theme', theme);
    
    // Update body classes for additional styling if needed
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  updateToggleState(theme) {
    const toggles = document.querySelectorAll('#darkModeToggle');
    toggles.forEach(toggle => {
      toggle.checked = theme === 'dark';
    });
  }
}

// Initialize dark mode when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.darkMode = new DarkMode();
});