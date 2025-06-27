export interface User {
    userName?:string,
    password?:string,
    email?:string,
    dob?:string,
    gender?:"male" | "femal" | "transgender",
    photo?:string,
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  description?: string;
  ratings?: number;
  photo: string;
  numberOfRatings?: number;
  discount?: number;
  discountedPrice?: number;
  createdAt?: string;
  updatedAt?: string;
  onClick?: () => void;
  onWishlistClick?: () => void;
}
