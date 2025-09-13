# Daily Fuel - Personal Motivation Tracker

A simple web app to track your daily motivation, goals, and reflections with user login functionality.

## 📁 File Structure

```
daily-fuel/
├── backend/
│   ├── server.js          # Updated server with user auth
│   ├── package.json       # Backend dependencies
│   └── .env              # MongoDB connection string
├── frontend/
│   ├── login.html         # Login page
│   ├── login.js          # Login functionality
│   ├── login-style.css   # Login page styles
│   ├── index.html        # Main app (updated)
│   ├── app.js           # Main app logic (updated)
│   └── style.css        # Main app styles (no Tailwind)
└── README.md
```

## 🚀 How to Run

### 1. Backend Setup
```bash
cd backend
npm install
# Add your MongoDB URI to .env file
npm run dev
```

### 2. Frontend Setup
- Open `login.html` in your browser
- Or serve with a simple HTTP server:
```bash
cd frontend
python -m http.server 8080
# Visit http://localhost:8080/login.html
```

## 🔐 Login Credentials

For testing, use these credentials:
- Username: `demo`, Password: `demo`
- Username: `admin`, Password: `password123`
- Username: `user`, Password: `12345`

## ✨ Features

### Login System
- Simple username/password authentication
- User session stored in localStorage
- Automatic redirect if not logged in
- Logout functionality

### Main App
- Daily motivation tracking
- Goal setting (2 goals per day)
- Reflection and day rating
- View previous entries
- User-specific data storage
- Clean CSS (no Tailwind dependencies)

### Backend
- Express.js server
- MongoDB for data storage
- User-specific data separation
- Simple authentication (expandable)
- CORS enabled for frontend

## 🔧 Customization

### Adding Real Authentication
To make this production-ready:

1. **Hash passwords** in the backend:
```bash
npm install bcrypt
```

2. **Add JWT tokens** for sessions:
```bash
npm install jsonwebtoken
```

3. **Add input validation**:
```bash
npm install express-validator
```

### Adding More Features
- Email verification
- Password reset
- User profiles
- Goal completion tracking
- Data export
- Dark mode toggle

## 📝 API Endpoints

- `POST /login` - User authentication
- `POST /signup` - Create new user
- `GET /quote` - Get random motivational quote
- `POST /summary` - Save daily entry
- `GET /summaries/:username` - Get user's entries
- `GET /summaries` - Get all entries (fallback)

## 🎨 Design

- Clean, modern interface
- Gradient backgrounds
- Smooth animations
- Mobile-responsive design
- No external CSS frameworks
- Custom animations and effects

## 🔄 Workflow

1. User visits `login.html`
2. Enters credentials and logs in
3. Gets redirected to `index.html`
4. Can add daily entries and view history
5. Data is saved to MongoDB with username
6. Can logout and return to login page

## 🛠 Future Improvements

- Real password hashing
- Session management with JWT
- Email notifications
- Goal progress tracking
- Data visualization
- Social features
- Mobile app version