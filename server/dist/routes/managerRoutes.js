"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const managerController_1 = require("../controllers/managerController");
const router = (0, express_1.Router)();
router.get("/:cognitoId", (0, authMiddleware_1.authMiddleware)(["manager"]), managerController_1.GetManager);
router.post("/", (0, authMiddleware_1.authMiddleware)(["manager"]), managerController_1.CreateManager);
exports.default = router;
