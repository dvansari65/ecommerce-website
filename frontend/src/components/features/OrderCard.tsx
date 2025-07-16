import { Cross, CrossIcon, Minus, Plus, Trash } from "lucide-react";
import React from "react";
import canonimage from "../../assets/canon.png"
interface oderCardProps {
  name: string,
  quantity: number,
  status: string,
  photo: string,
  category: string,
  decreaseQuantity:()=>void,
  increaseQuantity:()=>void
}

function OrderCard({
  name,
  quantity,
  status,
  photo,
  category,
  increaseQuantity,
  decreaseQuantity
  
}: oderCardProps) {
  return (
    <div className="w-[100%] h-[100px]  rounded-[3px] bg-transparent border-t-[1px] border-b-[1px] border-gray-600 flex flex-row justify-between items-center text-black  px-5 ">
      <div className="flex flex-row items-center gap-4 h-full ">
        <div className="p-2 "><img src={photo || canonimage} className="size-18 rounded-[4px]" alt="" /></div>
        <div className="flex flex-col  items-start justify-start mt-10 h-full min-w-[120px] ml-3 text-white ">
          <span className="text-[13px] text-gray-400 ">{category || "equipment"}</span>
          <div className="text-white">{name || "cooler"}</div>
        </div>
      </div>

      <div className="text-green-400 ">{status || "processing"}</div>
      <div className="flex flex-row gap-1">
        <button className="text-white">
          <Minus />
        </button>
        <span className="border-[1px] border-gray-500 px-2 rounded-[2px] text-white">
          {quantity || 3}
        </span>
        <button onClick={increaseQuantity} className="text-white">
          <Plus />
        </button>
      </div>
      <div >
        <button onClick={decreaseQuantity} className="text-white">
          <Trash />
        </button>
      </div>
    </div>
  );
}

export default OrderCard;
