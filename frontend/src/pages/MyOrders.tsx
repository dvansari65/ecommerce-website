import Button from "@/components/features/Button";
import OrderCard from "@/components/features/OrderCard";
import Spinner from "@/components/ui/LoaderIcon";
import { useMyOrderQuery } from "@/redux/api/orderApi";
import { useEffect, useState } from "react";


function MyOrders() {
  const [page, setPage] = useState<number>(1);
  const { data, isError, isLoading } = useMyOrderQuery({ page });
 
  const allOrders = data?.orders
 

  const handleIncrease = async () => {};
  const handleDecrease = async () => {};
  useEffect(() => {
    console.log("data:", allOrders);
    
  }, [data]);

  if (isLoading) return <Spinner />;
  if (isError) return <div className="text-gray-400 ">something went wrong!</div>;

  return (
    <div className=" h-screen bg-transparent grid grid-cols-13  ">
      <div className="col-span-8">
       {
        allOrders?.map(order=>(
          <OrderCard 
          shippingCharges={order.shippingCharges} 
          total={order.total} 
          discount={order.discount} 
          status={order.status} 
          tax={order.tax}
          createdAt={order.createdAt}
          orderItems={order.orderItems}
          increaseQuantity={handleIncrease}
          decreaseQuantity={handleDecrease}
          />
        ))
       }
        <div className="w-full flex flex-row justify-center items-center gap-3">
          <Button title="prev" onClick={()=>setPage(prev=>prev-1)} disabled={page === 1} />
            <span>{page} of {data?.totatPages || 1}</span>
          <Button title="next" onClick={()=>{}} disabled={page === data?.totatPages} />
        </div>
      </div>
    </div>
  );
}

export default MyOrders;
