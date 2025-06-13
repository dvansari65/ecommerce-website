import mongoose from "mongoose";

export interface IUser extends Document {
  
    userName:String,
    email:String,
    password:String,
    dob:Date,
    gender:"male" | "female" | "transgender",
    role:"user" | "admin",
    age:Number,
    photo:string
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
        unique:true,
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


export const User = mongoose.model<IUser>("User",userSchema)