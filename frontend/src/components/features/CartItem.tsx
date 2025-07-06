import React, { useEffect } from 'react'
import { ArrowDown, ArrowUp } from "lucide-react"
import Spinner from '@/components/features/LoaderIcon';
import { useGetCartProductsQuery } from '@/redux/api/cartApi';
type CartMethodType = {
    cancelAddToCart: () => void,
    increaseQuantity: () => void,
    decreaseQuantity: () => void
}

function CartItem({ cancelAddToCart, increaseQuantity, decreaseQuantity }: CartMethodType) {
    const { data, isError, isLoading } = useGetCartProductsQuery()
    useEffect(() => {
        console.log("product data", data)
    }, [data])
    if (isLoading) return <Spinner />
    if (isError) return <div className='text-red-500 flex justify-center items-center'>FAILED TO FETCH CART PRODUCTS!</div>
    if(data?.success === false) return <div className='text-3xl text-red-400 w-full  text-center'>cart not found!</div>
       
    return (
        <div>
            {
                data?.products?.map(product => (
                    <div key={product._id} className='grid grid-rows-1 grid-cols-10 gap-2 m-2 mt-2 p-3 rounded-2xl bg-[rgb(103,78,105)] min-h-[110px] border-[1px] border-gray-500'>
                        <div className='col-span-1 '>
                            {
                                product?.productId?.photo && (
                                    <img src={product?.productId?.photo} className='rounded-xl size-16' />
                                )
                            }
                        </div>
                        <div className='flex flex-col items-start justify-start col-span-6 text-white p-2 mt-2'>
                            
                            <span>{product?.productId?.name}</span>
                        </div>
                        <div className='col-span-3 flex flex-row justify-start  items-start p-3 '>
                            <div onClick={cancelAddToCart} className=' p-2 rounded-xl  text-gray-200 hover:bg-[rgb(135,106,137)]'>
                                <button> cancel </button>
                            </div>
                            <div className='flex flex-row justify-start gap-2 items-center mt-2 ml-6'>
                                <div className='flex justify-center gap-2 text-white'>
                                    <button onClick={decreaseQuantity}><ArrowDown /></button>
                                    <span >
                                        {product.quantity}
                                    </span>
                                    <button onClick={increaseQuantity}><ArrowUp /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default CartItem
