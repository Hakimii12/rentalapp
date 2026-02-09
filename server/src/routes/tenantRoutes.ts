import { Router } from "express";
import { CreateTenant, GetTenant ,updateTenant,} from "../controllers/tenantControllers";
import { authMiddleware } from "../middlewares/authMiddleware";
const router = Router();
router.get("/:cognitoId",authMiddleware(["tenant"]),GetTenant);
router.post("/",authMiddleware(["tenant"]),CreateTenant);
router.put("/:cognitoId", updateTenant);
export default router;