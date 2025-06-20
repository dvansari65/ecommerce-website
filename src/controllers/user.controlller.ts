import { newUserTypes, updateUsertype } from "../types/user";
import AsyncHandler from "../utils/asyncHandler";
import { Request, Response } from "express";
import ApiError from "../utils/errorHanlder";
import { User } from "../models/user.model";

import fs from "fs"

import imageKit from "../utils/imageKit";
import { myCache } from "../app";
import { addCacheKey, invalidateKeys } from "../utils/invalidateCache";

export const newUser = AsyncHandler(async (req: Request<{}, {}, newUserTypes>, res: Response) => {

    console.log("✅ /new-user hit with data:", req.body);
    const { userName, email, password, gender, dob } = req.body
    const photo = req.file
    if (!userName || !email || !password || !gender || !dob || !photo) {
        throw new ApiError("please enter all fields", 402)
    }

    const existingUser = await User.findOne({
        $or: [
            { userName: userName },
            { email: email }
        ]
    })

    if (existingUser) {
        throw new ApiError("user already exists!", 402)
    }
    const uploadedPhoto = await imageKit.upload({
        file: fs.readFileSync(photo.path),
        fileName: photo.originalname
    })
    if (!uploadedPhoto) {
        throw new ApiError("photo not uploaded on the imagekit", 401)
    }


    const newUser = new User({
        userName,
        email,
        password,
        photo: uploadedPhoto.url,
        gender,
        dob: new Date(dob)
    })

    try {
        await newUser.save()
        invalidateKeys({user:true,admin:true})
        // console.log("User saved successfully:", { userName: newUser.userName })

        return res.status(200).json({
            message: "newUser created successfully",
            success: true,
            newUser
        })
    } catch (error) {
        console.error("Error saving user:", error)
        throw new ApiError("Failed to create user", 500)
    }
})

const generateAccessAndRefreshToken = async (userId: string) => {
    try {
        const user = await User.findById(userId)
        if (!user) {
            throw new ApiError("user not found!", 404)
        }
        const refreshToken = user.generateRefreshToken()
        const accessToken = user.generateAccessToken()
        if (!refreshToken || !accessToken) {
            throw new ApiError("refreshToken or accessToken  can not generated", 402)
        }
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: true })
        return { refreshToken, accessToken }
    } catch (error) {
        console.error("failed to generate tokens", error)
        throw new ApiError("server error", 500)
    }
}

export const loginUser = AsyncHandler(async (req: Request<{}, {}, newUserTypes>, res: Response) => {
    // console.log("Login request received:", {
    //     body: req.body,
    //     headers: req.headers,
    //     contentType: req.headers['content-type']
    // });

    const { userName, password } = req.body
    if (!userName || !password) {
        throw new ApiError("please fill all the fields", 402)
    }
    const user = await User.findOne({ userName: userName })
    if (!user) {
        throw new ApiError("unAuthorized request", 401)
    }
    console.log("Found user:", { userName: user.userName, hasPassword: !!user.password });
    const isPasswordCorrect = await user.isPasswordCorrect(String(password))
    console.log("Password comparison result:", isPasswordCorrect);
    if (isPasswordCorrect === false) {
        throw new ApiError("password is incorrect", 404)
    }
    console.log("isPasswordCorrect", isPasswordCorrect)
    const { refreshToken, accessToken } = await generateAccessAndRefreshToken(user?._id as string)
    const loggedInUser = await User.findById(user?._id).select("-password -refreshToken")

    return res
        .status(200)
        .cookie("refreshToken", refreshToken as string, {
            httpOnly: true,
            secure: false,
        })
        .cookie("accessToken", accessToken as string, {
            httpOnly: true,
            secure: false,
        })
        .json({
            success: true,
            message: "user successfully loggedIn",
            loggedInUser
        })
})

export const logoutUser = AsyncHandler(async (req: Request<{}, {}, newUserTypes>, res: Response) => {
    if (!req.user?._id || !req.user) {
        throw new ApiError("user is not logged in", 402)
    }
    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: false
    }

    return res
        .status(200)
        .clearCookie("refreshToken", options)
        .clearCookie("accessToken", options)
        .json({
            message: "user successfully logout",
            success: true,
        })

})

export const updateUserNameFromProfile = AsyncHandler(async (req: Request<{}, {}, newUserTypes>, res: Response) => {
    const { userName } = req.body
    const user = req.user?._id
    if (!user) {
        new ApiError("user not log in", 404)
    }
    const updatedUser = await User.findByIdAndUpdate(
        user,
        {
            userName: userName
        },
        {
            new: true
        }
    ).select("-password -refreshToken ")
    invalidateKeys({user:true,admin:true})
    return res
        .status(200)
        .json({
            message: "user name updated successfully",
            success: true,
            updatedUser
        })
})

export const updatePhoto = AsyncHandler(async (req: Request<{}, {}, newUserTypes>, res: Response) => {
    console.log("i am danish")
    const photo = req.file!
    const user = req.user?._id
    if (!user) {
        throw new ApiError("usr is not logged in", 402)
    }
    console.log("photo:", photo)
    if (!photo) {
        throw new ApiError("please provide photo", 402)
    }
    const existingUser = await User.findById(user)
    if (!existingUser) {
        throw new ApiError("user not found", 402)
    }

    //delete old photo
    const url = existingUser?.photo
    if (url) {
        try {
            // Extract file ID from the URL
            // ImageKit URLs are in format: https://ik.imagekit.io/your_imagekit_id/filename.jpg
            const urlParts = url.split('/')
            const fileName = urlParts[urlParts.length - 1]
            const fileId = fileName.split('.')[0] // Remove file extension

            if (fileId) {
                await imageKit.deleteFile(fileId)
                console.log("Successfully deleted old photo with ID:", fileId)
            }
        } catch (error) {
            console.log("Error deleting old photo:", error)
            // Continue with the update even if deletion fails
        }
    }

    //upload new photo
    const uploadedPhoto = await imageKit.upload({
        file: fs.readFileSync(photo.path),
        fileName: photo.originalname
    })

    const updatedUser = await User.findByIdAndUpdate(
        user,
        {
            photo: uploadedPhoto.url
        },
        {
            new: true
        }
    ).select("-password -refreshToken")
    invalidateKeys({user:true,admin:true})
    return res
        .status(200)
        .json({
            message: "photo updated successfully",
            success: true,
            updatedUser
        })
})

export const deleteUser = AsyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    if (!id) {
        throw new ApiError("please provide user id", 404)
    }
    await User.findByIdAndDelete(id)
    invalidateKeys({user:true,admin:true})
    return res
        .status(200)
        .json(
            {
                message: "user deleted!",
                success: true
            }
        )
}
)

export const updateUser = AsyncHandler(async (req: Request<{}, {}, updateUsertype>, res: Response) => {
    const { email, password, dob } = req.body
    const user = req.user?._id
    if (!user) {
        throw new ApiError("user not found", 404)
    }
    const existingEmail = await User.findOne({ email: email })
    if (existingEmail) {
        throw new ApiError("email already exist", 402)
    }
    const udatedUser = await User.findByIdAndUpdate(
        user,
        {
            email: email,
            password: password,
            dob: dob
        },
        {
            new: true
        }
    ).select("-password")
    invalidateKeys({user:true,admin:true})
    return res
        .status(200)
        .json(
            {
                messsage: "user updated successfully",
                success: true,
                udatedUser
            }
        )
})

export const getAllUser = AsyncHandler(async (req: Request<{}, {}, newUserTypes>, res: Response) => {

    const page = Number(req.query.page) || 1
    const limit = Number(process.env.USERS_PER_PAGE) || 12;
    const skip = (page - 1) * limit
    let allUsers
    const key = `all-users-${page}-${limit}`
    if (myCache.has(key)) {
        allUsers = JSON.parse(myCache.get(key) as string)
    } else {
        allUsers = await User.find({}).select("-password -refreshToken")
        myCache.set(key, JSON.stringify(allUsers))
        addCacheKey(key)
        if (allUsers.length == 0) {
            return res.status(200).json({
                message: "no user found !",
                success: true,
                allUsers
            })
        }
    }
    return res.status(200).json({
        message: "all users found !",
        success: true,
        allUsers
    })
})

export const getSingleUser = AsyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const key = `single-user-${id}`
    let user
    if (!id) {
        throw new ApiError("please provide id", 402)
    }
    if (myCache.has(key)) {
        user = JSON.parse(myCache.get(key) as string)
    } else {
        user = await User.findById(id)
        if (!user) {
            throw new ApiError("user not found", 404)
        }
        myCache.set(key,JSON.stringify(user))
        addCacheKey(key)
    }
    return res
        .status(200)
        .json(
            {
                message: `user ${user.userName} obtain`,
                success: true,
                user
            }
        )
})

