
import { useGetCartDetailsQuery } from '@/redux/api/cartApi'
import { Loader } from 'lucide-react'
import { Link } from 'react-router-dom'


function CartDetails() {
    const { data, isLoading, isError } = useGetCartDetailsQuery()
    return (
        <div className='col-span-4 px-2  bg-transparent border-none'>
            <div>
                <div className='flex justify-between items-center'>
                    <span>subtotal:</span>
                    {isLoading ? <Loader size={12} /> :
                        (<span className='flex justify-end items-center m-3'>Rs.{data?.cartDetails?.subtotal}</span>)
                    }
                    {
                        isError && <span className='text-red-400'>?</span>
                    }
                </div>
                <div className='flex justify-between items-center'>
                    <span>shippingCharges:</span>
                    {isLoading ? <Loader size={12} /> :
                        (<span className='flex justify-end items-center m-3'>Rs.{data?.cartDetails?.shippingCharges}</span>)
                    }
                    {
                        isError && <span className='text-red-400'>?</span>
                    }
                </div>
                <div className='flex justify-between items-center'>
                    <span>tax:</span>
                    {isLoading ? <Loader size={12} /> :
                        (<span className='flex justify-end items-center m-3'>Rs.{data?.cartDetails?.tax}</span>)
                    }
                    {
                        isError && <span className='text-red-400'>?</span>
                    }
                </div>
            </div>

            <div className='w-full flex justify-center flex-row bg-transparent'>
                <Link to="/place-order-from-cart" className='w-[150px] bg-[#2a1e30] rounded-xl  hover:bg-[#3a2a40]  flex justify-center items-center p-2 '>Place order</Link>
            </div>
        </div>
    )
}

export default CartDetails