

export type shippingInfoType = {
    address:string ,
    city: string,
    state: string,
    country: string,
    pinCode: number
}
export type OrderItemType = {
    name: string;
    photo: string;
    price: number;
    quantity: number;
    productId?: string;
  };

export type requestOrderBodyType = {
    shippingInfo?: shippingInfoType,
    user?: string,
    subtotal?: number,
    tax?: number,
    shippingCharges?: number,
    discount?: number,
    total?: number,
    status?: string,
    orderItems?:OrderItemType []
}