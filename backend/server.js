import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import passwordRoutes from "./routes/passwordRoutes.js";
import requireAuth from './middlewares/requireAuth.js';

const app = express();
const port = 3000;

dotenv.config();

app.use(bodyParser.json());
app.use(cors());
app.use(requireAuth);

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/passman", {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
});

app.use("/api/users", userRoutes);
app.use("/api/passwords", passwordRoutes);

app.get("/", (req, res) => {
  res.json({ success: true, message: "Passman API is running." });
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
