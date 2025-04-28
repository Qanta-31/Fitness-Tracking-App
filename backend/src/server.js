import dotenv from 'dotenv';
// Load environment variables
dotenv.config();

import express from 'express';
import cors from 'cors';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser'



import authRoutes from './routes/auth.route.js'
import activityRoutes from './routes/activity.route.js'
import analyticsRoutes from './routes/analytics.route.js';


import path from 'path'
const __dirname = path.resolve();

// Initialize app
const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/analytics', analyticsRoutes);

// Serve frontend for production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  // console.log("This array is for checking where listeners are added :", process.listeners("exit"));
  connectDB();
});
