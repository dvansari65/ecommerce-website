import React from 'react'
interface orderDetailType  {
    subTotal:number,
    shippingCharges:number,
    tax:number,
    discount:number,
    total:number,
    onGenerate:()=>void
}
function OrderDetail({subTotal,shippingCharges,tax,discount,total,onGenerate}:orderDetailType) {
  return (
    <div className="col-span-4 z-10 h-full p-6 bg-transparent flex flex-col justify-between">
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Order Summary</h2>

      <div className="border-t border-[#6b65e1]/30 pt-4">
        <div className="flex justify-between text-sm text-gray-300 mb-3">
          <span>Subtotal</span>
          <span>{subTotal || "₹XX"}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-300 mb-3">
          <span>Shipping</span>
          <span>{shippingCharges || "₹XX"}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-300 mb-3">
          <span>tax:</span>
          <span>{tax || "₹XX"}</span>
        </div>
        <div className="flex justify-between text-sm text-green-300 mb-3">
          <span>Discount</span>
          <span>{discount || "₹XX"}</span>
        </div>
        <div className="flex justify-between text-lg font-semibold border-t border-[#6b65e1]/30 pt-3 text-white">
          <span>Total</span>
          <span>{total || "₹YYYY"}</span>
        </div>
      </div>
    </div>

    <div className='flex flex-col gap-2 '>
      <span className='text-[rgb(227,62,62)] border-b border-[rgb(74,73,74)]'>checking code is right or wrong!</span>
      <input type="text" placeholder='generate code..' className='w-full hover:border-[#b075f5] border-[#3f2e40] h-9 border-[0.5px] rounded-[3px] pl-3 pb-1' />
      <button onClick={onGenerate} className="mt-6 w-full bg-[#6b65e1] hover:bg-[#7a74f2] text-white py-3 rounded-full transition font-semibold shadow-xl hover:shadow-[#6b65e1]/50">
       Generate coupon
      </button>
    </div>
  </div>
  )
}

export default OrderDetail