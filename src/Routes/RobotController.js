import { Router } from 'express';

import {createRobotController} from "../Controllers/robotController.js"
import { verifyToken, verifyRoles } from '../Middleware/authMiddleware.js'; 


const robotController = Router();
robotController.use(verifyToken);


robotController.post("/robot-Controller", verifyRoles('Hr'), createRobotController);



export default robotController

