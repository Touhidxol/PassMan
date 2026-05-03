# PassMan

> A production-grade, full-stack password manager built with the **MERN stack** — featuring AES-256 encryption, JWT authentication, and a clean responsive dashboard.

<p align="center">
  <a href="https://pass-man-lyart.vercel.app/">
    <img src="frontend/public/favicon.svg" alt="PassMan Logo" width="80" />
  </a>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-project-structure">Structure</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-api-reference">API Reference</a> •
  <a href="#-frontend-routes">Frontend Routes</a> •
  <a href="#-environment-variables">Environment Variables</a> •
  <a href="#-deployment">Deployment</a> •
  <a href="#-contributing">Contributing</a>
</p>

---

## ✨ Features

| Category              | Feature                                                                                  |
| --------------------- | ---------------------------------------------------------------------------------------- |
| 🔐 **Security**       | AES-256-CBC password encryption, bcrypt master-password hashing, HTTP-only JWT cookies   |
| 🛡️ **Auth**           | Registration, Login, Logout, JWT token refresh, OTP-based password reset via email       |
| 📦 **Vault**          | Full CRUD for stored passwords — add, view, edit, delete                                 |
| ⭐ **Favorites**      | Star any credential for quick access                                                     |
| 🔍 **Search & Sort**  | Real-time search + sort by date, A–Z, Z–A, password strength                             |
| 💪 **Strength Meter** | Live password strength bar with actionable improvement tips                              |
| 🎲 **Generator**      | Cryptographically random password generator with configurable rules                      |
| 📊 **Statistics**     | Vault health dashboard — strength breakdown, weak-password alerts                        |
| ⚙️ **Settings**       | Update display name, change master password, export/import (coming soon), delete account |
| 🌗 **Theming**        | Full dark/light mode via CSS custom properties                                           |
| 📱 **Responsive**     | Mobile-first layout with collapsible sidebar                                             |
| 🚦 **Rate Limiting**  | Per-route rate limiting (auth: 20/15min, API: 150/15min)                                 |
| 🪖 **Helmet**         | Security headers on every response                                                       |

---

## 🧰 Tech Stack

### Frontend

| Package          | Version | Purpose                  |
| ---------------- | ------- | ------------------------ |
| React            | 19      | UI framework             |
| Vite             | 7       | Build tool & dev server  |
| Tailwind CSS     | 4       | Utility-first styling    |
| Framer Motion    | 12      | Animations & transitions |
| React Router DOM | 7       | Client-side routing      |
| Lucide React     | 0.576   | Icon set                 |
| React Hot Toast  | 2       | Toast notifications      |

### Backend

| Package            | Version | Purpose                         |
| ------------------ | ------- | ------------------------------- |
| Express            | 5       | HTTP server & routing           |
| Mongoose           | 8       | MongoDB ODM                     |
| bcrypt             | 5       | Password hashing                |
| jsonwebtoken       | 9       | JWT auth tokens                 |
| nodemailer         | 8       | OTP email delivery              |
| helmet             | 8       | Security headers                |
| express-rate-limit | 8       | Rate limiting                   |
| morgan             | 1       | HTTP request logging            |
| cors               | 2       | Cross-origin resource sharing   |
| cookie-parser      | 1       | HTTP-only cookie parsing        |
| validator          | 13      | Input validation & sanitisation |
| dotenv             | 17      | Environment variable loading    |

---

## 📁 Project Structure

```
PassMan/
├── backend/
│   ├── controllers/
│   │   ├── users.js              # Register, login, logout, profile CRUD
│   │   ├── passwords.js          # Vault CRUD (encrypt/decrypt)
│   │   ├── forgotPassword.js     # OTP generation & password reset
│   │   └── refreshToken.js       # JWT silent refresh
│   ├── middlewares/
│   │   ├── requireAuth.js        # JWT verification guard
│   │   └── validate.js           # Input validation for all routes
│   ├── models/
│   │   ├── user.js               # User schema (name, email, password, OTP)
│   │   └── password.js           # Password schema (site, username, encrypted pw, note, favorite)
│   ├── routes/
│   │   ├── userRoutes.js         # /api/users/*
│   │   ├── passwordRoutes.js     # /api/passwords/*
│   │   └── otpRoutes.js          # /api/auth/* (OTP)
│   ├── utils/
│   │   ├── crypto.js             # AES-256-CBC encrypt/decrypt helpers
│   │   └── email.js              # Nodemailer OTP email sender
│   ├── .env.example
│   ├── package.json
│   ├── render.yaml               # Render.com deployment reference
│   └── server.js                 # App entry point
│
├── frontend/
│   ├── public/
│   │   ├── favicon.svg
│   │   └── vite.svg
│   ├── src/
│   │   ├── animations/
│   │   │   └── index.jsx         # Framer Motion wrappers (Fade, SlideLeft, Scale)
│   │   ├── api/
│   │   │   ├── users.js          # Auth API calls (login, register, logout, me)
│   │   │   ├── passwords.js      # Vault API calls (CRUD)
│   │   │   └── otp.js            # OTP API calls (sendOTP, resetPassword)
│   │   ├── assets/
│   │   │   └── icons/            # SVG icons (Material Symbols)
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   └── Modal.jsx     # Base modal (Escape key, backdrop click, scroll lock)
│   │   │   ├── AddSiteModal.jsx
│   │   │   ├── PasswordCard.jsx
│   │   │   ├── PasswordGeneratorModal.jsx
│   │   │   ├── PasswordStrengthBar.jsx
│   │   │   ├── DeleteConfirmModal.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── GenerateButton.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── MobileSidebar.jsx
│   │   │   ├── DashboardNavbar.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   ├── InputTemplate.jsx  # Floating-label auth inputs
│   │   │   ├── FeatureCard.jsx
│   │   │   ├── StepCard.jsx
│   │   │   ├── TechBadge.jsx
│   │   │   └── Footer.jsx
│   │   ├── context/
│   │   │   ├── AddSiteModalContext.jsx
│   │   │   ├── GeneratorModalContext.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── hooks/
│   │   │   ├── usePasswords.js    # Vault state + CRUD actions
│   │   │   ├── usePasswordCard.js # Card open/delete/update state
│   │   │   ├── useSearch.js       # Search + sort logic
│   │   │   └── useAddSiteModal.js # Modal context accessor
│   │   ├── layouts/
│   │   │   └── DashboardLayout.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx           # Landing page
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ForgotPassword.jsx # 3-step OTP flow
│   │   │   ├── Passwords.jsx      # Main vault page
│   │   │   ├── Favorites.jsx
│   │   │   ├── Stats.jsx
│   │   │   └── Settings.jsx
│   │   ├── utils/
│   │   │   ├── passwordGenerator.js  # Crypto-random password generator
│   │   │   └── passworStrength.js    # Strength scoring + suggestions
│   │   ├── App.jsx
│   │   ├── App.css               # Keyframe animations only
│   │   ├── index.css             # Design tokens + all utility classes
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── vercel.json               # SPA rewrite rule for Vercel
│   └── vite.config.js
│
├── .gitignore
├── package.json                  # Root — runs both servers concurrently
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 20.19.0
- **npm** ≥ 8
- **MongoDB** — local instance or [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Gmail account** — for OTP emails (App Password required)

### 1 — Clone the repository

```bash
git clone https://github.com/Touhidxol/PassMan.git
cd PassMan
```

### 2 — Install all dependencies

```bash
# Install root dev-dependencies (concurrently)
npm install

# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### 3 — Configure environment variables

**Backend** — copy and fill in `backend/.env`:

```bash
cp backend/.env.example backend/.env
```

```env
MONGO_URI=mongodb://localhost:27017/passman
PORT=3000
NODE_ENV=development
JWT_SECRET=your_64_char_random_hex_string
ENCRYPTION_KEY=your_32_char_random_string
ENCRYPTION_SALT=your_32_char_random_string
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
FRONTEND_URL=http://localhost:5173
```

**Frontend** — copy and fill in `frontend/.env`:

```bash
cp frontend/.env.example frontend/.env
```

```env
VITE_API_URL=http://localhost:3000
```

> **Tip:** Generate secure secrets with:
>
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

### 4 — Start the development servers

```bash
# From the project root — starts both backend and frontend concurrently
npm run dev
```

Or run them separately:

```bash
# Terminal 1 — Backend (nodemon)
npm run backend

# Terminal 2 — Frontend (Vite)
npm run frontend
```

| Service     | URL                   |
| ----------- | --------------------- |
| Frontend    | http://localhost:5173 |
| Backend API | http://localhost:3000 |

---

## 🌐 Frontend Routes

| Path                   | Page                                          | Auth Required |
| ---------------------- | --------------------------------------------- | ------------- |
| `/`                    | Landing / marketing page                      | No            |
| `/login`               | Sign in                                       | No            |
| `/register`            | Create account                                | No            |
| `/forgot-password`     | 3-step OTP password reset                     | No            |
| `/dashboard`           | Redirects to `/dashboard/passwords`           | ✅ Yes        |
| `/dashboard/passwords` | All saved passwords (search, sort, CRUD)      | ✅ Yes        |
| `/dashboard/favorites` | Starred passwords                             | ✅ Yes        |
| `/dashboard/stats`     | Vault health & strength breakdown             | ✅ Yes        |
| `/dashboard/settings`  | Account info, password change, delete account | ✅ Yes        |

> Protected routes are guarded by `ProtectedRoute.jsx`, which calls `/api/users/me` on mount and redirects to `/login` on `401`.

---

## 📡 API Reference

Base URL: `http://localhost:3000`

All protected routes require a valid `token` cookie set by `/api/users/login` or `/api/users/register`.

### Auth — `/api/users`

| Method   | Endpoint                 | Auth | Body                               | Description                    |
| -------- | ------------------------ | ---- | ---------------------------------- | ------------------------------ |
| `POST`   | `/api/users/register`    | No   | `{ name, email, password }`        | Create account, set cookie     |
| `POST`   | `/api/users/login`       | No   | `{ email, password }`              | Login, set cookie              |
| `POST`   | `/api/users/logout`      | ✅   | —                                  | Clear cookie                   |
| `GET`    | `/api/users/me`          | ✅   | —                                  | Get current user info          |
| `POST`   | `/api/users/refresh`     | No   | —                                  | Silent token refresh           |
| `PATCH`  | `/api/users/me`          | ✅   | `{ name }`                         | Update display name            |
| `PATCH`  | `/api/users/me/password` | ✅   | `{ currentPassword, newPassword }` | Change master password         |
| `DELETE` | `/api/users/me`          | ✅   | —                                  | Delete account + all passwords |

### OTP / Password Reset — `/api/auth`

| Method | Endpoint                    | Auth | Body                          | Description                   |
| ------ | --------------------------- | ---- | ----------------------------- | ----------------------------- |
| `POST` | `/api/auth/forgot-password` | No   | `{ email }`                   | Send 6-digit OTP to email     |
| `POST` | `/api/auth/reset-password`  | No   | `{ email, otp, newPassword }` | Verify OTP and reset password |

### Vault — `/api/passwords`

> All vault routes require the `token` cookie.

| Method   | Endpoint             | Body                                                         | Description                                    |
| -------- | -------------------- | ------------------------------------------------------------ | ---------------------------------------------- |
| `GET`    | `/api/passwords`     | —                                                            | Get all passwords (decrypted) for current user |
| `POST`   | `/api/passwords`     | `{ site, username, password, note? }`                        | Add new password (encrypted)                   |
| `PUT`    | `/api/passwords/:id` | Any subset of `{ site, username, password, note, favorite }` | Update a password                              |
| `DELETE` | `/api/passwords/:id` | —                                                            | Delete a password                              |

### Response format

Success:

```json
{
  "_id": "...",
  "site": "example.com",
  "username": "user@example.com",
  "password": "decrypted-plain-text",
  "note": "Work account",
  "favorite": false,
  "createdAt": "...",
  "updatedAt": "..."
}
```

Error:

```json
{
  "success": false,
  "message": "Human-readable error description"
}
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable          | Required | Description                                           |
| ----------------- | -------- | ----------------------------------------------------- |
| `MONGO_URI`       | ✅       | MongoDB connection string                             |
| `PORT`            | ✅       | Server port (default `3000`)                          |
| `NODE_ENV`        | ✅       | `development` or `production`                         |
| `JWT_SECRET`      | ✅       | Secret for signing JWT tokens (64+ chars recommended) |
| `ENCRYPTION_KEY`  | ✅       | Key for AES-256-CBC encryption (32+ chars)            |
| `ENCRYPTION_SALT` | ✅       | Salt for scrypt key derivation (32+ chars)            |
| `EMAIL_USER`      | ⚠️       | Gmail address for sending OTP emails                  |
| `EMAIL_PASS`      | ⚠️       | Gmail App Password (not your Gmail login password)    |
| `FRONTEND_URL`    | ✅       | Allowed CORS origin(s), comma-separated in production |

> ⚠️ `EMAIL_USER` and `EMAIL_PASS` are optional for local dev — OTP features will fail gracefully without them.

### Frontend (`frontend/.env`)

| Variable       | Required | Description                                     |
| -------------- | -------- | ----------------------------------------------- |
| `VITE_API_URL` | ✅       | Backend base URL (e.g. `http://localhost:3000`) |

---

## 🚢 Deployment

### Frontend → Vercel

1. Push your repo to GitHub.
2. Import the repo on [vercel.com](https://vercel.com).
3. Set **Root Directory** to `frontend`.
4. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com`
5. Deploy. The `vercel.json` SPA rewrite rule is already in place.

### Backend → Render

1. Create a new **Web Service** on [render.com](https://render.com).
2. Connect your GitHub repo.
3. Set **Root Directory** to `backend`.
4. **Build command:** `npm install`
5. **Start command:** `node server.js`
6. Add all required environment variables (see table above).
7. Set `FRONTEND_URL` to your Vercel frontend URL.

> See `backend/render.yaml` for a full annotated reference.

### MongoDB → Atlas

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Whitelist `0.0.0.0/0` (or Render's IP range) in Network Access.
3. Create a database user and copy the connection string into `MONGO_URI`.

---

## 🔒 Security Design

| Layer             | Mechanism                                                                        |
| ----------------- | -------------------------------------------------------------------------------- |
| Passwords at rest | AES-256-CBC with scrypt-derived key — raw passwords never stored                 |
| Master password   | bcrypt (cost 10) — irreversible, never recoverable                               |
| Session           | HTTP-only, Secure, SameSite JWT cookie — not accessible to JavaScript            |
| Transport         | HTTPS enforced in production via Render/Vercel                                   |
| Input             | `validator.js` sanitisation on every route before hitting the DB                 |
| Headers           | `helmet.js` sets CSP, HSTS, X-Frame-Options, etc.                                |
| Brute-force       | `express-rate-limit` — 20 req/15min on auth, 150 req/15min on API                |
| OTP               | 6-digit numeric, 10-minute expiry, bcrypt-hashed before storage (via reset flow) |

---

## 🛣️ Roadmap

### Phase 1 — Complete ✅

- [x] User registration, login, logout
- [x] JWT authentication with HTTP-only cookies + silent refresh
- [x] AES-256-CBC password encryption
- [x] Full vault CRUD
- [x] Password strength meter + generator
- [x] Favorites, search & sort
- [x] Statistics page
- [x] Settings page (name, password, delete account)
- [x] OTP-based password reset via email
- [x] Rate limiting, helmet, input validation
- [x] Responsive layout, dark/light mode
- [x] Error boundary
- [x] Landing page

### Phase 2 — In Progress 🔄

- [ ] Export passwords (encrypted JSON / CSV)
- [ ] Import passwords from CSV / JSON
- [ ] Pagination or virtual scrolling for large vaults

### Phase 3 — Planned 📋

- [ ] Two-factor authentication (TOTP / FIDO2)
- [ ] Browser extension
- [ ] Password breach check (Have I Been Pwned API)
- [ ] Tags / folders for organization
- [ ] Shared vaults (team passwords)
- [ ] Docker Compose setup
- [ ] Full test suite (Vitest + Supertest)

---

## 🤝 Contributing

Contributions are welcome and appreciated!

---

## 📄 License

ISC © [Touhidxol](https://github.com/Touhidxol)

---

<p align="center">
  Built with ❤️ using React · Node.js · MongoDB
</p>
