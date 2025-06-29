// AI Chatbot Logic
class Chatbot {
  constructor() {
    this.responses = this.initializeResponses();
    this.chatContainer = document.getElementById('chatContainer');
    this.messageInput = document.getElementById('messageInput');
    this.sendBtn = document.getElementById('sendBtn');
    
    this.init();
  }

  init() {
    this.addEventListeners();
    this.scrollToBottom();
  }

  addEventListeners() {
    const chatForm = document.getElementById('chatForm');
    if (chatForm) {
      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.sendMessage();
      });
    }

    // Auto-resize input
    this.messageInput.addEventListener('input', this.autoResize);
  }

  autoResize() {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
  }

  sendMessage() {
    const message = this.messageInput.value.trim();
    if (!message) return;

    // Add user message
    this.addMessage(message, true);
    
    // Clear input and show typing indicator
    this.messageInput.value = '';
    this.showTypingIndicator();
    
    // Generate response after delay
    setTimeout(() => {
      this.hideTypingIndicator();
      const response = this.generateResponse(message);
      this.addMessage(response, false);
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
  }

  addMessage(text, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${isUser ? 'user' : ''}`;
    
    messageDiv.innerHTML = `
      ${!isUser ? '<div class="avatar"><i class="bi bi-robot"></i></div>' : ''}
      <div class="message-content">${text}</div>
      ${isUser ? '<div class="avatar"><i class="bi bi-person"></i></div>' : ''}
    `;
    
    this.chatContainer.appendChild(messageDiv);
    this.scrollToBottom();
  }

  showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message typing-indicator';
    typingDiv.id = 'typing-indicator';
    
    typingDiv.innerHTML = `
      <div class="avatar"><i class="bi bi-robot"></i></div>
      <div class="message-content">
        <div class="spinner me-2"></div>
        StudyBot is typing...
      </div>
    `;
    
    this.chatContainer.appendChild(typingDiv);
    this.scrollToBottom();
  }

  hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  generateResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Find matching response patterns
    for (const category in this.responses) {
      const patterns = this.responses[category];
      for (const pattern of patterns.keywords) {
        if (lowerMessage.includes(pattern)) {
          return this.getRandomResponse(patterns.responses);
        }
      }
    }
    
    // Default responses if no match found
    const defaultResponses = [
      "That's an interesting question! While I'd love to help with that specific topic, I'm designed to focus on study-related questions. Try asking me about study techniques, exam preparation, or time management!",
      "I'm here to help with your academic journey! Feel free to ask me about study strategies, course materials, or how to prepare for exams.",
      "Great question! I'm specialized in helping students with their studies. What subject are you working on, or what study challenge can I help you with?",
      "I'm your study assistant, so I'm best at helping with academic topics. What's your biggest study challenge right now?"
    ];
    
    return this.getRandomResponse(defaultResponses);
  }

  getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
  }

  initializeResponses() {
    return {
      greeting: {
        keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
        responses: [
          "Hello! I'm here to help you with your studies. What can I assist you with today?",
          "Hi there! Ready to tackle some studying? What subject or topic would you like help with?",
          "Hey! Great to see you're here to study. What's on your academic agenda today?",
          "Hello! I'm StudyBot, your AI study companion. How can I help make your learning more effective?"
        ]
      },
      
      studyHabits: {
        keywords: ['study habits', 'how to study', 'study tips', 'study better', 'improve studying'],
        responses: [
          "Here are some effective study habits: 1) Create a dedicated study space, 2) Use the Pomodoro Technique (25 min study, 5 min break), 3) Practice active recall instead of just re-reading, 4) Take regular breaks, and 5) Stay consistent with your schedule. Which of these would you like me to explain more?",
          "Great question! Effective studying involves: Setting specific goals, eliminating distractions, using multiple learning methods (visual, auditory, kinesthetic), and reviewing material regularly. The key is finding what works best for your learning style. What subjects are you currently studying?",
          "Building good study habits takes time! Start with: 1) Setting a consistent study schedule, 2) Breaking large tasks into smaller chunks, 3) Using active learning techniques like summarizing and self-testing, 4) Finding your optimal study environment. What's your biggest challenge with studying right now?"
        ]
      },
      
      examPrep: {
        keywords: ['exam', 'test', 'exam preparation', 'exam prep', 'test prep', 'finals', 'midterm'],
        responses: [
          "Exam preparation strategies: 1) Start early - don't cram! 2) Create a study schedule working backwards from exam date, 3) Practice with past papers or sample questions, 4) Form study groups for discussion, 5) Get enough sleep before the exam. What type of exam are you preparing for?",
          "For effective exam prep: Review your syllabus to know what's covered, create summary notes, practice active recall, do mock exams under timed conditions, and identify your weak areas for extra focus. How much time do you have until your exam?",
          "Success in exams comes from: Understanding concepts (not just memorizing), practicing problem-solving, managing time during the exam, staying calm and focused, and reviewing mistakes from practice tests. Which subject is your exam in?"
        ]
      },
      
      timeManagement: {
        keywords: ['time management', 'manage time', 'time during exam', 'schedule', 'organize time'],
        responses: [
          "Time management tips: 1) Use a planner or digital calendar, 2) Prioritize tasks using the Eisenhower Matrix (urgent/important), 3) Try time-blocking for different subjects, 4) Set realistic goals, 5) Include buffer time for unexpected challenges. What's your biggest time management challenge?",
          "During exams, manage time by: Reading all questions first, allocating time per question/section, starting with questions you're confident about, keeping track of time, and leaving time for review. Practice this with mock exams!",
          "Effective time management for students: Create a weekly schedule, use the 2-minute rule (if it takes less than 2 minutes, do it now), batch similar tasks together, and don't forget to schedule breaks and downtime. What subjects are you trying to balance?"
        ]
      },
      
      stressAnxiety: {
        keywords: ['stress', 'anxiety', 'nervous', 'worried', 'overwhelmed', 'panic', 'anxious'],
        responses: [
          "Managing study stress: 1) Practice deep breathing exercises, 2) Break large tasks into smaller, manageable pieces, 3) Exercise regularly to reduce stress hormones, 4) Get adequate sleep, 5) Talk to someone you trust. Remember, some stress is normal - you've got this!",
          "Exam anxiety is common! Try these techniques: Progressive muscle relaxation, positive self-talk, visualization of success, arriving early to the exam venue, and remembering that one exam doesn't define you. Have you tried any relaxation techniques before?",
          "When feeling overwhelmed: Take a step back, prioritize what's most important, practice mindfulness or meditation, maintain a healthy routine, and remember that it's okay to ask for help. What's causing you the most stress right now?"
        ]
      },
      
      motivation: {
        keywords: ['motivation', 'motivate', 'lazy', 'procrastination', 'procrastinate', 'focus'],
        responses: [
          "Staying motivated: 1) Set clear, achievable goals, 2) Reward yourself for completing tasks, 3) Find your 'why' - remember your long-term goals, 4) Study with friends for accountability, 5) Celebrate small wins along the way. What motivates you most?",
          "Beat procrastination with: The 2-minute rule, breaking tasks into tiny steps, using the Pomodoro Technique, removing distractions, and creating a reward system. Sometimes just starting is the hardest part - what's one small thing you can do right now?",
          "When lacking focus: Eliminate distractions (phone, social media), use website blockers during study time, change your environment, try the Feynman Technique (explain concepts aloud), and take regular breaks. What usually distracts you most?"
        ]
      },
      
      subjects: {
        keywords: ['math', 'mathematics', 'science', 'physics', 'chemistry', 'biology', 'history', 'english', 'computer science', 'programming'],
        responses: [
          "Each subject has its own best practices! For STEM subjects: Practice problems regularly, understand concepts before memorizing formulas, and work through examples step by step. For humanities: Focus on critical thinking, writing practice, and connecting ideas. What specific subject challenges are you facing?",
          "Subject-specific tips: Math/Science - practice daily, use visual aids, teach concepts to others. Languages/Literature - read widely, practice writing, engage in discussions. Social Sciences - make connections between concepts, use timelines and maps. Which subject would you like specific help with?",
          "Different subjects need different approaches! Let me know which subject you're working on and I can give you more targeted advice. Are you struggling with understanding concepts, memorizing information, or applying knowledge to problems?"
        ]
      }
    };
  }

  scrollToBottom() {
    this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
  }
}

// Global function for quick questions
function askQuestion(question) {
  const messageInput = document.getElementById('messageInput');
  messageInput.value = question;
  
  if (window.chatbot) {
    window.chatbot.sendMessage();
  }
}

// Initialize chatbot
document.addEventListener('DOMContentLoaded', () => {

  
  window.chatbot = new Chatbot();
});