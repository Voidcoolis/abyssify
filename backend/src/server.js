import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";

import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import adminRoutes from "./routes/admin.route.js";
import songRoutes from "./routes/song.route.js";
import albumRoutes from "./routes/album.route.js";
import statRoutes from "./routes/stat.route.js";

dotenv.config(); //you need this to import the PORT from .env

const app = express();
const PORT = process.env.PORT;

app.use(express.json()); //! to parse req.body

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/stats", statRoutes); //*  like total albums or total songs & so on

app.listen(5000, () => {
  console.log("Server is running on port: " + PORT);
  connectDB();
});
