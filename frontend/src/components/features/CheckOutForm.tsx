import { useClearCartMutation } from '@/redux/api/cartApi'
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

    const [clearCart] = useClearCartMutation()
    const [createOrder] = useCreateOrderMutation()
    const [deleteCoupon] = useDeleteCouponMutation()

    const { shippingCharges, shippingInfo, orderItems, total, subtotal, tax } = useSelector((state: RootState) => state.cartReducer)
    const { amount, _id } = useSelector((state: RootState) => state.couponReducer)

    const createOrderData: orderReponse = {
        orderItems,
        shippingInfo:{
            address:shippingInfo.address,
            state:shippingInfo.state,
            country:shippingInfo.country,
            city:shippingInfo.city,
            pinCode:shippingInfo.pinCode,
        },
        shippingCharges,
        total,
        subtotal,
        tax,
        discount: amount || 0
    }

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
            console.log("started creating order>>1")
            if (paymentIntent.status === "succeeded") {
                try {
                    console.log("started creating order>>")
                    console.log("_id", _id)
                    const [orderRes, couponRes] = await Promise.all([
                        createOrder(createOrderData).unwrap(),
                        clearCart().unwrap()
                    ])
                    if (orderRes.success && couponRes?.success) {
                        toast.success("order process is done successfully!")
                        console.log("order successfull!")
                        navigate("/my-orders", {
                            state: orderRes
                        })
                    }

                } catch (error: any) {
                    const message = error?.message  || "Order processing failed";
                    console.error("error:", message);
                    toast.error(message);
                    navigate("/place-order-from-cart")
                }
            }
        } catch (error: any) {
            console.log("error:", error.message)
            toast.error(error.message)
            navigate("/place-order-from-cart")
        }
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