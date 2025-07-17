import { Cross, CrossIcon, Minus, Plus, Trash } from "lucide-react";
import React from "react";
import canonimage from "../../assets/canon.png";
import type { productTypeFromOrder } from "@/types/api-types";
interface orderCardProps {
  shippingCharges: number;
  status: string;
  tax: number;
  total: number;
  discount: number;
  orderItems: productTypeFromOrder[];
  createdAt: string;
  _id:string,
  page:number,
  decreaseQuantity: (orderId:string,productId:string) => void;
  increaseQuantity: (orderId:string,productId:string) => void;
}

function OrderCard({
  status,
  total,
  tax,
  _id,
  discount,
  shippingCharges,
  createdAt,
  orderItems,
  increaseQuantity,
  decreaseQuantity,
}: orderCardProps) {
  return (
    <div key={_id}  className="flex flex-col justify-start items-start p-2 mx-3 my-2  w-full bg-transparent min-h-fit border-b-[1px] border-[rgb(137,129,141)] ">
      <div className="w-[32vh] mb-2 flex flex-col justify-start items-start gap-2 ml-2 ">
        <div className="flex gap-5 ">
          <span className="font-extralight bg-[rgb(78,173,34)] rounded-[2px] px-3 py-1 ">
            ORDERS:
          </span>
          <button className="text-[rgb(249,69,69)] bg-[rgb(47,22,113)] px-6 py-1 rounded-[4px] hover:bg-[rgb(124,90,210)]">
            cancel
          </button>
        </div>
        <div className="w-full flex flex-row justify-between ">
          <span className="text-purple-300">createdAt</span>
          <span className="">
            {new Date(createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
        <div className="w-full flex flex-row justify-between ">
          <span className="text-purple-300">total</span>
          <span>{total || 2000}.Rs</span>
        </div>
        <div className="w-full flex flex-row justify-between ">
          <span className="text-purple-300">tax</span>
          <span className="text-[rgb(185,40,40)] text-[15px] font-bold">
            {tax || 200}.Rs
          </span>
        </div>
        <div className="w-full flex flex-row justify-between text-purple-300">
          <span>discount</span>
          <span className="text-green-400">{discount || 0}.Rs</span>
        </div>
        <div className="w-full flex flex-row justify-between text-purple-300">
          <span>shipping Charges</span>
          <span className="text-[rgb(185,40,40)] font-bold">
            {shippingCharges || 0}.Rs
          </span>
        </div>
        <div className="w-full flex flex-row justify-between ">
          <span className="text-purple-300">status</span>
          <span className="text-green-400">{status || "processing"}</span>
        </div>
      </div>
      <div className="w-full mt-4">
        <div className="flex flex-row justify-between">
          <span></span>
          <span className="ml-10 text-gray-500">name</span>
          <span className="text-gray-500">quantity</span>
          <span className="text-gray-500">price</span>
        </div>
        {orderItems.map((order) => (
          <div key={order.productId} >
            <div className="w-full min-h-[100px] px-3 border border-[#3f2e40] bg-[#1b1321] hover:border-[#b075f5] flex flex-row justify-between items-center  py-1 rounded-[10px] mt-3 ml-2 ">
              <div className="rounded-[3px]">
                <img
                  src={order.photo || canonimage}
                  className="size-12 rounded-[3px]"
                  alt=""
                />
              </div>
              <div>{order.name || "cooler"}</div>
              <div className="text-white flex flex-row justify-center items-center gap-2 ">
                <button onClick={()=>increaseQuantity(order.productId,_id)} className="hover:cursor-pointer text-gray-500">
                  <Plus />
                </button>
                <span  className="border-[1px] px-2 rounded-[4px] text-gray-500 ">
                  {order.quantity || 1}
                </span>
                <button onClick={()=>decreaseQuantity(order.productId,_id)}  className="hover:cursor-pointer text-gray-500">
                  <Minus />
                </button>
              </div>
              <div className="text-white pl-2 ">{order.price || 200}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderCard;

//TODO: have to rebuild order card and have to create card that contain its info ...