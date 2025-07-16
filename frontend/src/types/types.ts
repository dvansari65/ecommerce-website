

export interface User {
    userName?:string,
    password?:string,
    email?:string,
    dob?:string,
    gender?:"male" | "femal" | "transgender",
    photo?:string,
    refreshToken ?  : string,
    _id?:string
    
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
  quantity? :number,
  onClick?: () => void;
  onWishlistClick?: () => void;
}

export interface Review { 
  _id:string,
  comment:string,
  user:User,
  product:Product,
  createdAt:string,
}
export type partialProductType = Partial<Product>
export type refreshDataResponse = {
  success:boolean,
  message:string,
  accessToken:string,
}
 export type messageAndSuccessProps = {
  message:string 
  success:boolean
 }

export type error = {
  message:string,
  statusCode :number
}
export type cartItem = {
  _id: string;
  productId: Product;
  quantity: number;
}

export type Cart = {
  _id: string;
  user: string;
  items: cartItem[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CartProps {
  message:string,
  success:boolean,
  cart:Cart,
  data:messageAndSuccessProps
}


