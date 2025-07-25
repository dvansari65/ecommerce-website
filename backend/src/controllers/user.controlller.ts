import { newUserTypes, updateUsertype } from "../types/user";
import AsyncHandler from "../utils/asyncHandler";
import { Request, RequestHandler, Response } from "express";
import ApiError from "../utils/errorHanlder";
import { User } from "../models/user.model";
import redis from "../utils/redis";
import fs from "fs";
import * as jwt from "jsonwebtoken";

import imageKit from "../utils/imageKit";
import { addCacheKey, invalidateKeys } from "../utils/invalidateCache";

export const newUser: RequestHandler<{}, {}, newUserTypes> = AsyncHandler(
  async (req: Request<{}, {}, newUserTypes>, res: Response) => {
    // console.log("✅ /new-user hit with data:", req.body);
    const { userName, email, password, gender, dob } = req.body;

    const photo = req.file;
    console.log("req.body", req.body);
    if (!userName || !email || !password || !gender || !dob || !photo) {
      throw new ApiError("please enter all fields", 402);
    }
    if (password.length < 8) {
      throw new ApiError("please enter minimum 8 characters !", 400);
    }
    const existingUser = await User.findOne({
      $or: [{ userName: userName }, { email: email }],
    });
    if (existingUser) {
      throw new ApiError("user already exists!", 402);
    }
    const uploadedPhoto = await imageKit.upload({
      file: fs.readFileSync(photo.path),
      fileName: photo.originalname,
    });
    if (!uploadedPhoto) {
      throw new ApiError("photo not uploaded on the imagekit", 401);
    }

    try {
      const user = await User.create({
        userName,
        email,
        password,
        photo: uploadedPhoto.url,
        gender,
        dob: new Date(dob),
      });

      invalidateKeys({ user: true, admin: true });
      return res.status(200).json({
        message: `welcome ${user.userName}`,
        success: true,
        user,
      });
    } catch (error) {
      console.error("Error saving user:", error);
      throw new ApiError("Failed to create user", 500);
    }
  }
);

const generateAccessAndRefreshToken = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError("user not found!", 404);
    }
    const refreshToken = user.generateRefreshToken();
    const accessToken = user.generateAccessToken();
    if (!refreshToken || !accessToken) {
      throw new ApiError("refreshToken or accessToken  can not generated", 402);
    }
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: true });
    return { refreshToken, accessToken };
  } catch (error) {
    console.error("failed to generate tokens", error);
    throw new ApiError("server error", 500);
  }
};

export const loginUser = AsyncHandler(
  async (req: Request<{}, {}, newUserTypes>, res: Response) => {
    // console.log("Login request received:", {
    //     body: req.body,
    //     headers: req.headers,
    //     contentType: req.headers['content-type']
    // });

    const { userName, password } = req.body;
    if (!userName || !password) {
      throw new ApiError("please fill all the fields", 402);
    }
    const user = await User.findOne({ userName: userName });
    if (!user) {
      throw new ApiError("unAuthorized request", 401);
    }
    // console.log("Found user:", { userName: user.userName, hasPassword: !!user.password });
    const isPasswordCorrect = await user.isPasswordCorrect(String(password));
    // console.log("Password comparison result:", isPasswordCorrect);
    if (isPasswordCorrect === false) {
      throw new ApiError("password is incorrect", 404);
    }
    // console.log("isPasswordCorrect", isPasswordCorrect)
    const { refreshToken, accessToken } = await generateAccessAndRefreshToken(
      user?._id as string
    );
    const loggedInUser = await User.findById(user?._id).select("-password");

    return res
      .status(200)
      .cookie("refreshToken", refreshToken as string, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .cookie("accessToken", accessToken as string, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .json({
        success: true,
        message: `welcome ${userName}!`,
        accessToken,
        user: loggedInUser,
      });
  }
);
export const myProfile = AsyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError("user id not provided!", 402);
  }
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new ApiError("user not found!", 404);
  }
  return res.status(200).json({
    message: `hey ${user.userName}`,
    success: true,
    user,
  });
});
export const logoutUser = AsyncHandler(
  async (req: Request<{}, {}, newUserTypes>, res: Response) => {
    if (!req.user?._id || !req.user) {
      throw new ApiError("user is not logged in", 402);
    }
    await User.findByIdAndUpdate(
      req.user?._id,
      {
        $unset: {
          refreshToken: 1,
        },
      },
      {
        new: true,
      }
    );

    invalidateKeys({ admin: true, user: true });
    return res
      .status(200)
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: false, // true only in production
        sameSite: "lax", // or "none" if you need cross-site, but then secure:true is required
        path: "/",
      })
      .clearCookie("accessToken", {
        httpOnly: true,
        secure: false, // true only in production
        sameSite: "lax", // or "none" if you need cross-site, but then secure:true is required
        path: "/",
      })
      .json({
        message: "user successfully logout",
        success: true,
      });
  }
);

export const updateUserNameFromProfile = AsyncHandler(
  async (req: Request<{}, {}, newUserTypes>, res: Response) => {
    const { userName } = req.body;
    const user = req.user?._id;
    if (!user) {
      new ApiError("user not log in", 404);
    }
    const updatedUser = await User.findByIdAndUpdate(
      user,
      {
        userName: userName,
      },
      {
        new: true,
      }
    ).select("-password -refreshToken ");
    invalidateKeys({ user: true, admin: true });
    return res.status(200).json({
      message: "user name updated successfully",
      success: true,
      updatedUser,
    });
  }
);

export const updatePhoto = AsyncHandler(
  async (req: Request<{}, {}, newUserTypes>, res: Response) => {
    console.log("i am danish");
    const photo = req.file!;
    const user = req.user?._id;
    if (!user) {
      throw new ApiError("usr is not logged in", 402);
    }
    console.log("photo:", photo);
    if (!photo) {
      throw new ApiError("please provide photo", 402);
    }
    const existingUser = await User.findById(user);
    if (!existingUser) {
      throw new ApiError("user not found", 402);
    }

    //delete old photo
    const url = existingUser?.photo;
    if (url) {
      try {
        // Extract file ID from the URL
        // ImageKit URLs are in format: https://ik.imagekit.io/your_imagekit_id/filename.jpg
        const urlParts = url.split("/");
        const fileName = urlParts[urlParts.length - 1];
        const fileId = fileName.split(".")[0]; // Remove file extension

        if (fileId) {
          await imageKit.deleteFile(fileId);
          console.log("Successfully deleted old photo with ID:", fileId);
        }
      } catch (error) {
        console.log("Error deleting old photo:", error);
        // Continue with the update even if deletion fails
      }
    }

    //upload new photo
    const uploadedPhoto = await imageKit.upload({
      file: fs.readFileSync(photo.path),
      fileName: photo.originalname,
    });

    const updatedUser = await User.findByIdAndUpdate(
      user,
      {
        photo: uploadedPhoto.url,
      },
      {
        new: true,
      }
    ).select("-password -refreshToken");
    invalidateKeys({ user: true, admin: true });
    return res.status(200).json({
      message: "photo updated successfully",
      success: true,
      updatedUser,
    });
  }
);

export const deleteUser = AsyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError("please provide user id", 404);
  }
  await User.findByIdAndDelete(id);
  invalidateKeys({ user: true, admin: true });
  return res.status(200).json({
    message: "user deleted!",
    success: true,
  });
});

export const updateUser = AsyncHandler(
  async (req: Request<{}, {}, updateUsertype>, res: Response) => {
    const { email, userName, dob,gender } = req.body;
    const user = req.user?._id;
    if (!user) {
      throw new ApiError("user not found", 404);
    }
   
    if (email && email.length>0) {
      console.log("inemail",userName)
      const existingEmail = await User.findOne({
        email: email,
        _id: { $ne: user },
      });
      if (existingEmail) {
        return res.status(409).json({
          message:" email  already exist!",
          success:false
      })
    }
    }
    console.log("username",userName)
    if (userName && userName.length > 0) {
      const existingUserName = await User.findOne({
        userName: userName,
        _id: { $ne: user },
      });
      if (existingUserName) {
        return res.status(409).json({
          message:"user name is already exist!",
          success:false
        })
      }
    }
    const userFields: any = {};
    if(gender) userFields.gender = gender
    if (email) userFields.email = email;
    if (userName) userFields.userName = userName;
    if (dob) userFields.dob = dob;
    const updatedUser = await User.findByIdAndUpdate(
      user,
      userFields,
      {
      new: true,
      }
  ).select("-password -refreshToken");
  if(!updateUser){
    throw new ApiError("failed to update user!",500)
  }
    invalidateKeys({ user: true, admin: true });
    return res.status(200).json({
      messsage: "user updated successfully",
      success: true,
      updatedUser
    });
  }
);

export const getAllUser = AsyncHandler(
  async (req: Request<{}, {}, newUserTypes>, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.USERS_PER_PAGE) || 12;
    const skip = (page - 1) * limit;
    const key = `all-users-${page}-${limit}`;
    const cachedData = await redis.get(key);
    if (cachedData) {
      return res.status(200).json({
        message: "all users fetched successfully!",
        success: true,
        users: JSON.parse(cachedData),
      });
    }
    const allUsers = await User.find({})
      .select("-password -refreshToken")
      .limit(limit)
      .skip(skip);

    if (allUsers.length === 0) {
      return res.status(200).json({
        message: "No users found!",
        success: true,
        allUsers,
      });
    }
    await redis.set(key, JSON.stringify(allUsers));
    await addCacheKey(key);
    return res.status(200).json({
      message: "All users found!",
      success: true,
      allUsers,
    });
  }
);

export const getSingleUser = AsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      throw new ApiError("Please provide a user ID", 402);
    }
    const key = `single-user-${id}`;
    const cachedData = await redis.get(key);
    if (cachedData) {
      return res.status(200).json({
        message: "single user fetched successfully!",
        success: true,
        user: JSON.parse(cachedData),
      });
    }
    const user = await User.findById(id);

    if (!user) {
      throw new ApiError("User not found", 404);
    }
    await redis.set(key, JSON.stringify(user));
    await addCacheKey(key);
    return res.status(200).json({
      message: `User ${user.userName} obtained`,
      success: true,
      user,
    });
  }
);

export const generateNewAccessToken = AsyncHandler(
  async (req: Request, res: Response) => {
    const refreshtoken = req.cookies?.refreshToken;

    if (!refreshtoken) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET!;

    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET!;

    // ✅ Type narrowing before use
    if (!accessTokenSecret || !refreshTokenSecret) {
      throw new Error("JWT secrets or expiry time are not defined in .env");
    }

    let decodedToken: jwt.JwtPayload;
    try {
      decodedToken = jwt.verify(
        refreshtoken,
        refreshTokenSecret
      ) as jwt.JwtPayload;
      const user = await User.findById(decodedToken._id);
      if (!user || user.refreshToken !== refreshtoken) {
        return res
          .status(403)
          .json({ message: "Invalid refresh token (mismatch)" });
      }
    } catch (error) {
      return res
        .status(403)
        .json({ message: "Invalid or expired refresh token" });
    }

    if (typeof decodedToken !== "object" || !("_id" in decodedToken)) {
      return res.status(403).json({ message: "Invalid token payload" });
    }

    const newAccessToken = jwt.sign(
      { _id: decodedToken._id },
      accessTokenSecret,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "token generated successfully!",
      accessToken: newAccessToken,
    });
  }
);
