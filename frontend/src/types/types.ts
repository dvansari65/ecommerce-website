export interface User {
    userName?:string,
    password?:string,
    email?:string,
    dob?:string,
    gender?:"male" | "femal" | "transgender",
    photo?:string,
}

export interface Product { 
    name:string,
    _id:string,
    price:number,
    stock:number,
    category:string,
    description?:string,
    ratings?:number,
    photo:string,
    numberOfRatings?:number,
    onClick?: () => void;
  onWishlistClick?: () => void;
}