// Simple login system - you can replace with real authentication later
const validUsers = [
    { username: 'admin', password: 'password123' },
    { username: 'user', password: '12345' },
    { username: 'demo', password: 'demo' }
  ];
  
  const loginForm = document.getElementById('loginForm');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const loginBtn = document.getElementById('loginBtn');
  const message = document.getElementById('message');
  const toggleSignupBtn = document.getElementById('toggleSignup');
  
  // Check if user is already logged in
  window.onload = function() {
    const loggedInUser = localStorage.getItem('currentUser');
    if (loggedInUser) {
      showMessage('You are already logged in! Redirecting...', 'success');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
    }
  };
  
  function showMessage(text, type) {
    message.textContent = text;
    message.className = `message ${type}`;
    message.style.display = 'block';
  }
  
  function clearMessage() {
    message.style.display = 'none';
    message.textContent = '';
  }
  
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    
    if (!username || !password) {
      showMessage('Please fill in both fields', 'error');
      return;
    }
    
    // Check if user exists
    const user = validUsers.find(u => u.username === username && u.password === password);
    
    if (user) {
      // Login successful
      localStorage.setItem('currentUser', username);
      showMessage('Login successful! Redirecting...', 'success');
      
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
    } else {
      showMessage('Invalid username or password', 'error');
    }
  });
  
  // Clear message when user starts typing
  usernameInput.addEventListener('input', clearMessage);
  passwordInput.addEventListener('input', clearMessage);
  
  // Simple signup toggle (you can expand this later)
  toggleSignupBtn.addEventListener('click', function() {
    showMessage('Signup feature coming soon! Use demo/demo to login.', 'error');
  });