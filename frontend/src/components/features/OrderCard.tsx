import React from "react";
import canonImage from "../../assets/canon.png";
import { ArrowDown, ArrowUp } from "lucide-react";
interface orderCardProps {
  name: string;
  photo: string;
  price: number;
  discount: number;

}

function OrderCard({
  name,
  photo,
  price,
  discount,
 
}: orderCardProps) {
  return (
    <div >
      <div className="w-full h-[100px] bg-[#1b1321] border-[1px] border-[#3f2e40] hover:border-[#b075f5] hover:shadow-purple-500/2 rounded-[10px] grid grid-cols-16 my-2 ">
      <div className="col-span-2 flex justify-center items-center ">
        <img src={photo || canonImage} className="size-18 rounded-[3px]" />
      </div>
      <div className="col-span-2 flex items-center text-gray-400 ml-3">
        <span>{name || "jeans pant"}</span>
      </div>
      <div className="col-span-6 flex items-center justify-center gap-3">
        
      </div>
      <div className="mb-5 flex flex-col justify-center gap-2 items-center col-span-2 ">
        <span className="text-gray-500 ">price:</span>
        <div className="mb-3">Rs.{price || 200}</div>
      </div>
      <div className="col-span-4 flex flex-col items-center justify-center mb-5">
        <span className="text-green-400 text-[14px]">discount:</span>
        <span className="mt-2 mb-3">Rs.{discount || 0}</span>
      </div>
    </div>
    </div>
  );
}

export default OrderCard;
