import { Cross, CrossIcon, Minus, Plus, Trash } from "lucide-react";
import React from "react";
import canonimage from "../../assets/canon.png";
import type { productTypeFromOrder } from "@/types/api-types";
interface oderCardProps {
  shippingCharges: number;
  status: string;
  tax: number;
  total: number;
  discount: number;
  orderItems: productTypeFromOrder[];
  createdAt: string;
  decreaseQuantity: () => void;
  increaseQuantity: () => void;
}

function OrderCard({
  status,
  total,
  tax,
  discount,
  shippingCharges,
  createdAt,
  orderItems,
  increaseQuantity,
  decreaseQuantity,
}: oderCardProps) {
  return (
    <div className="flex flex-col justify-start items-start p-2 mx-2 w-full bg-transparent min-h-fit border-b-[1px] border-[rgb(137,129,141)] ">
      <div className="w-[32vh] mb-2 flex flex-col justify-start items-start gap-2 ">
        <span className="font-extralight bg-[rgb(78,173,34)] rounded-[2px] px-3">
          ORDERS:
        </span>
        <div className="w-full flex flex-row justify-between ">
          <span>createdAt</span>
          <span>
            {new Date(createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
        <div className="w-full flex flex-row justify-between ">
          <span>total</span>
          <span>{total || 2000}.Rs</span>
        </div>
        <div className="w-full flex flex-row justify-between ">
          <span>tax</span>
          <span className="text-[rgb(185,40,40)] text-[15px] font-bold">
            {tax || 200}.Rs
          </span>
        </div>
        <div className="w-full flex flex-row justify-between ">
          <span>discount</span>
          <span className="text-green-400">{discount || 0}.Rs</span>
        </div>
        <div className="w-full flex flex-row justify-between ">
          <span>shipping Charges</span>
          <span className="text-[rgb(185,40,40)] font-bold">
            {shippingCharges || 0}.Rs
          </span>
        </div>
        <div className="w-full flex flex-row justify-between ">
          <span>status</span>
          <span className="text-green-400">{status || "processing"}</span>
        </div>
      </div>
      <div className="w-full mt-4">
        <div className="grid grid-cols-9">
          <span className="col-span-5 text-end mr-26 flex justify-end text-gray-500">
            name
          </span>
          <span className="col-span-3 text-center mr-22 pl-3 flex justify-end text-gray-500 ">
            quantity
          </span>
          <span className="col-span-1 flex justify-end text-gray-500">
            price
          </span>
        </div>
        {orderItems.map((order) => (
          <div id={order.productId}>
            <div className="w-full min-h-[130px]  flex flex-row justify-between items-center  py-1  ">
              <div className="rounded-[3px]">
                <img
                  src={order.photo || canonimage}
                  className="size-12 rounded-[3px]"
                  alt=""
                />
              </div>
              <div>{order.name || "cooler"}</div>
              <div className="text-white flex flex-row justify-center items-center gap-2 ">
                <button><Plus/></button>
                <span className="border-[1px] px-2">{order.quantity || 1}</span>
                <button><Minus/></button>
              </div>
              <div className="text-white pl-2">{order.price || 200}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderCard;
