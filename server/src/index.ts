import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
// ROUTE IMPORT 
// import TenantRoutes from "./routes/tenantRoutes.js";
// CONFIGURATION
dotenv.config();
const app = express();
app.use(express.json())
app.use(helmet.crossOriginOpenerPolicy({ policy: "same-origin"}));
app.use(morgan("common"))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:false }))
app.use(cors());
// ROUTES  
// app.use("/api",TenantRoutes); 
app.get("/",(req,res)=>{
    res.send("this is home page")
})
// SERVER
const port = process.env.PORT || 3002;
console.log(port)
app.listen(port,()=>{
   console.log(`Server is running on port http://localhost:${port}/`)
})