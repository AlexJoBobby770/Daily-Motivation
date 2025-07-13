function displaySummary() {
  summaryDisplay.innerHTML = `
    <h3>Motivation</h3>
    <p>${text || "—"}</p>

    <h3>Goals</h3>
    <ul>
      ${goals.map((g, i) => `<li>${g.text || "—"}</li>`).join("")}
    </ul>

    <h3>Reflection</h3>
    <p>${reflection || "—"}</p>
    <p>Rating: ${"⭐".repeat(rating)}</p> `;
}
const motivationInput=document.getElementById('motivationInput');
const addMotivationBtn=document.getElementById('addMotivationBtn');
const summaryDisplay=document.getElementById('summaryDisplay');

let text="";

addMotivationBtn.addEventListener("click",()=>
{
    text=motivationInput.value;
    motivationInput.value="";
    displaySummary();
});

const goal1=document.getElementById('goal1');
const goal2=document.getElementById('goal2');
const saveGoalsBtn=document.getElementById('saveGoalsBtn');

let goals=[];
saveGoalsBtn.addEventListener('click',()=>
{
       goals = [
    { text: goal1.value, done: false },
    { text: goal2.value, done: false },
  ];
  goal1Input.value = "";
  goal2Input.value = "";
  displaySummary();
});

const reflectionInput = document.getElementById("reflectionInput");
const ratingSelect = document.getElementById("rating");
const submitReflectionBtn = document.getElementById("submitReflectionBtn");

let reflection = "";
let rating = 0;

submitReflectionBtn.addEventListener("click", () => {
  reflection = reflectionInput.value;
  rating = ratingSelect.value;
  reflectionInput.value = "";
  ratingSelect.value = "1";
  displaySummary();
});




