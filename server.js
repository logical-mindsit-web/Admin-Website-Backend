import express from 'express';
import dotenv from 'dotenv';
import connectDB from './src/DB/db.js';
import cors from 'cors';
import bodyParser from "body-parser";

// Import routes
import { verifyToken } from './src/Middleware/authMiddleware.js'; 
import adminRouter from './src/Routes/adminRoutes.js';
import usersave from './src/Routes/usersave.js';
import authRoutes from './src/Routes/authRoutes.js';
import userRoutes from './src/Routes/userRoutes.js';
import userRobots from './src/Routes/userRobots.js';
import robotmsgRoutes from "./src/Routes/robotmsgRoutes .js"
import Booking from "./src/Routes/BookingSessionRoute.js"
import robotanalytics from "./src/Routes/Analytics.js"
import robotController from './src/Routes/RobotController.js';
import History from "./src/Routes/History.js"

import appVersion from './src/Routes/versionRoutes.js';
import Appdetails from './src/Routes/Appdetails.js';
import modelImage from "./src/Routes/modelImage.js"


dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));


// Serve static files (images) from the 'images' directory
app.use('/images', express.static('images'));

//Routes
app.use(verifyToken); 
app.use('/', adminRouter);
app.use('/', usersave);
app.use('/', authRoutes);
app.use('/', userRoutes);
app.use('/', userRobots);
app.use('/', robotmsgRoutes);
app.use('/', Booking);
app.use('/', robotanalytics);
app.use('/', appVersion);
app.use('/', Appdetails);
app.use('/', modelImage);
app.use('/', robotController);
app.use('/modes', History);

// Start server
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on port ${PORT}`);
});

