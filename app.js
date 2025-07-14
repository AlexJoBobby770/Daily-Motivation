function displaySummary() {
  summaryDisplay.innerHTML = `
    <h3>Motivation</h3>
    <p>${text || "—"}</p>
    <h3>Goals</h3>
    <ul style="list-style: none;">
    ${goals.map((g, i) =>
             `<li >
            <input type="checkbox" id="goalCheck${i}" ${g.done ? "checked" : ""}>
            <label for="goalCheck${i}" style="text-decoration: ${g.done ? "line-through" : "none"};">
            ${g.text}
            </label>
        </li>`).join("")}
    </ul>
    <h3>Reflection</h3>
    <p>${reflection || "—"}</p>
    <p>Rating: ${"⭐".repeat(rating)}</p> `
    goals.forEach((g, i) => {
  const checkbox = document.getElementById(`goalCheck${i}`);
  if (checkbox) {
    checkbox.addEventListener("change", () => {
      goals[i].done = checkbox.checked;
      displaySummary();
    });
  }
});

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

let  goals=[];
saveGoalsBtn.addEventListener('click',()=>
{
       goals = [
    { text: goal1.value, done: false },
    { text: goal2.value, done: false },
  ];
  goal1.value = "";
  goal2.value = "";
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

async function fetchMotivationLogs() {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=3");
    const data = await res.json();
    console.log("Fetched Motivation Logs:", data);
  } 
  catch (error)
   {
    console.error("Error fetching logs:", error);
  }
}
fetchMotivationLogs();
async function postMotivation(text) {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts",
    {
      method: "POST",
      headers: {"Content-Type": "application/json",},
      body: JSON.stringify({
        title: "Motivation",
        body: text,
        userId: 1,
      }),
    });

    const data = await res.json();
    console.log("Posted Motivation:", data);
    

  } catch (err) {
    console.error("Error posting motivation:", err);
  }
}
addMotivationBtn.addEventListener("click", () => 
        {
        motivationText = motivationInput.value;
        postMotivation(motivationText); 
        motivationInput.value = "";
        displaySummary();
});




