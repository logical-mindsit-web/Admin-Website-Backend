import { Router } from "express";
import {getModeRobotId,getAllModes} from "../Controllers/historyController.js"

const router = Router();

router.get("/historys/get", getModeRobotId);

// New API to get all modes
router.get("/AutoDisinfection-Analytics", getAllModes);


export default router;
