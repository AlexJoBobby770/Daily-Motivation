const express = require('express');
const app = express();
const PORT = 8000;

const logs = []; // This will hold all logs during runtime



app.use(express.json());


app.get('/', (req, res) => {
  res.send('✨ Daily Fuel server is up and running!');
});


app.get('/motivation', (req, res) => {
  res.json({
    message: "You’ve got this. One small step at a time 💪",
    author: "ChatGPT"
  });
});

app.post('/log',(req,res)=>{
  const {message}=req.body;

  if(!message)
    return res.status(400).json({error:'message is required'})

  const logentry={
    message
    ,timestamp:new Date().toISOString()
  };

  logs.push(logentry);
  res.status(201).json({ success: true, log: logentry });
})


app.get('/log', (req, res) => {
  res.json(logs);
});

app.listen(PORT, () => {
  console.log(`✅ Server is listening on http://localhost:${PORT}`);
});
