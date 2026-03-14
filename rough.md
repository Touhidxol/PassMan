Below is a **short but complete improvement checklist** with **what to change and how to do it**. 🚀

---

# 1️⃣ Link Passwords to a User (MOST IMPORTANT)

Right now passwords look like:

```json
{
  "site": "github.com",
  "username": "abc",
  "password": "123"
}
```

You must add **userId**.

### New structure

```json
{
  "userId": "64fa2c...",
  "site": "github.com",
  "username": "abc",
  "password": "123"
}
```

---

### How to implement

Since your `requireAuth` middleware verifies JWT, it should attach the user to the request.

Example middleware improvement:

```js
import jwt from "jsonwebtoken";

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Authorization required" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // contains userId
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

export default requireAuth;
```

Now every route has:

```
req.user.id
```

---

# 2️⃣ Save Passwords With the Logged-In User

Update **POST /**

```js
app.post("/", async (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection("passwords");

    const password = {
        ...req.body,
        userId: req.user.id
    };

    const result = await collection.insertOne(password);

    res.send({ success: true, result });
});
```

Now passwords belong to a user.

---

# 3️⃣ Only Return That User’s Passwords

Update **GET /**

```js
app.get("/", async (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection("passwords");

    const passwords = await collection
        .find({ userId: req.user.id })
        .toArray();

    res.json(passwords);
});
```

Now users see **only their passwords**.

---

# 4️⃣ Protect Delete

Currently:

```
deleteOne({ site })
```

That lets someone delete another user’s password.

Fix it:

```js
app.delete("/", async (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection("passwords");

    const result = await collection.deleteOne({
        site: req.body.site,
        userId: req.user.id
    });

    res.send({ success: true, result });
});
```

---

# 5️⃣ Protect Update

Update **PUT /**

```js
const result = await collection.updateOne(
  { site, userId: req.user.id },
  { $set: fieldsToUpdate }
);
```

Now users **can only edit their own passwords**.

---

# 6️⃣ Send Token in Frontend Requests

Every request must include JWT.

Example:

```javascript
const token = localStorage.getItem("token");

fetch("http://localhost:3000/", {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
```

Do this for:

```
GET
POST
PUT
DELETE
```

---

# 7️⃣ Move Password Routes to Separate File

Instead of keeping them in `server.js`.

Create:

```
routes/passwordRoutes.js
```

Example:

```js
import express from "express";
const router = express.Router();

router.get("/", getPasswords);
router.post("/", savePassword);
router.put("/", updatePassword);
router.delete("/", deletePassword);

export default router;
```

Then in server:

```js
import passwordRoutes from "./routes/passwordRoutes.js";

app.use("/api/passwords", requireAuth, passwordRoutes);
```

Cleaner architecture.

---

# 8️⃣ Do NOT Use Two MongoDB Clients

You are using:

```
mongoose
MongoClient
```

Pick **one**.

Best option:

Use **mongoose everywhere**.

Create model:

```
models/Password.js
```

Example:

```js
import mongoose from "mongoose";

const passwordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  site: String,
  username: String,
  password: String
});

export default mongoose.model("Password", passwordSchema);
```

Much cleaner queries.

---

# 9️⃣ Hash User Passwords

In user registration use:

```
bcrypt
```

Install:

```
npm install bcrypt
```

Example:

```js
import bcrypt from "bcrypt";

const hashedPassword = await bcrypt.hash(password, 10);
```

Store hashed version only.

---

# 🔟 Encrypt Stored Passwords (Optional but Advanced)

Currently passwords are stored **plain text**.

Better:

```
npm install crypto-js
```

Encrypt before saving.

Example:

```js
import CryptoJS from "crypto-js";

const encrypted = CryptoJS.AES.encrypt(
  password,
  process.env.SECRET_KEY
).toString();
```

Decrypt when returning.

---

# 1️⃣1️⃣ Use Environment Variables

Create `.env`

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/passman
JWT_SECRET=supersecret
```

Then:

```js
mongoose.connect(process.env.MONGO_URI);
```

---

# 1️⃣2️⃣ Better Folder Structure

Recommended backend structure:

```
backend
│
├── models
│   ├── User.js
│   └── Password.js
│
├── routes
│   ├── userRoutes.js
│   └── passwordRoutes.js
│
├── controllers
│   ├── userController.js
│   └── passwordController.js
│
├── middlewares
│   └── requireAuth.js
│
├── config
│   └── db.js
│
└── server.js
```

This is **industry standard Express structure**.

---

# 1️⃣3️⃣ Change Frontend API URLs

Instead of:

```
http://localhost:3000/
```

Use:

```
/api/passwords
```

Example:

```javascript
fetch("http://localhost:3000/api/passwords")
```

---

# Final Architecture

```
Frontend (React)
      ↓
JWT Token
      ↓
Backend Middleware
(requireAuth)
      ↓
req.user.id
      ↓
MongoDB query with userId
      ↓
Return only that user's passwords
```

Result:

```
User A → sees only their passwords
User B → sees only their passwords
```

---

# ⭐ 3 BIGGEST Improvements to do
If you only implement these **your app becomes production-level**:

1️⃣ Add **userId to passwords**
2️⃣ Filter all queries using **userId**
3️⃣ Send **JWT token in frontend requests**

---

