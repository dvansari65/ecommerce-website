import Input from '@/components/features/Input'
import { setShippingInfo } from '@/redux/reducer/userReducer'
import type { shippingInfo } from '@/types/api-types'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function ShippingInfo () {
  const dispatch = useDispatch()
  const [message,setMessage] = useState("")
  const navigate = useNavigate()
  const [formData, setFormData] = useState<shippingInfo>({
    state: "",
    pinCode: 1212,
    address: "",
    city: "",
    country: "",
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
   if(formData){
    dispatch(setShippingInfo(formData))
    navigate("/create-payment")
   }else{
      setMessage("all fields are required!")
   }
  }

  return (
    <div className='w-full h-screen bg-[#0f0c29] flex justify-center items-center flex-col gap-2  '>
      <span className='text-red-400 text-[13px]'>{message}</span>
      <form className='flex justify-center items-start  border-[1px] p-6 border-color flex-col gap-2 mb-20' onSubmit={handleSubmit}>
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
                address: e.target.value
              }
            ))
            setMessage("")
          }}
          id='pinCode'
          type='number'
          htmlFor="pinCode"
        />
        <div className='mt-3 w-full flex justify-center items-center '>
          <button className='p-3 w-[170px] bg-[#0f0c29] border border-transparent 
              hover:border-[#322d5e] hover:cursor-pointer  rounded-[3px] transition-all duration-100 ease-in-out'>SUBMIT</button>
        </div>
      </form>
    </div>
  )
}

export default ShippingInfo
