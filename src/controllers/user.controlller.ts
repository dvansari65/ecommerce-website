import { newUserTypes } from "../types/user";
import AsyncHandler from "../utils/asyncHandler";
import { Request, Response } from "express";
import ApiError from "../utils/errorHanlder";
import { User } from "../models/user.model";




export const newUser = AsyncHandler(async(req:Request<{},{},newUserTypes>,res:Response)=>{
    console.log("✅ /new-user hit with data:", req.body);
        const {userName,photo,email,password,gender,dob} = req.body
        if( !userName || !email || !password || !gender || !dob ){
            return res.status(402).json({
                message:"please enter all fields",
                success:false
            })
        }
        const existingUser = await User.find({
            $or:[
                
                {userName:userName},
                {email:email}
            ]
        })
        if(existingUser.length > 0){
            throw new ApiError("unauthorized request",402)
        }
        const user = await User.findOne({userName})
        console.log("user:",user)
        if(user){
            return res.status(200).json({
                success:true,
                message:`welcome ${user}`
            })
        }
        const newUser  = await User.create({
            userName,
            email,
            photo,
            password,
            gender,
            dob:new Date(dob)
        })
        return res.status(200).json({
            message:"newUser created successfully",
            success:true,
            newUser:newUser
        })
})
