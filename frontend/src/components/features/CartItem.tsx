import React from 'react'
import { ArrowDown, ArrowUp } from "lucide-react"
import {
  useDecreaseQuantityMutation,
  useDeleteCartProductMutation,
  useIncreaseProductQuantityMutation
} from '@/redux/api/cartApi';
import toast from 'react-hot-toast';
import type { cartProduct } from '@/types/api-types';
type productsType = {
  products: cartProduct[]
}

function CartItem({ products }: productsType) {

  const [deleteCartProduct] = useDeleteCartProductMutation();
  const [increaseProductQuantity] = useIncreaseProductQuantityMutation();
  const [decreaseQuantity] = useDecreaseQuantityMutation();

  const decreaseProductQuantity = async (productId: string) => {
    try {
      const res = await decreaseQuantity({ productId });
      res.data?.success
        ? toast.success(res.data.message)
        : toast.error(res.data?.message || "Failed to decrease");
    } catch {
      toast.error("Failed to decrease quantity!");
    }
  };

  const increaseQuantity = async (productId: string) => {
    try {
      const res = await increaseProductQuantity({ productId });
      if (res.data?.success) toast.success(res.data.message);
    } catch {
      toast.error("Failed to increase quantity!");
    }
  };

  const deleteProductFromCart = async (productId: string) => {
    try {
      const res = await deleteCartProduct({ productId });
      if (res.data?.success) toast.success(res.data.message);
    } catch {
      toast.error("Failed to remove product!");
    }
  };


  return (
    <div className="space-y-5 px-4">
      {products?.map(product => (
        <div
          key={product._id}
          className="bg-[#1b1321] hover:border-[#b075f5] border border-[#3f2e40] rounded-2xl p-4 shadow-lg hover:shadow-purple-500/20 transition-all cursor-pointer flex items-center justify-between"
        >
          {/* Image */}
          <div className="flex-shrink-0">
            {product?.productId?.photo && (
              <img
                src={product.productId.photo}
                alt="product"
                className="size-16 rounded-xl object-contain border border-[#6b65e1]/20"
              />
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col flex-grow ml-4 text-white">
            <span className="text-base font-semibold truncate">{product?.productId?.name}</span>
            <span className="text-sm text-gray-400">Category: {product?.productId?.category}</span>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-end gap-3">
            {/* Quantity */}
            <div className="flex items-center gap-2 text-white">
              <button
                onClick={() => decreaseProductQuantity(product.productId._id)}
                className="bg-[#2a1e30] p-2 rounded-full hover:bg-[#3a2a40] transition"
              >
                <ArrowDown size={16} />
              </button>
              <span className="text-lg">{product.quantity}</span>
              <button
                onClick={() => increaseQuantity(product.productId._id)}
                className="bg-[#2a1e30] p-2 rounded-full hover:bg-[#3a2a40] transition"
              >
                <ArrowUp size={16} />
              </button>
            </div>

            {/* Remove */}
            <button
              onClick={() => deleteProductFromCart(product.productId._id)}
              className="text-sm text-red-400 hover:underline hover:text-red-500 transition"
            >
              Remove
            </button>
          </div>
        </div>
      ))}

    </div>
  );
}

export default CartItem;
