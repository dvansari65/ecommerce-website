import React, { useEffect } from 'react'
import { ArrowDown, ArrowUp } from "lucide-react"
import Spinner from '@/components/features/LoaderIcon';
import { useDecreaseQuantityMutation, useDeleteCartProductMutation, useGetCartProductsQuery, useIncreaseProductQuantityMutation } from '@/redux/api/cartApi';
import toast from 'react-hot-toast';


function CartItem() {
    const { data, isError, isLoading } = useGetCartProductsQuery()
    const [deleteCartProduct] = useDeleteCartProductMutation()
    const [increaseProductQuantity] = useIncreaseProductQuantityMutation()
    const [decreaseQuantity ] = useDecreaseQuantityMutation()
    // useEffect(() => {
    //     console.log("product data", data)
    // }, [data])
    const decreaseProductQuantity = async(productId:string)=>{
        try {
            const res = await decreaseQuantity({productId})
            if(res.data?.success){
                toast.success(res.data?.message)
            }else{
                toast.error(res.data?.message || "response not obtain from backend!")
            }
        } catch (error) {
            toast.error("failed to decrease the quantity!")
        }
    }
    const increaseQuantity = async (productId:string)=>{
        try {
            const res = await increaseProductQuantity({productId})
            if(res.data?.success){
                toast.success(res.data?.message)
            }
        } catch (error) {
            toast.error("failed to increase the quantity!")
            console.log("error:",error)
        }
    }

    const deleteProductFromCart = async (productId: string) => {
        try {
            const response = await deleteCartProduct({ productId })
            console.log("response:", response)
            if (response.data?.success) {
                toast.success(response.data?.message)
            }
        } catch (error) {
            console.error("failed to delete the product!")
            toast.error("failed to delete the product!")
        }
    }


    if (isLoading) return <Spinner />
    if (isError) return <div className='text-red-500 flex justify-center items-center'>FAILED TO FETCH CART PRODUCTS!</div>
    if (data?.success === false) return <div className='text-3xl text-gray-500 w-full  text-center'>cart is empty!</div>

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
                            <div onClick={() => deleteProductFromCart(product.productId._id)} className=' p-2 rounded-xl  text-gray-200 hover:bg-[rgb(135,106,137)]'>
                                <button> cancel </button>
                            </div>
                            <div className='flex flex-row justify-start gap-2 items-center mt-2 ml-6'>
                                <div className='flex justify-center gap-2 text-white'>
                                    <button onClick={()=>decreaseProductQuantity(product.productId._id)}  ><ArrowDown /></button>
                                    <span >
                                        {product.quantity}
                                    </span>
                                    <button onClick={()=>increaseQuantity(product.productId._id)} ><ArrowUp /></button>
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
