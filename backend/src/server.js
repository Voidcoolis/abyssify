import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import { clerkMiddleware } from "@clerk/express";
import { createServer } from "http";
import { initializeSocket } from "./lib/socket.js";
import fileUpload from "express-fileupload";
import path from "path";
import cors from "cors"
import cron from "node-cron";
import fs from "fs";

import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import adminRoutes from "./routes/admin.route.js";
import songRoutes from "./routes/song.route.js";
import albumRoutes from "./routes/album.route.js";
import statRoutes from "./routes/stat.route.js";

dotenv.config(); //you need this to import the PORT from .env

const __dirname = path.resolve();
const app = express();
const PORT = process.env.PORT;

const httpServer = createServer(app);
initializeSocket(httpServer);

app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
	})
);

app.use(express.json()); //! to parse req.body

// this adds auth to request object(which user is logged in, sending the request)
app.use(clerkMiddleware());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"), //whenever we upload an image or audio it will create a temporary folder under the src
    createParentPath: true, //if the folder doesn't exists, it creates it
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB  max file size
    },
  })
);

// concept called cron jobs that are automated tasks/jobs to handle temperary files (clenup)
//! there is a tmp directory created in the root of the project that stores temporary files like images and audio files
const tempDir = path.join(process.cwd(), "tmp");  //* Get the absolute path to the tmp directory(location of the folder)
cron.schedule("0 * * * *", () => { //* Runs every hour at minute 0
	if (fs.existsSync(tempDir)) { // Check if temp directory exists
		fs.readdir(tempDir, (err, files) => { // Read directory contents
			if (err) {
				console.log("error", err);
				return;
			}
      // Delete each file in the temp directory
			for (const file of files) {
				fs.unlink(path.join(tempDir, file), (err) => {});
			}
		});
	}
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/stats", statRoutes); //*  like total albums or total songs & so on

// Production environment configuration
if (process.env.NODE_ENV === "production") {
  // Serve static files from frontend's dist directory
	app.use(express.static(path.join(__dirname, "../frontend/dist")));
   // Handle all other routes by serving the frontend's index.html
	app.get("*", (req, res) => {    //   "*" means any other routes
		res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
	});
}

// error handler
app.use((err, req, res, next) => {
  res.status(500).json({ message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message });
});

// Start the server and connect to database
httpServer.listen(5000, () => {
  console.log("Server is running on port: " + PORT);
  connectDB();
});