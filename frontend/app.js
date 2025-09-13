// Check if user is logged in
function checkLogin() {
  const currentUser = localStorage.getItem('currentUser');
  if (!currentUser) {
    window.location.href = 'login.html';
    return false;
  }
  
  // Update welcome message
  document.getElementById('welcomeUser').textContent = `Welcome, ${currentUser}!`;
  return true;
}

// Logout function
document.getElementById('logoutBtn').addEventListener('click', function() {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
  }
});

// Form elements
const dailyForm = document.getElementById('dailyForm');
const motivationInput = document.getElementById('motivationInput');
const summaryDisplay = document.getElementById('summaryDisplay');
const goal1 = document.getElementById('goal1');
const goal2 = document.getElementById('goal2');
const reflectionInput = document.getElementById('reflectionInput');
const ratingSelect = document.getElementById('rating');
const previousDaysDiv = document.getElementById('previousDays');

// Data variables
let motivation = "";
let goals = [];
let reflection = "";
let rating = 3;
let dailyQuote = "";

// Format date nicely
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short', 
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

// Get daily quote
async function getQuote() {
  try {
    const response = await fetch('https://daily-motivation-0abm.onrender.com/quote');
    const data = await response.json();
    dailyQuote = data.quote;
    showQuote();
  } catch (error) {
    console.log('Error getting quote:', error);
    dailyQuote = "Today is a new day full of possibilities!";
    showQuote();
  }
}

function showQuote() {
  const quoteDiv = document.getElementById('DailyQuote');
  quoteDiv.innerHTML = `"${dailyQuote}"`;
}

// Save summary to server
async function saveSummary() {
  try {
    const currentUser = localStorage.getItem('currentUser');
    const summaryData = {
      motivation: motivation,
      goals: goals,
      reflection: reflection,
      rating: rating,
      username: currentUser
    };
    
    const response = await fetch('https://daily-motivation-0abm.onrender.com/summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(summaryData)
    });
    
    const data = await response.json();
    console.log('Summary saved:', data);
    alert('✅ Daily summary saved successfully!');
    
    // Reload previous summaries
    getSummaries();
  } catch (error) {
    console.log('Error saving summary:', error);
    alert('❌ Error saving summary. Please try again.');
  }
}

// Get user's summaries
async function getSummaries() {
  try {
    const currentUser = localStorage.getItem('currentUser');
    const response = await fetch(`https://daily-motivation-0abm.onrender.com/summaries/${currentUser}`);
    const data = await response.json();
    console.log('User summaries:', data);
    showPreviousDays(data);
  } catch (error) {
    console.log('Error getting summaries:', error);
    // Fallback to general endpoint
    try {
      const response = await fetch('https://daily-motivation-0abm.onrender.com/summaries');
      const data = await response.json();
      showPreviousDays(data);
    } catch (fallbackError) {
      console.log('Fallback also failed:', fallbackError);
    }
  }
}

// Display previous days
function showPreviousDays(summaries) {
  if (summaries.length === 0) {
    previousDaysDiv.innerHTML = '<p style="color: #666; text-align: center;">No previous entries yet.</p>';
    return;
  }
  
  previousDaysDiv.innerHTML = '';
  
  summaries.forEach(summary => {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'previous-day';
    
    dayDiv.innerHTML = `
      <div class="previous-day-header">
        📅 ${formatDate(summary.date)}
      </div>
      <div class="previous-day-content">
        <div class="previous-day-item">
          <div class="previous-day-label">💡 Inspiration:</div>
          <div class="previous-day-text">${summary.motivation || 'None'}</div>
        </div>
        <div class="previous-day-item">
          <div class="previous-day-label">🎯 Goals:</div>
          <div class="previous-day-text">${summary.goals.map(g => g.text).join(', ') || 'None'}</div>
        </div>
        <div class="previous-day-item">
          <div class="previous-day-label">🤔 Reflection:</div>
          <div class="previous-day-text">${summary.reflection || 'None'}</div>
        </div>
        <div class="previous-day-item">
          <div class="previous-day-label">⭐ Rating:</div>
          <div class="previous-day-text">${'⭐'.repeat(summary.rating)}</div>
        </div>
      </div>
    `;
    
    previousDaysDiv.appendChild(dayDiv);
  });
}

// Update summary display
function updateSummary() {
  summaryDisplay.innerHTML = `
    <div class="summary-section">
      <div class="summary-title">💡 Inspiration</div>
      <div class="summary-content">${motivation || "No inspiration noted yet..."}</div>
    </div>
    
    <div class="summary-section">
      <div class="summary-title">🎯 Goals</div>
      <div class="summary-content">
        ${goals.length > 0 
          ? `<ul class="summary-goals">
              ${goals.map(g => `<li>• ${g.text} ${g.done ? '✅' : '⏳'}</li>`).join('')}
            </ul>` 
          : 'No goals set yet...'
        }
      </div>
    </div>
    
    <div class="summary-section">
      <div class="summary-title">🤔 Reflection</div>
      <div class="summary-content">${reflection || "No reflection written yet..."}</div>
    </div>
    
    <div class="summary-section">
      <div class="summary-title">⭐ Day Rating</div>
      <div class="summary-content summary-rating">${"⭐".repeat(rating)}</div>
    </div>
  `;
}

// Form submission
dailyForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  // Get form values
  motivation = motivationInput.value.trim();
  goals = [
    { text: goal1.value.trim(), done: false },
    { text: goal2.value.trim(), done: false }
  ].filter(goal => goal.text !== "");
  
  reflection = reflectionInput.value.trim();
  rating = parseInt(ratingSelect.value);
  
  // Update display
  updateSummary();
  
  // Save to server
  await saveSummary();
});

// Input focus animations
document.addEventListener('DOMContentLoaded', function() {
  const inputs = document.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.style.transform =