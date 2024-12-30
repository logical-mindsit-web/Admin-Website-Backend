import { Router } from 'express';
const router = Router();
import { bookSession ,getBlockedDates} from "../Controllers/bookingsesssion.js"


router.post('/book-session', bookSession);
router.get('/blocked-dates', getBlockedDates);

export default router;