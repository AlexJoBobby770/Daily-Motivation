
const motivationInput = document.getElementById('motivationInput');
const addMotivationBtn = document.getElementById('addMotivationBtn');
const summaryDisplay = document.getElementById('summaryDisplay');
const goal1 = document.getElementById('goal1');
const goal2 = document.getElementById('goal2');
const saveGoalsBtn = document.getElementById('saveGoalsBtn');
const reflectionInput = document.getElementById("reflectionInput");
const ratingSelect = document.getElementById("rating");
const submitReflectionBtn = document.getElementById("submitReflectionBtn");

let motivation = "";
let goals = [];
let reflection = "";
let rating = 1;
let dailyQuote = "";

async function getQuote() {
  try {
    const response = await fetch('http://localhost:8000/quote');
    const data = await response.json();
    dailyQuote = data.quote;
    showQuote();
  } catch (error) {
    console.log('Error getting quote:', error);
  }
}

function showQuote() {
  const quoteDiv = document.createElement('div');
  quoteDiv.innerHTML = `<h2>Daily Quote: "${dailyQuote}"</h2>`;
  document.body.insertBefore(quoteDiv, document.body.firstChild);
}

async function saveSummary() {
  try {
    const summaryData = {
      motivation: motivation,
      goals: goals,
      reflection: reflection,
      rating: rating
    };
    
    const response = await fetch('http://localhost:8000/summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(summaryData)
    });
    const data = await response.json();
    console.log('Summary saved:', data);
  } catch (error) {
    console.log('Error saving summary:', error);
  }
}

async function getSummaries() {
  try {
    const response = await fetch('http://localhost:8000/summaries');
    const data = await response.json();
    console.log('All summaries:', data);
    showSummaries(data);
  } catch (error) {
    console.log('Error getting summaries:', error);
  }
}

function showSummaries(summaries) {
  const summaryDiv = document.createElement('div');
  summaryDiv.innerHTML = '<h3>Your Previous Days:</h3>';
  
  summaries.forEach(s => {
    summaryDiv.innerHTML += `
      <div style="border: 1px solid #ccc; padding: 10px; margin: 10px 0;">
        <h4>${s.date}</h4>
        <p><strong>Motivation:</strong> ${s.motivation || 'None'}</p>
        <p><strong>Goals:</strong> ${s.goals.map(g => g.text).join(', ') || 'None'}</p>
        <p><strong>Reflection:</strong> ${s.reflection || 'None'}</p>
        <p><strong>Rating:</strong> ${'⭐'.repeat(s.rating)}</p>
      </div>
    `;
  });
  
  document.body.appendChild(summaryDiv);
}

function updateSummary() {
  summaryDisplay.innerHTML = `
    <h3>Motivation</h3>
    <p>${motivation || "—"}</p>
    
    <h3>Goals</h3>
    <ul>
      ${goals.map(g => `<li>${g.text} ${g.done ? '✅' : ''}</li>`).join('')}
    </ul>
    
    <h3>Reflection</h3>
    <p>${reflection || "—"}</p>
    
    <h3>Rating</h3>
    <p>${"⭐".repeat(rating)}</p>
  `;
}

addMotivationBtn.addEventListener("click", () => {
  motivation = motivationInput.value;
  motivationInput.value = "";
  updateSummary();
  saveSummary(); 
});

saveGoalsBtn.addEventListener('click', () => {
  goals = [
    { text: goal1.value, done: false },
    { text: goal2.value, done: false }
  ];
  goal1.value = "";
  goal2.value = "";
  updateSummary();
  saveSummary(); 
});

submitReflectionBtn.addEventListener("click", () => {
  reflection = reflectionInput.value;
  rating = ratingSelect.value;
  reflectionInput.value = "";
  ratingSelect.value = "1";
  updateSummary();
  saveSummary();
});

window.onload = function() {
  getQuote();
  getSummaries(); 
  updateSummary();
};