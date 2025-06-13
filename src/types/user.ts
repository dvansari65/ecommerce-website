export interface newUserTypes  {
    userName:String,
    email:String,
    password:String,
    photo:string,
    dob:Date,
    gender:"male" | "female" | "transgender",
    role?:"admin" | "user"
   }