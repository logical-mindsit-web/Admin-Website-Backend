import { Router } from 'express';
import{saveRobotAnalytics,getRobotAnalyticsByEmail } from "../Controllers/robotAnalytics.js"

const router = Router();

router.post('/robotanalytics', saveRobotAnalytics);

router.get('/analytics/:emailId', getRobotAnalyticsByEmail);




export default router;
