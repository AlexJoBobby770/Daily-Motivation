const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB!'))
  .catch(err => console.log('❌ MongoDB error:', err));

// User Schema (simple version - you can expand this later)
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);

// Summary Schema - now includes user reference
const summarySchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
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

// Motivational quotes
let quotes = [
  "You need this!",
  "You can't afford to lose",
  "Today is your day!",
  "Keep going!",
  "Never be average",
  "Believe in yourself!",
  "Progress, not perfection.",
  "Small steps daily lead to big changes yearly.",
  "You're stronger than you think.",
  "Every expert was once a beginner.",
  "Your potential is endless."
];

// Middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', '*');
  next();
});

app.use(express.json());

// Routes

// Home route
app.get("/", (req, res) => {
  res.send("Daily Fuel Server is running! 🚀");
});

// Get random quote
app.get('/quote', (req, res) => {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  res.json({ quote: randomQuote });
});

// Login route (simple version - expand with proper auth later)
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }
    
    // For now, we'll use simple hardcoded users
    // Later you can check against database with proper password hashing
    const validUsers = [
      { username: 'admin', password: 'password123' },
      { username: 'user', password: '12345' },
      { username: 'demo', password: 'demo' }
    ];
    
    const user = validUsers.find(u => u.username === username && u.password === password);
    
    if (user) {
      res.json({ 
        success: true, 
        message: 'Login successful',
        username: user.username
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
    
  } catch (error) {
    console.log('❌ Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Save summary (now requires username)
app.post('/summary', async (req, res) => {
  try {
    const { motivation, goals, reflection, rating, username } = req.body;
    
    // For now, we'll get username from request body
    // Later you can get it from authenticated session/JWT token
    const user = username || 'demo'; // fallback for existing data
    
    const newSummary = new Summary({
      username: user,
      motivation: motivation,
      goals: goals,
      reflection: reflection,
      rating: rating
    });
    
    const savedSummary = await newSummary.save();
    
    console.log(`✅ Saved summary for user ${user}:`, savedSummary._id);
    res.json({ success: true, summary: savedSummary });
    
  } catch (error) {
    console.log('❌ Error saving:', error);
    res.status(500).json({ error: 'Failed to save' });
  }
});

// Get summaries for a specific user
app.get('/summaries/:username', async (req, res) => {
  try {
    const { username } = req.params;
    
    const summaries = await Summary.find({ username: username })
                                  .sort({ date: -1 })
                                  .limit(20); // Limit to last 20 entries
    
    console.log(`📚 Found ${summaries.length} summaries for user ${username}`);
    res.json(summaries);
    
  } catch (error) {
    console.log('❌ Error getting summaries:', error);
    res.status(500).json({ error: 'Failed to get summaries' });
  }
});

// Get all summaries (fallback route for existing functionality)
app.get('/summaries', async (req, res) => {
  try {
    // For backwards compatibility, return demo user's summaries
    const summaries = await Summary.find({ username: 'demo' })
                                  .sort({ date: -1 })
                                  .limit(10);
    
    console.log(`📚 Found ${summaries.length} summaries in database`);
    res.json(summaries);
    
  } catch (error) {
    console.log('❌ Error getting summaries:', error);
    res.status(500).json({ error: 'Failed to get summaries' });
  }
});

// Create user (simple signup - expand later)
app.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }
    
    // Create new user (in production, hash the password!)
    const newUser = new User({
      username,
      password // In production: hash this with bcrypt!
    });
    
    await newUser.save();
    
    console.log(`✅ New user created: ${username}`);
    res.json({ 
      success: true, 
      message: 'User created successfully',
      username: username
    });
    
  } catch (error) {
    console.log('❌ Signup error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Daily Fuel Server running on http://localhost:${PORT}`);
  console.log('💾 Using MongoDB for data storage');
  console.log('🔐 Simple authentication enabled');
});