import { Router } from 'express';
 
import { verifyToken } from '../Middleware/authMiddleware.js';
import { getAllUsers, deleteUserByEmail, updateUserEmail, getAllUserEmails, getUserDetails ,updateUser,getUserNameByEmail,getUserLocationNamesByEmail,getSubLocationsByLocationName } from '../Controllers/userController.js';

const router = Router();


router.get('/user-details', verifyToken, getAllUsers);

router.get('/user-details/:email',getUserDetails);

router.delete("/user-details/delete",deleteUserByEmail);

router.put('/user-details/update', verifyToken, updateUserEmail);

router.put('/user/:userId', verifyToken, updateUser);

router.get('/user-emails', verifyToken, getAllUserEmails);
router.get('/user-name/:email', verifyToken, getUserNameByEmail);


// Route to get location names based on email
router.get("/user/location-names/:email", getUserLocationNamesByEmail);

// Route to get sub-locations based on email and location name
router.get("/user/:email/location/:locationName/sublocations", getSubLocationsByLocationName);



export default router;
