const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = 8000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB!'))
  .catch(err => console.log('❌ MongoDB error:', err));
const summarySchema = new mongoose.Schema({
  motivation: String,
  goals: [{
    text: String,
    done: Boolean
  }],
  reflection: String,
  rating: Number,
  date: {
    type: Date,
    default: Date.now
  }
});
const Summary = mongoose.model('Summary', summarySchema);
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
app.post('/summary', async (req, res) => {
  try {
    const { motivation, goals, reflection, rating } = req.body;
    const newSummary = new Summary({
      motivation: motivation,
      goals: goals,
      reflection: reflection,
      rating: rating
    });
    const savedSummary = await newSummary.save();
    
    console.log('✅ Saved to MongoDB:', savedSummary._id);
    res.json({ success: true, summary: savedSummary });
    
  } catch (error) {
    console.log('❌ Error saving:', error);
    res.status(500).json({ error: 'Failed to save' });
  }
});
app.get('/summaries', async (req, res) => {
  try {

    const summaries = await Summary.find().sort({ date: -1 });
    
    console.log(`📚 Found ${summaries.length} summaries in database`);
    res.json(summaries);
    
  } catch (error) {
    console.log('❌ Error getting summaries:', error);
    res.status(500).json({ error: 'Failed to get summaries' });
  }
});
app.get("/", (req, res) => {
  res.send("Server is working!");
});


app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log('💾 Using MongoDB for data storage!');
});