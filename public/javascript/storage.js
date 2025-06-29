// ExamAssist Storage Utilities
class Storage { 
  // Theme management
  static setTheme(theme) {
    localStorage.setItem('examassist_theme', theme);
  }

  static getTheme() {
    return localStorage.getItem('examassist_theme') || 'light';
  }

  // Past questions

}

window.Storage = Storage;