const express = require('express');
const app = express();
const PORT = 8000;

let summaries = [];
let quotes = [
  "You can do it!",
  "Never give up!",
  "Today is your day!",
  "Keep going!",
  "Believe in yourself!"
];

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', '*');
  next();
});

app.use(express.json());

app.get('/quote', (req, res) => {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  res.json({ quote: randomQuote });
});

app.post('/summary', (req, res) => {
  const { motivation, goals, reflection, rating } = req.body;
  const newSummary = {
    id: Date.now(),
    motivation: motivation,
    goals: goals,
    reflection: reflection,
    rating: rating,
    date: new Date().toDateString()
  };
  summaries.push(newSummary);
  res.json({ success: true, summary: newSummary });
});

app.get('/summaries', (req, res) => {
  res.json(summaries);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});