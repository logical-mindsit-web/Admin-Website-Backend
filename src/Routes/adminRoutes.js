import { Router } from 'express';
import {createAdmin , getAllAdminDetails,deleteAdminByEmail,updateAdminDetails ,getAdminDetails } from "../Controllers/adminController.js"
import { verifyToken, verifyRoles } from '../Middleware/authMiddleware.js'; 


const adminRouter = Router();
adminRouter.use(verifyToken);


adminRouter.post("/register-admin", createAdmin);
adminRouter.get("/admin-details", verifyRoles('Hr', 'ProjectManager'),  getAllAdminDetails);
adminRouter.delete("/admin-details/delete",  verifyRoles('Hr', 'ProjectManager'),  deleteAdminByEmail);
adminRouter.put('/admin-details/update', verifyRoles('Hr', 'ProjectManager'),  updateAdminDetails);
adminRouter.get('/admin-details/:email',getAdminDetails)


export default adminRouter

