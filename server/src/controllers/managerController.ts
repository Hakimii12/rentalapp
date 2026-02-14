import type { Request , Response} from "express";
import { PrismaClient } from "@prisma/client";
import { wktToGeoJSON } from "@terraformer/wkt";
const prisma = new PrismaClient();
export const GetManager = async (req:Request<{ cognitoId: string }>,res:Response): Promise<void> => {
    try {
        const {cognitoId} = req.params;
        const manager = await prisma.manager.findUnique({
            where:{cognitoId}
        });
        if(manager){
            res.json(manager)
        }else{
            res.status(404).json({message:"Manager not found"});
        }
    } catch (error:any) {
        res.status(500)
        .json({message:"Error fetching manager",error});
    }
}
export const CreateManager = async (req:Request,res:Response): Promise<void> => {
    try {
        const {cognitoId,name,email,phoneNumber} = req.body;
        const manager = await prisma.manager.create({
            data:{
                cognitoId,
                name,
                email,
                phoneNumber
            }
        });
        if(manager){
          res.json(manager);  
        }else{
            res.status(400).json({message:"Error creating manager"});
        }
        
    } catch (error:any) {
        res.status(500)
        .json({message:"Error creating manager",error});
    }
}
export const getManagerProperties = async(req:Request,res:Response):Promise<void>=>{
    try {
        const {cognitoId} = req.params;
        const properties =  await prisma.property.findMany({
            where:{managerCognitoId:cognitoId as string},
            include:{
                location:true
            }
        });
        const propertiesWithFormattedLocation = await Promise.all(
         properties.map(async(property)=>{
            const coordinates:{coordinates:string}[]=await 
            prisma.$queryRaw`SELECT ST_asText(coordinates) as coordinates from "Location" where id=${property.location.id}`
            const geoJSON:any = wktToGeoJSON(coordinates[0]?.coordinates||"");
            const longitude =geoJSON.coordinates[0];
            const latitude = geoJSON.coordinates[1];
            return{
                ...property,
                location:{
                    ...property.location,
                    coordinates:{
                        longitude,
                        latitude
                    }
                }
            }
         })   
        )
        res.json(propertiesWithFormattedLocation) 
    } catch (err: any) {
    res
      .status(500)
      .json({ message: `Error retrieving manager properties: ${err.message}` });
  }
}