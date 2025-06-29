// Combined AI Chatbot Logic
class Chatbot {
  constructor() {
    this.chatBox = document.getElementById('chat-box');
    this.chatContainer = this.chatBox; // unified naming
    this.messageInput = document.getElementById('message');
    this.imageInput = document.getElementById('image');
    this.sendBtn = document.getElementById('sendBtn');
    this.preview = document.getElementById('preview');
    this.conversationHistory = [];
    this.selectedImages = [];

    this.init();
  }

  init() {
    this.addEventListeners();
    this.scrollToBottom();
  }

  addEventListeners() {
    // Image preview with remove option
    this.imageInput.addEventListener('change', () => {
      const files = Array.from(this.imageInput.files);
      this.preview.innerHTML = '';
      this.selectedImages = files;

      files.forEach((file, index) => {
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.style.display = 'inline-block';
        wrapper.style.margin = '5px';

        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.style.maxWidth = '100px';
        img.style.borderRadius = '8px';
        img.style.display = 'block';

        const removeBtn = document.createElement('span');
        removeBtn.textContent = '×';
        removeBtn.style.position = 'absolute';
        removeBtn.style.top = '2px';
        removeBtn.style.right = '6px';
        removeBtn.style.cursor = 'pointer';
        removeBtn.style.borderRadius = '50%';
        removeBtn.style.padding = '0 6px';
        removeBtn.style.fontWeight = 'bold';
        removeBtn.style.boxShadow = '0 0 4px rgba(0,0,0,0.3)';
        removeBtn.onclick = () => {
          this.selectedImages.splice(index, 1);
          wrapper.remove();
        };

        wrapper.appendChild(img);
        wrapper.appendChild(removeBtn);
        this.preview.appendChild(wrapper);
      });
    });

    // Send message event
    this.sendBtn.addEventListener('click', () => this.sendMessage());
  }

  async sendMessage() {
    const message = this.messageInput.value.trim();

    if (!message && this.selectedImages.length === 0) {
      alert('Please provide a message or image.');
      return;
    }

    const formData = new FormData();
    if (message) formData.append('message', message);
    this.selectedImages.forEach(imgFile => {
      formData.append('images[]', imgFile);
    });
    formData.append('history', JSON.stringify(this.conversationHistory));

    // Display user message
// Display user message
  let userContent = message ? message.replace(/\n+/g, '<br><br>') : '';
const userMsg = document.createElement('div');
userMsg.className = 'message user d-flex justify-content-end';
userMsg.innerHTML = `
  <div class="user-bubble p-2 rounded shadow-sm">
    ${userContent || '[Image only]'}
  </div>
`;
this.chatBox.appendChild(userMsg);

// Bot placeholder
const botMsg = document.createElement('div');
botMsg.className = 'message bot d-flex';
botMsg.innerHTML = `
  <div class="bot-bubble p-2 rounded shadow-sm">
    <strong>Assist Ai:</strong><br>
  </div>
`;
this.chatBox.appendChild(botMsg);

    this.scrollToBottom();

    // Call backend (Gemini 2.5 Flash model should be handled server-side)
    const response = await fetch('http://localhost:8080/chatBot', {
      method: 'POST',
      body: formData,
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let botHTML = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      botHTML += this.formatRichText(chunk);
     botMsg.querySelector('.bot-bubble').innerHTML = `<strong>Assist Ai:</strong><br>${botHTML}`;

      this.scrollToBottom();
    }

    this.conversationHistory.push(
      { role: 'user', parts: message ? [{ text: message }] : [] },
      { role: 'model', parts: [{ text: botHTML }] }
    );

    // Reset input
    this.messageInput.value = '';
    this.imageInput.value = '';
    this.preview.innerHTML = '';
    this.selectedImages = [];
  }

  formatRichText(text) {
  let formatted = text;

  // Bold **text**
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Italic *text*
  formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Code blocks
  formatted = formatted.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

  // Colored text
  formatted = formatted.replace(/\[red\](.*?)\[\/red\]/g, '<span style="color:red;">$1</span>');
  formatted = formatted.replace(/\[green\](.*?)\[\/green\]/g, '<span style="color:green;">$1</span>');
  formatted = formatted.replace(/\[blue\](.*?)\[\/blue\]/g, '<span style="color:blue;">$1</span>');

  // Lists
  formatted = formatted.replace(/(?:^|\n)[•\-] (.*?)(?=\n|$)/g, '<li>$1</li>');
  formatted = formatted.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
  formatted = formatted.replace(/(?:^|\n)\d+\. (.*?)(?=\n|$)/g, '<li>$1</li>');

  // Markdown tables
  formatted = formatted.replace(/\n?\|(.+?)\|\n?\|([-\s|:]+)\|\n([\s\S]*?\|(?:\n|$))+/g, (match) => {
    const lines = match.trim().split('\n').filter(line => line.includes('|'));
    if (lines.length < 2) return match;

    const headers = lines[0].split('|').map(h => h.trim()).filter(Boolean);
    const rows = lines.slice(2).map(row => row.split('|').map(cell => cell.trim()).filter(Boolean));

    let tableHTML = `<div class="table-responsive"><table class="table table-bordered table-striped table-sm align-middle">`;
    tableHTML += `<thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>`;
    tableHTML += rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('');
    tableHTML += `</tbody></table></div>`;

    return tableHTML;
  });

  // Paragraph breaks
  formatted = formatted.replace(/\n{2,}/g, '<br><br>');

  return formatted;
}

  scrollToBottom() {
    this.chatBox.scrollTop = this.chatBox.scrollHeight;
  }
}

// Global helper to trigger a question
function askQuestion(question) {
  const messageInput = document.getElementById('message');
  messageInput.value = question;
  if (window.chatbot) {
    window.chatbot.sendMessage();
  }
}

// Initialize chatbot
window.addEventListener('DOMContentLoaded', () => {
  window.chatbot = new Chatbot();
});
