import AsyncHandler from "../utils/asyncHandler";
import { NextFunction, Request,Response } from "express";
import ApiError from "../utils/errorHanlder";
import { User } from "../models/user.model";

export const Admin = AsyncHandler( async (req:Request,res:Response,next:NextFunction)=>{
    const {id} = req.query
    if(!id){
        throw new ApiError("please provide admin id",402)
    }
    const user = await User.findById(id)
    if(!user){
       throw new ApiError("user not found!",404)
        
    }
    if(user.role !== "admin"){
        throw new ApiError("unauthorized request!",402)
    }
    next()
})