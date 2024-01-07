import express from "express";
import mongoose from "./utils/mongoose.js";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT  || 5555;

app.get("/", (req, res) => {
  const currentUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  console.log('Current URL:', currentUrl);

  res.send('Hello World');});

app.use("/users", authRoutes);
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
