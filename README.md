# PassMan 🔐 – Password Manager App

PassMan is a full-stack password manager application built with React.js, Tailwind CSS, Node.js, and MongoDB. It allows users to securely store, view, update, and delete their login credentials in a clean, responsive UI.

## 🚀 Features

- ⚡ Full CRUD operations for passwords
- 🧠 Real-time validation for domain names and duplicates
- 👀 Toggle password visibility
- 📋 One-click copy to clipboard for usernames and passwords
- 📱 Responsive, mobile-friendly design using Tailwind CSS
- 🔐 Delete confirmation popup with UI feedback (shake animation)
- 🎯 Modular React components and context-based state management

## 📦 Tech Stack

### Frontend:
- React.js
- Tailwind CSS
- React Context API
- Toastify (for notifications)

### Backend:
- Node.js
- Express.js
- MongoDB (via MongoDB Node driver)

## 🛠️ Installation

### Prerequisites:
- Node.js and npm
- MongoDB (running locally)

### Clone the repository:
```bash
git clone https://github.com/yourusername/passman.git
cd passman
```
## 🛠️ Installation

### Install Frontend Dependencies

```
npm install
```
### Install Frontend Dependencies
```
npm install express dotenv cors mongodb body-parser
```
## 🧪 Running the App

### 1. Start MongoDB (if not already running)

```
mongod
```
### 2. Start the Backend Server

```
node server.js
```
### 3. Start the React App
```
npm run dev
```
Your app should now be running at:

- ➡️ **Frontend**: [http://localhost:5173](http://localhost:5173)
- ➡️ **Backend**: [http://localhost:3000](http://localhost:3000)


## 📁 Project Structure

```
/backend
    .
    .
    .
  server.js
/src
  /assets
    /icons
  /components
    Navbar.jsx
    AddWindow.jsx
  /context
    AddWindowContext.jsx
  App.jsx
  App.css
  index.css
  main.jsx
```

## 🌐 API Endpoints

| Method | Endpoint | Description                   |
|--------|----------|-------------------------------|
| GET    | `/`      | Fetch all saved passwords     |
| POST   | `/`      | Add a new password            |
| PUT    | `/`      | Update existing password      |
| DELETE | `/`      | Delete password by site name  |

---

## ✅ Validations

- ✅ Valid domain format (e.g., `example.com`)
- ❌ No duplicate site names allowed
- 📝 Required fields: `site` and `password`

---

## 🧹 Future Improvements

- 🔒 User authentication & authorization
- 🔐 Password encryption (currently stored in plaintext)
- 📤 Export/import functionality
- 🔍 Search & filter by site
- 🌗 Dark/light theme toggle

---

⭐ **Feel free to star the repo if you find it useful!**
