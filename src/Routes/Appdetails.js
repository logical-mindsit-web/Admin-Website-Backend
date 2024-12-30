import express from 'express';
import { getVersionAndUserByEmail,updateUserSettings ,updateUserSettingsForAll  } from '../Controllers/appDetailsController.js';

const router = express.Router();

// Route to get version and user details
router.get('/appdetails/:email', getVersionAndUserByEmail);

// Route to update user settings by email
router.put('/update-appdetails/:email', updateUserSettings);

// Route to update manualMapping and objectDisinfection for all users
router.put('/settings/updateAll', updateUserSettingsForAll);

export default router;
