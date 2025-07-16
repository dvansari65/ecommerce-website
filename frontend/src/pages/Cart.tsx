import React from 'react'
import CartItem from '../components/features/CartItem'

import CartDetails from '@/components/features/CartDetails';
import { useGetCartProductsQuery } from '@/redux/api/cartApi';
import Spinner from '@/components/ui/LoaderIcon';
function Cart() {
  const { data, isError, isLoading } = useGetCartProductsQuery();

  if (isLoading) return <Spinner />;
  if (isError) return <div className="text-red-500 text-center mt-10">Failed to fetch cart products!</div>;
  if (data?.success === false || data?.products?.length === 0)
    return <div className="text-gray-400 text-xl text-center mt-10">Your cart is empty.</div>;

  return (
    <div className="relative grid grid-cols-12 w-full h-screen overflow-y-auto bg-[#0f0c29] text-white">

      {/* Glowing Blue Top-Left */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl pointer-events-none z-0" />

      {/* Glowing Purple Bottom-Center */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[500px] h-[500px] bg-[#b075f5]/30 rounded-full blur-[150px] pointer-events-none z-0" />

      {/* Left: Cart Items */}
      <div className="col-span-8 z-10 h-full border-r border-[#6b65e1]/30 p-6 bg-transparent">
        <h2 className="text-2xl font-semibold text-white mb-4">Your Cart</h2>
        <CartItem products={data?.products || []}/>
      </div>

      {/* Right: Order Summary */}
      <CartDetails/>
    </div>
  )
}

export default Cart;
