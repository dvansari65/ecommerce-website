export interface newUserTypes  {
    userName:String,
    email:String,
    password:String,
    photo:string,
    dob:string,
    gender:"male" | "female" | "transgender",
    role?:"admin" | "user"
   }

   export interface optionsType{
    httpOnly:boolean,
    secure:boolean,
    sameSite:string
   }