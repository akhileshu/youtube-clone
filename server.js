import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config"; //.env
import express from "express";  

import { errorHandler } from "./middlewares/errorHandling.js";
import authRoutes from "./routes/auth.js";
import commentRoutes from "./routes/comment.js";
import userRoutes from "./routes/user.js";
import videoRoutes from "./routes/video.js";


// for using path
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { connectToDb } from "./config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Now you can use __dirname as you normally would in CommonJS modules.
// db
// import "./config/db.js";
connectToDb(); //you are now connected to db


const app = express();
// server build folder
app.use(express.static(path.resolve(__dirname, "build")));
app.use(express.json());
// Enable extended URL-encoded data parsing
app.use(express.urlencoded({ extended: true }));
// Allow requests from any origin
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true, // Enable cookies and other credentials
  })
);// Allow requests from a specific origin (e.g., your Vercel-hosted frontend)
// app.use(cors({
//   origin: 'https://your-vercel-app.vercel.app',
// }));
app.use(cookieParser());

// routes

// i have removed the /api prefix because we set then in proxy in react buit it's not set in build folder now
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/video", videoRoutes);
app.use("/comment", commentRoutes);

app.get("*", (req, res) => {
  // incase user reloads page
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
});
// error handler
app.use(errorHandler);

app.listen(4000, () => console.log("server started at port 4000"));
