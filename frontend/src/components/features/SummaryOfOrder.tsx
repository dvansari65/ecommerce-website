import React from 'react'

interface summaryProps {
    _id:string,
    total:number,
    shippingCharges:number,
    discount:number,
    status:string,
    tax:string
}

function SummaryOfOrder({
    _id,
    total,
    shippingCharges,
    discount,
    status,
    tax
}:summaryProps) {
  return (
    <div className='w-full min-h-[100px] p-2 py-3 bg-transparent mb-3 '>
        <div className='w-full py-2 bg-transparent flex justify-between'>
            <span className='font-[12] text-2xl'>SUMMARY:</span>
            <button className='bg-[rgb(89,86,86)] mr-5 px-5 py-1 text-[rgb(249,59,59)] border-[1px] border-gray-400 ease-in-out duration-200 hover:border-[rgb(244,114,114)] rounded-xl'>
                cancel
            </button>
        </div>
        <div className='flex flex-col justify-start items-center w-full'>
           <div className=' w-full grid grid-cols-6'>
            <span>Total</span>
            <span className='col-span-2 flex justify-center'>{total || 2000}</span>
           </div>
           <div className=' w-full grid grid-cols-6'>
            <span>Shipping charges</span>
            <span className='col-span-2 flex justify-center'>{shippingCharges || 0}</span>
           </div>
           <div className=' w-full grid grid-cols-6'>
            <span>discount</span>
            <span className='col-span-2 flex justify-center'>{discount || 0}</span>
           </div>
           <div className=' w-full grid grid-cols-6'>
            <span>status</span>
            <span className='col-span-2 flex justify-center'>{status || "processing"}</span>
           </div>
           <div className=' w-full grid grid-cols-6'>
            <span>tax</span>
            <span className='col-span-2 flex justify-center'>{tax || 2000}</span>
           </div>
        </div>
    </div>
  )
}

export default SummaryOfOrder