import { Router } from 'express';
import { bookSession ,getBlockedDates,getAllSessions,getCustomerDataById,updateSessionStatus} from "../Controllers/bookingsesssion.js"

const router = Router();

router.post('/book-session', bookSession);
router.get('/blocked-dates', getBlockedDates);


router.get('/sessions', getAllSessions);
router.get('/sessions/:id', getCustomerDataById);
router.patch("/sessions/status", updateSessionStatus);

export default router;

