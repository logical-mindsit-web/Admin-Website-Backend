import express from 'express';
import { createAppVersion,updateAppVersion } from '../Controllers/Version.js';

const router = express.Router();

// Route to create a new app version entry
router.post('/app-version', createAppVersion);

// Route for updating the existing version
router.put("/update-versions", updateAppVersion);

export default router;
