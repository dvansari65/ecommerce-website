import Input from '@/components/features/Input'
import type { createPaymentResponse, productTypeFromOrder, shippingInfo } from '@/types/api-types'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import { saveNumericalData, saveOrderItems, saveShippingInfo } from '@/redux/reducer/cartReducer'
import CheckCoupon from '@/components/features/CreateCoupon'
import { server } from '@/config/constants'
import type { RootState } from '@/redux/reducer/store'
import Spinner from '@/components/features/LoaderIcon'


function ShippingInfo() {
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const { code } = useSelector((state: RootState) => state.couponReducer)
  const [message, setMessage] = useState("")
  const navigate = useNavigate()
  const [formData, setFormData] = useState<shippingInfo>({
    state: "",
    pinCode: 1212,
    address: "",
    city: "",
    country: "",
  })


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true)
    dispatch(saveShippingInfo(formData))
    try {
      if (!code) {
        const { data }: { data: createPaymentResponse } = await axios.post(`${server}/api/v1/coupon/create-payment-from-cart`, {
          shippingInfo: formData
        },
          {
            withCredentials: true
          }
        )
        let items: productTypeFromOrder[] = data.cart.items.map(i => ({
          name: i.productId?.name || "",
          photo: i.productId?.photo || "",
          price: i.productId?.price || 0,
          quantity: i.quantity || 1,
          productId: i.productId?._id || ""
        }));
        dispatch(saveOrderItems(items))

        dispatch(saveOrderItems(items))

        dispatch(saveNumericalData({
          subtotal: data.subtotal,
          tax: data.tax,
          shippingCharges: data.shippingCharges,
          discount: data.discount,
          total: data.total
        }))

        navigate("/payment", {
          state: data.clientSecret
        })
        setIsLoading(false)
      } else {
        setIsLoading(true)
        const { data }: { data: createPaymentResponse } = await axios.post(`${server}/api/v1/coupon/create-payment-from-cart?code=${code}`,
          {
            shippingInfo: formData
          },
          {
            withCredentials: true
          }
        )

        let items: productTypeFromOrder[] = data.cart.items.map(i => ({
          name: i.productId?.name || "",
          photo: i.productId?.photo || "",
          price: i.productId?.price || 0,
          quantity: i.quantity || 1,
          productId: i.productId?._id || ""
        }));
        dispatch(saveOrderItems(items))

        dispatch(saveNumericalData({
          subtotal: data.subtotal,
          tax: data.tax,
          shippingCharges: data.shippingCharges,
          discount: data.discount,
          total: data.total
        }))

        navigate("/payment", {
          state: data.clientSecret
        })
        setIsLoading(false)
      }
    } catch (error: any) {
      console.log(error.message)
    }
  }
  if (isLoading) return <div className='w-full h-screen flex justify-center items-center '><Spinner /></div>

  return (
    <div className='h-screen w-full' >
      <div className='grid grid-cols-2 '>
        <div className='col-span-1 flex flex-col justify-center items-end h-[80vh] mr-5'>
          <span>{message}</span>
          <form className='p-4  w-[60vh] h-full flex flex-col justify-center items-center gap-2 bg-transparent border-[1px] border-color ' onSubmit={handleSubmit}>
            <Input
              required={true}
              label='ADDRESS'
              value={formData.address}
              placehHolder='address..'
              onChange={(e) => {
                setFormData(prev => (
                  {
                    ...prev,
                    address: e.target.value
                  }
                ))
                setMessage("")
              }}
              id='address'
              type='text'
              htmlFor="address"
            />
            <Input
              required={true}
              label='CITY'
              value={formData.city}
              placehHolder='e.g PUNE'
              onChange={(e) => {
                setFormData(prev => (
                  {
                    ...prev,
                    city: e.target.value
                  }
                ))
                setMessage("")
              }}
              id='city'
              type='text'
              htmlFor="city"
            />
            <Input
              required={true}
              label='STATE'
              value={formData.state}
              placehHolder='e.g MAHARASHTRA'
              onChange={(e) => {
                setFormData(prev => (
                  {
                    ...prev,
                    state: e.target.value
                  }
                ))
                setMessage("")
              }}
              id='state'
              type='text'
              htmlFor="state"
            />
            <Input
              required={true}
              label='COUNTRY'
              value={formData.country}
              placehHolder={"e.g. INDIA"}
              onChange={(e) => {
                setFormData(prev => (
                  {
                    ...prev,
                    country: e.target.value
                  }
                ))
                setMessage("")
              }}
              id='country'
              type='text'
              htmlFor="country"
            />
            <Input
              required={true}
              label='PINCODE'
              value={formData.pinCode}
              placehHolder='0000'
              onChange={(e) => {
                setFormData(prev => (
                  {
                    ...prev,
                    pinCode: Number(e.target.value)
                  }
                ))
                setMessage("")
              }}
              id='pinCode'
              type='number'
              htmlFor="pinCode"
            />
            <div className='w-full flex justify-center items-center mt-4 '>
              <button className='text-white w-[150px] border-[1px] border-[#322d5e]  p-2 rounded-[4px] hover:border-[#ae90f4] transition-all duration-200 ease-in-out '>SUBMIT</button>
            </div>
          </form>
        </div>
        <div className='col-span-1 flex flex-col justify-center items-center'>
          <CheckCoupon />
        </div>
      </div>
    </div>
  )
}

export default ShippingInfo
