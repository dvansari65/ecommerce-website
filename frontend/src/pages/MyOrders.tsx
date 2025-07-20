import Button from "@/components/features/Button";
import OrderCard from "@/components/features/OrderCard";
import SummaryOfOrder from "@/components/features/SummaryOfOrder";
import Spinner from "@/components/ui/LoaderIcon";

import { useDeleteOrderMutation, useMyOrderQuery } from "@/redux/api/orderApi";
import { useState } from "react";
import toast from "react-hot-toast";

function MyOrders() {
  const [page, setPage] = useState<number>(1);
  const { data, isError, isLoading } = useMyOrderQuery({ page });

  const [deleteOrder] = useDeleteOrderMutation();

  const allOrders = data?.orders || [];

  const handleCancelOrder = async (orderId: string) => {
    try {
      const res = await deleteOrder({ orderId });
      if (res.data?.success) {
        toast.success(res?.data?.message || "order deleted!");
      } else {
        toast.error("failed to delete order!");
      }
    } catch (error: any) {
      console.log("failed to delete the order!", error);
      toast.error(error.data?.message || "failed to delete the order!");
    }
  };

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
              onCancel={() => handleCancelOrder(order._id)}
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
