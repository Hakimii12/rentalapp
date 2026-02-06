import { Router } from "express";
import { GetTenant } from "../controllers/tenantControllers.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const router = Router();
router.get("/:cognitoId",authMiddleware(["tenant"]),GetTenant);
export default router;