export interface newUserTypes  {
     _id:string,
    userName:String,
    email:String,
    password:String,
    photo:string,
    dob:string,
    gender:"male" | "female" | "transgender",
    role?:"admin" | "user"
    lastTimeActive?:string
   }

   export interface optionsType{
    httpOnly:boolean,
    secure:boolean,
    sameSite:string
   }

   
   export type updateUsertype = {
        email:string,
        dob:string,
        userName:string,
        gender:"male" | "female" | "transgender"
   }