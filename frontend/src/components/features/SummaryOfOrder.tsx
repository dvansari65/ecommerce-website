import React from 'react'

interface summaryProps {
    _id?:string,
    total:number,
    shippingCharges:number,
    discount:number,
    status:string,
    tax:number,
    onCancel : ()=>void
}

function SummaryOfOrder({
    onCancel,
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
            <button onClick={onCancel} className='bg-[rgb(89,86,86)] mr-5 px-5 py-1 text-[rgb(249,59,59)] border-[1px] border-gray-400 ease-in-out duration-200 hover:border-[rgb(244,114,114)] rounded-xl'>
                cancel
            </button>
        </div>
        <div className='flex flex-col justify-start items-center w-full'>
           <div className=' w-full grid grid-cols-6'>
            <span className='text-[rgb(246,72,66)]'>tax</span>
            <span className='col-span-2 flex justify-center'>Rs. {tax}</span>
           </div>
           <div className=' w-full grid grid-cols-6'>
            <span className='text-[rgb(246,72,66)]'>Shipping charges</span>
            <span className='col-span-2 flex justify-center '>Rs. {shippingCharges}</span>
           </div>
           <div className=' w-full grid grid-cols-6'>
            <span className='text-[rgb(93,246,66)]'>discount</span>
            <span className='col-span-2 flex justify-center'>Rs. {discount }</span>
           </div>
           <div className=' w-full grid grid-cols-6'>
            <span className='text-[rgb(93,246,66)]'>status</span>
            <span className='col-span-2 flex justify-center'>{status }</span>
           </div>
           <div className=' w-full grid grid-cols-6'>
            <span className='text-[rgb(246,66,66)]'>Total</span>
            <span className='col-span-2 flex justify-center '>Rs. {total }</span>
           </div>
        </div>
    </div>
  )
}

export default SummaryOfOrder