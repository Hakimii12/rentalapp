import { Router } from "express";
import { CreateTenant, GetTenant } from "../controllers/tenantControllers";
import { authMiddleware } from "../middlewares/authMiddleware";
const router = Router();
router.get("/:cognitoId",authMiddleware(["tenant"]),GetTenant);
router.post("/",authMiddleware(["tenant"]),CreateTenant);
export default router;