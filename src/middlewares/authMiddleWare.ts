import { NextFunction, Request, Response } from "express"
import ApiError from "../utils/errorHanlder"
import jwt, { JwtPayload } from "jsonwebtoken"
import { User } from "../models/user.model"

export const verifyJwt = async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const token = req.cookies?.accessToken || req.headers["authorization"]?.replace("Bearer ","")
        if(!token){
            throw new ApiError("user is not login",402)
        }
        const secret = process.env.ACCESS_TOKEN_SECRET as string
       const decodedToken  = jwt.verify(token,secret) as JwtPayload

       if(typeof decodedToken === "string" || !("_id" in decodedToken)){
        throw new ApiError("Invalid token payload", 403);
       }
       const user = await User.findById(decodedToken._id).select("-password -refreshToken")
       if(!user){
        throw new ApiError("user not found", 404);
       }
    
       req.user = user
       next()
    } catch (error) {
        console.error("failed to jwt verification",500)
        throw error;
    }
}