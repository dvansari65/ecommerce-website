import { useGetDiscountMutation } from '@/redux/api/couponApi'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { Loader } from "lucide-react"
function GenerateCouponBtn() {
    const [code, setCode] = useState<string>("")
    const [message, setMessage] = useState("")
    const [getDiscount, { isLoading }] = useGetDiscountMutation()
    const handleGenerateCoupon = async ({ code }: { code: string }) => {
        try {
            const res = await getDiscount({ code }).unwrap()
            console.log("res:", res)
            if (res.success) {
                toast.success(`you got Rs.${res.discount} discount`)
                setMessage(res.message)
                setCode("")
            } else {
                toast.error(res.message || "code doesn't matched!")
                setMessage(res.message)
                setCode("")
            }
        } catch (error: any) {
            const message = error.data.message || error?.message || "coupon not found!"
            toast.error(message)
            setMessage(message)
            console.log("failed to generate code!", error)
            setCode("")
        }
    }
    if (isLoading) return <Loader size={14} />
   
    return (
        <>
            <div className='flex flex-col gap-2 '>
                <span className='text-[rgb(227,62,62)] border-b border-[rgb(74,73,74)]'>{message}</span>
                <input value={code} type="text" onChange={(e) => setCode(e.target.value)} placeholder='enter code..' className='w-full hover:border-[#b075f5] border-[#3f2e40] h-9 border-[0.5px] rounded-[3px] pl-3 pb-1' />
                <button onClick={() => {
                    if (!code) return toast.error("Please enter a valid code");
                    handleGenerateCoupon({ code });
                }} className="mt-6 w-full bg-[#6b65e1] hover:bg-[#7a74f2] text-white py-3 rounded-full transition font-semibold shadow-xl hover:shadow-[#6b65e1]/50">
                    enter code
                </button>
            </div>
        </>
    )
}

export default GenerateCouponBtn