
const dailyForm = document.getElementById('dailyForm');
const motivationInput = document.getElementById('motivationInput');
const summaryDisplay = document.getElementById('summaryDisplay');
const goal1 = document.getElementById('goal1');
const goal2 = document.getElementById('goal2');
const reflectionInput = document.getElementById("reflectionInput");
const ratingSelect = document.getElementById("rating");

let motivation = "";
let goals = [];
let reflection = "";
let rating = 1;
let dailyQuote = "";

function formatDateWithTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short', 
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

async function getQuote() {
  try {
    const response = await fetch('https://daily-motivation-0abm.onrender.com/quote');
    const data = await response.json();
    dailyQuote = data.quote;
    showQuote();
  } catch (error) {
    console.log('Error getting quote:', error);
  }
}

function showQuote() {
  const quoteDiv = document.getElementById('DailyQuote');
  quoteDiv.innerHTML = `"${dailyQuote}"`;
}

async function saveSummary() {
  try {
    const summaryData = {
      motivation: motivation,
      goals: goals,
      reflection: reflection,
      rating: rating
    };
    
    const response = await fetch('https://daily-motivation-0abm.onrender.com/summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(summaryData)
    });
    const data = await response.json();
    console.log('Summary saved:', data);
    alert('✅ Daily summary saved successfully!');
  } catch (error) {
    console.log('Error saving summary:', error);
    alert('❌ Error saving summary. Please try again.');
  }
}

async function getSummaries() {
  try {
    const response = await fetch('https://daily-motivation-0abm.onrender.com/summaries');
    const data = await response.json();
    console.log('All summaries:', data);
    showSummaries(data);
  } catch (error) {
    console.log('Error getting summaries:', error);
  }
}

function showSummaries(summaries) {
  const summaryDiv = document.createElement('div');
  summaryDiv.innerHTML = '<h3 class="text-xl font-bold mt-8 mb-4">📚 Your Previous Days:</h3>';
  
  summaries.forEach(s => {
    summaryDiv.innerHTML += `
      <div class="bg-gray-400 rounded-lg p-4 mb-4">
        <h4 class="text-lg font-semibold text-yellow-400 mb-2">📅 ${formatDateWithTime(s.date)}</h4>
        <p><strong>💪 Motivation:</strong> ${s.motivation || 'None'}</p>
        <p><strong>🎯 Goals:</strong> ${s.goals.map(g => g.text).join(', ') || 'None'}</p>
        <p><strong>🤔 Reflection:</strong> ${s.reflection || 'None'}</p>
        <p><strong>⭐ Rating:</strong> ${'⭐'.repeat(s.rating)}</p>
      </div>
    `;
  });
  
  document.body.appendChild(summaryDiv);
}

function updateSummary() {
  summaryDisplay.innerHTML = `
    <div class="space-y-6">
      <div>
        <h3 class="text-lg font-semibold text-slate-600 mb-2 accent-font flex items-center">
          <span class="mr-2"></span> Inspiration
        </h3>
        <p class="bg-white bg-opacity-60 p-4 rounded-2xl text-slate-700 border border-slate-200">${motivation || "No inspiration noted yet..."}</p>
      </div>
      
      <div>
        <h3 class="text-lg font-semibold text-slate-600 mb-2 accent-font flex items-center">
          <span class="mr-2">🎨</span> Creative Goals
        </h3>
        <ul class="bg-white bg-opacity-60 p-4 rounded-2xl border border-slate-200" style="list-style: none;">
          ${goals.length > 0 
            ? goals.map(g => `<li class="py-2 text-slate-700 flex items-center">
                <span class="mr-2">•</span> 
                <span class="flex-1">${g.text}</span> 
                <span class="ml-2">${g.done ? '✅' : '⏳'}</span>
              </li>`).join('') 
            : '<li class="py-2 text-slate-500">No goals set yet...</li>'
          }
        </ul>
      </div>
      
      <div>
        <h3 class="text-lg font-semibold text-slate-600 mb-2 accent-font flex items-center">
          <span class="mr-2">🌅</span> Reflection
        </h3>
        <p class="bg-white bg-opacity-60 p-4 rounded-2xl text-slate-700 border border-slate-200">${reflection || "No reflection written yet..."}</p>
      </div>
      
      <div>
        <h3 class="text-lg font-semibold text-slate-600 mb-2 accent-font flex items-center">
          <span class="mr-2">✨</span> Day Rating
        </h3>
        <p class="bg-white bg-opacity-60 p-4 rounded-2xl text-3xl border border-slate-200">${"⭐".repeat(rating)}</p>
      </div>
    </div>
  `;
}

dailyForm.addEventListener('submit', async (e) => {
  e.preventDefault(); 
 
  motivation = motivationInput.value.trim();
  goals = [
    { text: goal1.value.trim(), done: false },
    { text: goal2.value.trim(), done: false }
  ].filter(goal => goal.text !== ""); 
  
  reflection = reflectionInput.value.trim();
  rating = parseInt(ratingSelect.value);
  
  updateSummary();

  await saveSummary();
  
 
});

window.onload = function() {
  getQuote();
  getSummaries();
  updateSummary();
};