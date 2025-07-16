import Button from "@/components/features/Button";
import OrderCard from "@/components/features/OrderCard";
import { useMyOrderQuery } from "@/redux/api/orderApi";
import { useEffect, useState } from "react";

function MyOrders() {
  const [page, setPage] = useState<number>(1);
  const { getMyOrders, isError, isLoading } = useMyOrderQuery({});
  const handleIncrease = async () => {};
  const handleDecrease = async () => {};
  return (
    <div className=" h-screen bg-transparent grid grid-cols-12">
      <div className="col-span-8">
        <div className=" flex flex-col ">
          <span className="mb-3 font-extralight text-gray-500">ORDERS:</span>
          <div>
            <OrderCard
              name=""
              photo=""
              quantity={2}
              increaseQuantity={handleIncrease}
              decreaseQuantity={handleDecrease}
              category=""
              status=""
            />
          </div>
        </div>
        <div>
          
        </div>
      </div>

      <div className="col-span-4"></div>
    </div>
  );
}

export default MyOrders;
