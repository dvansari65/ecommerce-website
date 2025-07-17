import Button from "@/components/features/Button";
import OrderCard from "@/components/features/OrderCard";
import Spinner from "@/components/ui/LoaderIcon";
import {
  useIncreaseQuantityMutation,
  useMyOrderQuery,
} from "@/redux/api/orderApi";
import {  useState } from "react";
import toast from "react-hot-toast";

function MyOrders() {
  const [page, setPage] = useState<number>(1);
  const { data, isError, isLoading } = useMyOrderQuery({ page });
  const [increaseQuantityFromOrders] = useIncreaseQuantityMutation();
  const allOrders = data?.orders || [];

  const handleIncrease = async (productId: string, orderId: string) => {
    try {
      const res = await increaseQuantityFromOrders({
        productId,
        orderId,
        page,
      });
      console.log("res:", res);
      if (res.data?.success) {
        toast.success(res.data.message || "quantity increased!");
      } else {
        toast.error(res.data?.message || "failed to increase quantity!");
      }
    } catch (error: any) {
      toast.error(
        error.data.message || error.message || "stock limit reached!"
      );
      console.error("eerror:", error.data);
    }
  };
  const handleDecrease = async () => {};

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
        {allOrders?.map((order) => (
          <div key={order._id}>
            <OrderCard
              _id={order._id}
              shippingCharges={order.shippingCharges}
              total={order.total}
              discount={order.discount}
              status={order.status}
              tax={order.tax}
              page={page}
              createdAt={order.createdAt || ""}
              orderItems={order.orderItems}
              increaseQuantity={() => {
                order.orderItems.map((product) => {
                  handleIncrease(order?._id.toString(), product?.productId.toString());
                });
              }}
              decreaseQuantity={handleDecrease}
            />
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
