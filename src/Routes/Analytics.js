import { Router } from 'express';
import{getRobotAnalyticsByEmail } from "../Controllers/robotAnalytics.js"

const router = Router();


router.get('/analytics/:emailId', getRobotAnalyticsByEmail);


export default router;
