import { Router } from 'express';
import { getRobotmsgByRobotId ,getRobotmsgById ,deleteImagesByMessageId,getResolvedCountByRobotId  } from '../Controllers/robotmsgController.js';
import { verifyToken } from '../Middleware/authMiddleware.js'; 

const router = Router();


// Route to get all robot messages
router.get('/robotmsgs/:robotId', verifyToken, getRobotmsgByRobotId );

// Route to get a specific robot message by its ID
router.get('/robotmsgs/message/:id', getRobotmsgById);

// Route to delete only the images array in a robot message by its ID
router.delete('/robotmsgs/message/:id/images', verifyToken, deleteImagesByMessageId);

// Route for getting resolved count
router.get('/robotmsg/resolved-count/:robotId', getResolvedCountByRobotId);

export default router;
