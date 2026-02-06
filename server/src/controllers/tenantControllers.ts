import type { Request , Response} from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const GetTenant = async (req:Request<{ cognitoId: string }>,res:Response): Promise<void> => {
    try {
        const {cognitoId} = req.params;
        const tenant = await prisma.tenant.findUnique({
            where:{cognitoId},
            include:{
                favorites:true
            }
        });
        if(tenant){
            res.json(tenant)
        }else{
            res.status(404).json({message:"Tenant not found"});
        }
        res.json(tenant);
    } catch (error:any) {
        res.status(500).json({message:"Error fetching tenant",error});
    }
}