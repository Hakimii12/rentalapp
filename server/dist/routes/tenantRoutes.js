"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tenantControllers_js_1 = require("../controllers/tenantControllers.js");
const authMiddleware_js_1 = require("../middlewares/authMiddleware.js");
const router = (0, express_1.Router)();
router.get("/:cognitoId", (0, authMiddleware_js_1.authMiddleware)(["tenant"]), tenantControllers_js_1.GetTenant);
exports.default = router;
