import { User } from "../models/user.model";
import { NextFunction, Request, Response } from "express";
export const updateLastActive = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        if (req.user?._id) {
            await User.findByIdAndUpdate(
                req.user?._id,
                {
                    lastTimeActive:new Date()
                }
            )
        }
        next();
    } catch (error) {
        console.error("error updating last active",error)
        next();
    }
}