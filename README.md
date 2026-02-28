# clarity. — Minimalist To-Do & Habit Tracker

A clean, distraction-free productivity app built with **React + Vite + Firebase**.

## ✨ Features
- ✅ Task management — create, edit, delete, complete
- 🏷️ Priority tags (High / Medium / Low) + custom tags
- 📅 Due dates with browser notifications
- 📆 Calendar view
- 🎯 Focus Mode — working Pomodoro timer (25/5)
- 🔁 Habit Tracker — daily check-ins + streak counter
- 📦 Archive — searchable completed tasks + stats
- 🌙 Dark mode
- 🔄 Real-time sync via Firestore
- 📴 Offline fallback with localStorage

---

## 🚀 Setup — Step by Step

### 1. Install dependencies
```bash
npm install
```

### 2. Create a Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add project"** → name it `clarity` → click through the steps
3. On the project dashboard, click the **web icon `</>`** to add a web app
4. Register the app (name it anything) — you'll see a `firebaseConfig` object. Copy it.

### 3. Enable Authentication
1. In Firebase Console → **Authentication** → **Get started**
2. Click **Email/Password** → Enable it → Save

### 4. Enable Firestore Database
1. In Firebase Console → **Firestore Database** → **Create database**
2. Choose **"Start in test mode"** for now → pick your region (choose `asia-south1` for India) → Done

### 5. Set Firestore Security Rules
1. In Firestore → **Rules** tab
2. Replace everything with the contents of `firestore.rules` in this project → Publish

### 6. Create your `.env` file
```bash
cp .env.example .env
```
Fill in your values from the `firebaseConfig` object you copied:
```
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 7. Run locally
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) — sign up and you're in! ✅

---

---

## 🛠️ Tech Stack
- **React 18** + **Vite**
- **Firebase Auth** — email/password authentication
- **Cloud Firestore** — real-time NoSQL database
- **React Router v6**
- **date-fns**
- **CSS Modules**

<div align="center">
  
## Designed & Developed By Madan Y
 **Email**: madanmadany2004@gmail.com 


</div>
