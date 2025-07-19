
import { useDeleteCouponMutation } from '@/redux/api/couponApi'
import { useCreateOrderMutation } from '@/redux/api/orderApi'
import type { RootState } from '@/redux/reducer/store'
import type { orderReponse } from '@/types/api-types'
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'



function CheckOutForm() {
    const [processing, setProcessing] = useState(false)
    const navigate = useNavigate()
    const stripe = useStripe()
    const elements = useElements()

    const [createOrder, { isError: orderError }] = useCreateOrderMutation()
    const [deleteCoupon, { isError }] = useDeleteCouponMutation()

    const { shippingCharges, shippingInfo, orderItems, total, subtotal, tax } = useSelector((state: RootState) => state.cartReducer)
    const { amount, _id } = useSelector((state: RootState) => state.couponReducer)


    const createOrderData: orderReponse = {
        orderItems,
        _id,
        createdAt:"",
        shippingInfo,
        shippingCharges,
        status: "",
        total,
        subtotal,
        tax,
        discount: amount || 0
    }
    console.log("createOrderData",createOrderData)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!stripe || !elements) return;
        setProcessing(true)
        try {
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: { return_url: window.location.origin },
                redirect: "if_required"
            })

            if (error) {
                setProcessing(false)
                throw error
            }

            if (paymentIntent.status === "succeeded") {
                try {

                    const [orderRes] = await Promise.all([
                        createOrder(createOrderData).unwrap(),
                        
                    ])
                    if (_id) {
                        try {
                            const res = await deleteCoupon({ id: _id })
                            if(res.data?.success){
                                toast.success(res.data.message || "coupon deleted!")
                                console.log("res.data.message",res.data.message)
                            }
                        } catch (error:any) {
                            toast.error(error.data?.message || "failed to delete coupon!")
                            console.log("error",error)
                        }
                    }

                    if (orderRes.success) {
                        toast.success("order process is done successfully!")

                        navigate("/my-orders", {
                            state: {
                                orderRes,
                                _id
                            }
                        })
                    }

                } catch (error: any) {
                    const message = error?.message || "Order processing failed";
                    toast.error(message);
                    navigate("/place-order-from-cart")
                }
            }
        } catch (error: any) {
            toast.error(error.message)
            navigate("/place-order-from-cart")
        }
    }

    if (orderError) {
        console.log(orderError)
    }

    return (
        <form className='flex flex-col justify-center items-center w-full mt-10  ' onSubmit={handleSubmit}>
            <PaymentElement />
            <div className='flex justify-center items-center w-full bg-transparent mt-3 p-2'>
                <button disabled={processing} className=' text-white w-[100px] bg-green-600 p-1 rounded-[2px] border-[1px] border-transparent hover:border-[#7bf48d] gradient-all ease-in-out duration-200 ' type='submit'>{processing ? "processing..." : "pay"}</button>
            </div>
        </form>
    )
}

export default CheckOutForm