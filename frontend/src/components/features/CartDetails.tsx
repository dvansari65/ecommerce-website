import Spinner from '@/components/features/LoaderIcon'
import { useGetCartDetailsQuery } from '@/redux/api/cartApi'
import { Loader } from 'lucide-react'
import React, { useEffect } from 'react'

function CartDetails() {
const {data,isLoading,isError} = useGetCartDetailsQuery()
useEffect(()=>{
    console.log("data:",data)
    console.log("data.det:",data?.cartDetail);
    
},[data])
  return (
    <div className='col-span-4 px-2  bg-transparent border-none'>
        <div className='flex justify-between items-center'>
            <span>subtotal:</span>
            { isLoading ? <Loader size={12}/> : 
               (<span className='flex justify-end items-center m-3'>Rs.{data?.cartDetail?.subtotal}</span>)
            }
            {
                isError && <span className='text-red-400'>?</span>
            }
        </div>
        <div className='flex justify-between items-center'>
        <span>shippingCharges:</span>
            { isLoading ? <Loader size={12}/> : 
               (<span className='flex justify-end items-center m-3'>Rs.{data?.cartDetail?.shippingCharges}</span>)
            }
            {
                isError && <span className='text-red-400'>?</span>
            }
        </div>
        <div className='flex justify-between items-center'>
        <span>tax:</span>
            { isLoading ? <Loader size={12}/> : 
               (<span className='flex justify-end items-center m-3'>Rs.{data?.cartDetail?.tax}</span>)
            }
            {
                isError && <span className='text-red-400'>?</span>
            }
        </div>
    </div>
  )
}

export default CartDetails