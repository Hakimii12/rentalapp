"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
// ROUTE IMPORT 
const tenantRoutes_1 = __importDefault(require("./routes/tenantRoutes"));
const managerRoutes_1 = __importDefault(require("./routes/managerRoutes"));
const applicationRoutes_1 = __importDefault(require("./routes/applicationRoutes"));
const propertyRoutes_1 = __importDefault(require("./routes/propertyRoutes"));
const leaseRoutes_1 = __importDefault(require("./routes/leaseRoutes"));
// CONFIGURATION
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(helmet_1.default.crossOriginOpenerPolicy({ policy: "same-origin" }));
app.use((0, morgan_1.default)("common"));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)());
// ROUTES  
app.use("/tenant", tenantRoutes_1.default);
app.use("/manager", managerRoutes_1.default);
app.use("/applications", applicationRoutes_1.default);
app.use("/properties", propertyRoutes_1.default);
app.use("/leases", leaseRoutes_1.default);
app.get("/", (req, res) => {
    res.send("this is home page");
});
// SERVER
const port = process.env.PORT || 3002;
console.log(port);
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}/`);
});
