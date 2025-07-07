import { NextFunction, Request, Response } from "express"
import ApiError from "../utils/errorHanlder"
import jwt, { JwtPayload } from "jsonwebtoken"
import { User } from "../models/user.model"

export const verifyJwt = async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const token =    req.cookies?.accessToken || req.headers["authorization"]?.replace("Bearer ","")
        
        // console.log("req.cookies?.accessToken",req.cookies?.accessToken)
        // console.log("Token from client:", token);
        if(!token){
            throw new ApiError("user is not login",401)
        }
        const secret = process.env.ACCESS_TOKEN_SECRET as string
       const decodedToken  = jwt.verify(token,secret) as JwtPayload
       
    //    console.log("Access Token Secret used for verify:", secret);
       
       if(typeof decodedToken === "string" || !("_id" in decodedToken)){
        throw new ApiError("Invalid token payload", 403);
       }
       const user = await User.findById(decodedToken._id).select("-password -refreshToken")
       if(!user){
        throw new ApiError("user not found", 404);
       }
    
       req.user = user
       next()
    } catch (error:any) {
        if(error.name === "TokenExpiredError"){
             res.status(401).json({message:"access token expired!"})
             return;
        }
        console.log("failed to jwt verification",error)
         res.status(401).json({message: "Invalid or missing token"})
         return;
    }
}