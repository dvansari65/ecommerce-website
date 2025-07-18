import Button from "@/components/features/Button";
import OrderCard from "@/components/features/OrderCard";
import SummaryOfOrder from "@/components/features/SummaryOfOrder";
import Spinner from "@/components/ui/LoaderIcon";

import {
  
  useMyOrderQuery,
} from "@/redux/api/orderApi";
import { useState } from "react";
import toast from "react-hot-toast";

function MyOrders() {
  const [page, setPage] = useState<number>(1);
  const { data, isError, isLoading } = useMyOrderQuery({ page });
  const allOrders = data?.orders || [];
  console.log("alLorder:",allOrders)
  

  

  const handleCancelOrder = async ()=>{
      try {
        
      } catch (error) {
        
      }
  }

  if (isLoading) return <Spinner />;
  if (isError)
    return <div className="text-gray-400 ">something went wrong!</div>;
  if (allOrders.length === 0)
    return (
      <div className="w-full text-gray-500 text-center text-3xl mt-5">
        order cart is empty!
      </div>
    );
  return (
    <div className=" h-screen bg-transparent grid grid-cols-13  ">
      <div className="col-span-8">
        {allOrders.map((order) => (
          <div className="border-b-1 border-gray-500">
            <SummaryOfOrder
              onCancel={handleCancelOrder}
              total={order.total}
              shippingCharges={order?.shippingCharges}
              tax={order.tax}
              discount={order.discount}
              status={order.status}
            />
            {order?.orderItems?.map((product) => (
              <OrderCard
                discount={order.discount}
                name={product.name}
                photo={product.photo}
                quantity={product.quantity}
                price={product.price}
                
              />
            ))}
          </div>
        ))}
        <div className="w-full flex flex-row justify-center items-center gap-3">
          <Button
            title="prev"
            onClick={() => setPage((prev) => prev - 1)}
            disabled={page === 1}
          />
          <span>
            {page} of {data?.totatPages || 1}
          </span>
          <Button
            title="next"
            onClick={() => {}}
            disabled={page === data?.totatPages}
          />
        </div>
      </div>
    </div>
  );
}

export default MyOrders;
