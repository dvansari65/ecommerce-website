import { newUserTypes } from "../types/user";
import AsyncHandler from "../utils/asyncHandler";
import { Request, Response } from "express";
import ApiError from "../utils/errorHanlder";
import { User } from "../models/user.model";


export const newUser = AsyncHandler(async(req:Request<{},{},newUserTypes>,res:Response)=>{
    console.log("✅ /new-user hit with data:", req.body);
    const {userName,photo,email,password,gender,dob} = req.body
    if(!userName || !email || !password || !gender || !dob){
        throw new ApiError("please enter all fields", 402)
    }

    const existingUser = await User.findOne({
        $or:[
            {userName:userName},
            {email:email}
        ]
    })

    if(existingUser){
        throw new ApiError("user already exists!", 402)
    }

    const newUser = new User({
        userName,
        email,
        photo,
        password,
        gender,
        dob: new Date(dob)
    })

    try {
        await newUser.save()
        console.log("User saved successfully:", { userName: newUser.userName })
        
        return res.status(200).json({
            message: "newUser created successfully",
            success: true,
            newUser: {
                userName: newUser.userName,
                email: newUser.email,
                gender: newUser.gender,
                dob: newUser.dob
            }
        })
    } catch (error) {
        console.error("Error saving user:", error)
        throw new ApiError("Failed to create user", 500)
    }
})

const generateAccessAndRefreshToken = async (userId:string)=>{
        try {
            const user = await User.findById(userId)
            if(!user){
                throw new ApiError("user not found!",404)
            }
            const refreshToken =  user.generateRefreshToken()
            const accessToken = user.generateAccessToken()
            if(!refreshToken || !accessToken ){
                throw new ApiError("refreshToken or accessToken  can not generated",402)
            }
            user.refreshToken = refreshToken
            await user.save({validateBeforeSave:true})
            return {refreshToken,accessToken} 
        } catch (error) {
            console.error("failed to generate tokens",error)
            throw new ApiError("server error",500)
        }
}

export const loginUser = AsyncHandler(async(req:Request<{},{},newUserTypes>,res:Response)=>{
        // console.log("Login request received:", {
        //     body: req.body,
        //     headers: req.headers,
        //     contentType: req.headers['content-type']
        // });
        
        const {userName,password} = req.body
        if(!userName  || !password){
            throw new ApiError("please fill all the fields",402)
        }
        const user  = await User.findOne({userName:userName})
        if(!user){
            throw new ApiError("unAuthorized request",401)
        }
        console.log("Found user:", { userName: user.userName, hasPassword: !!user.password });
        const isPasswordCorrect = await user.isPasswordCorrect(String(password))
        console.log("Password comparison result:", isPasswordCorrect);
        if(isPasswordCorrect === false){
                throw new ApiError("password is incorrect",404)
        }
        console.log("isPasswordCorrect",isPasswordCorrect)
        const {refreshToken,accessToken} = await generateAccessAndRefreshToken(user?._id as string)
        const loggedInUser = await User.findById(user?._id).select("-password refreshToken")
        
        return res
        .status(200)
        .cookie("refreshToken",refreshToken as string,{
            httpOnly:true,
            secure:false,
        })
        .cookie("accessToken",accessToken as string,{
            httpOnly:true,
            secure:false,
        })
        .json({
            success:true,
            message:"user successfully loggedIn",
            loggedInUser
        })
})

