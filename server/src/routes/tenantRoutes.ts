import { Router } from "express";
import { CreateTenant, GetTenant ,updateTenant,getCurrentResidences,
  addFavoriteProperty,
  removeFavoriteProperty,} from "../controllers/tenantControllers";
import { authMiddleware } from "../middlewares/authMiddleware";
const router = Router();
router.get("/:cognitoId",authMiddleware(["tenant"]),GetTenant);
router.post("/",authMiddleware(["tenant"]),CreateTenant);
router.put("/:cognitoId", updateTenant);
router.get("/:cognitoId/current-residences",getCurrentResidences);
router.post("/:cognitoId/favorites/:propertyId",addFavoriteProperty);
router.delete("/:cognitoId/favorites/:propertyId", removeFavoriteProperty)
export default router;