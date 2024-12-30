import { Router } from 'express';
import { saveModelImage ,getModelImageByName ,getModelImages } from '../Controllers/modelImage.js';

const router = Router();

// POST route to save model name and image
router.post('/ModelImage', saveModelImage);

// Route to get model image by name
router.get('/ModelImage/:modelName', getModelImageByName);

// GET route to retrieve all model names and images
router.get('/getModelImages', getModelImages);

export default router;
