import { useApplyDiscountMutation } from '@/redux/api/couponApi'
import { setCoupon } from '@/redux/reducer/couponReducer'
import { Loader } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'

function CheckCoupon() {
    const [couponCode, setCouponCode] = useState<string>("")
    const [applyDiscount, {  isLoading }] = useApplyDiscountMutation()
    const dispatch = useDispatch()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("res:")
        try {
            const res = await applyDiscount({ code: couponCode }).unwrap()
            console.log(res)
            if (res.success) {
                toast.success("coupon matched!")
                dispatch(setCoupon(res.discount))
            } else {
                const message = res.message || "coupon not matched! try again"
                toast.error(message)
            }
        } catch (error:any) {
            console.log("error:", error);
            toast.error(error.data.message || "something went wrong")
        }
    }
    

    return (
        <form className='flex flex-col justify-center items-center relative ' onSubmit={handleSubmit}>
            {
                isLoading && <Loader className="absolute top-4 right-76 "/>
            }
            <div className='  w-full flex flex-col gap-4 justify-center  '>
                <input
                    className='w-[300px] py-3 px-2 rounded-[4px] border-color border-[1px]'
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder='enter guess code..'
                />
                <div className='w-full flex justify-center items-center'>
                <button type='submit' className='mt-5 border-[1px] border-[#322d5e] w-[170px] rounded-[4px] py-2 '>CHECK</button>
                </div>
            </div>
        </form>
    )
}

export default CheckCoupon