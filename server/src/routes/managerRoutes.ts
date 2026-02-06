import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {  CreateManager, GetManager } from "../controllers/managerController";
const router = Router();
router.get("/:cognitoId",authMiddleware(["manager"]),GetManager);
router.post("/",authMiddleware(["manager"]),CreateManager);
export default router;