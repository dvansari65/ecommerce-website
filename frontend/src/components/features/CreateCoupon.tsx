import { useApplyDiscountMutation } from '@/redux/api/couponApi'
import { setCoupon } from '@/redux/reducer/couponReducer'
import { Loader } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'

function CheckCoupon() {
    const [couponCode, setCouponCode] = useState<string>("")
    const [message, setMessage] = useState("")
    const [applyDiscount, { isLoading }] = useApplyDiscountMutation()
    const dispatch = useDispatch()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            if (couponCode && couponCode !== null) {
                const res = await applyDiscount({ code: couponCode }).unwrap()
                if (res?.success) {
                    toast?.success("coupon matched!")
                    setMessage("Please Submit Information To Proceed ! You Will Get DISCOUNT!!")
                    dispatch(setCoupon({
                        amount: res.discount.amount,
                        code: res.discount.code,
                        _id: res.discount._id
                    }))
                    setCouponCode("")
                } else {
                    const message = res.message || "coupon not matched! try again"
                    setCouponCode("")
                    setMessage("")
                    toast.error(message)

                }
            }else{
                dispatch(setCoupon({}))
                setCouponCode("")
                setMessage("")
            }
        } catch (error: any) {
            setCouponCode("")
            setMessage("")
            console.log("error:", error.message);
            toast.error(error.data.message || "something went wrong!")
        }
    }


    return (
        <form className='flex flex-col justify-center items-center relative ' onSubmit={handleSubmit}>
            {
                isLoading && <Loader className="absolute top-4 right-76 " />
            }
            <div className='  w-full flex flex-col gap-4 justify-center  '>
                <div className='w-full flex justify-center items-center'>
                    <input
                        className='w-[300px] py-3 px-2 rounded-[4px] border-color border-[1px]'
                        type="text"
                        value={couponCode}
                        onChange={(e) => {
                            setCouponCode(e.target.value)

                        }}
                        placeholder='enter guess code..'
                    />
                </div>
                <div className='w-full flex justify-center items-center'>
                    <button type='submit' className='mt-5 border-[1px] border-[#322d5e] w-[170px] rounded-[4px] py-2 '>CHECK</button>
                </div>
                <span className='text-green-400 my-2 '>{message}</span>
            </div>
        </form>
    )
}

export default CheckCoupon