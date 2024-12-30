import { Router } from 'express';
 
import { verifyToken } from '../Middleware/authMiddleware.js';
import {  saveRobotDetails, getRobotsByEmail,getAllRobots ,deleteRobotDetails } from '../Controllers/userRobotsList.js';

const router = Router();

router.post('/robot' ,verifyToken, saveRobotDetails);
router.get('/robots/:emailId', verifyToken, getRobotsByEmail);
router.get('/robots', getAllRobots);
router.delete('/robots/:robotId', deleteRobotDetails);


export default router;
