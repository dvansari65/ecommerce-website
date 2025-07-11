import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { Document } from "mongoose";
import bcrypt from "bcrypt"
export interface IUser extends Document {
  
    userName:String,
    email:String,
    password:String,
    dob:Date,
    gender:"male" | "female" | "transgender",
    role:"user" | "admin",
    age:Number,
    photo:string,
    refreshToken:string
    generateRefreshToken():string,
    generateAccessToken():string,
    isPasswordCorrect(password:string):Promise<boolean>
}
const userSchema  = new mongoose.Schema({
    
    userName:{
        type:String,
        unique:true,
        required:[true,"please enter user name"]
    },
    email:{
        type:String,
        unique:true,
        required:[true,"please enter email"]
    },
    password:{
        type:String,
    
        required:[true,"please enter password"]
    },
    dob:{
        type:Date,
        required:[true,"please enter date of birth"]
    },
    gender:{
        type:String,
        required:[true,"please enter gender"]
    },
    role:{
        type:String,
        enum:["admin","user"],
        default:"user"
    },
    photo:{
        type:String
    },
    refreshToken:{
        type:String
    },
    lastTimeActive:{
        type:Date,
        default:Date.now()
    }
},{timestamps:true})

userSchema.virtual("age").get(function(){
    const today = new Date()
    const dob = this.dob
    let age = today.getFullYear() - dob.getFullYear()
    if(today.getMonth() < dob.getMonth() ||  (today.getMonth() === dob.getMonth() && today.getDay() < dob.getDay() ) ){
        age--
    }
    return age

})

userSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) return next()
        
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
        console.log("Password hashed successfully")
        next()
    } catch (error) {
        console.error("Error hashing password:", error)
        next(error as Error)
    }
})

userSchema.methods.isPasswordCorrect = async function(password: string) {
    try {
        console.log("Comparing passwords...")
        const isMatch = await bcrypt.compare(password, this.password)
        console.log("Password comparison result:", isMatch)
        return isMatch
    } catch (error) {
        console.error("Error comparing passwords:", error)
        throw error
    }
}

userSchema.methods.generateAccessToken = function() {
    const secret = process.env.ACCESS_TOKEN_SECRET;

    if (!secret) throw new Error("ACCESS_TOKEN_SECRET is not defined");

    return jwt.sign(
        {
            _id: this._id
        },
        secret,
        { expiresIn: "1d" }  
    );
}
userSchema.methods.generateRefreshToken = function() {
    const secret = process.env.REFRESH_TOKEN_SECRET;
    if (!secret) throw new Error("REFRESH_TOKEN_SECRET is not defined");

    return jwt.sign(
        {
            _id: this._id,
            
        },
        secret,
        { expiresIn: "10d" }
    );
}
export const User = mongoose.model<IUser>("User",userSchema)