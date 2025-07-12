import Input from '@/components/features/Input'
import { setShippingInfo } from '@/redux/reducer/userReducer'
import type { shippingInfo } from '@/types/api-types'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function PlaceOrderFromCart() {
  const dispatch  = useDispatch()
  const navigate = useNavigate()
  const [formData,setFormData] = useState<shippingInfo>({
    state: "",
    pinCode:1212,
    address: "",
    city: "",
    country:"",
  })

  const handleSubmit = (e:React.FormEvent<HTMLFormElement>)=>{
      e.preventDefault();
      dispatch(setShippingInfo(formData))
      navigate("/create-payment")
  }

  return (
    <div className='w-full h-screen bg-[#0f0c29] flex justify-center items-start mt-20 '>
      <form onSubmit={handleSubmit}>
       <Input 
       label='ADDRESS'
        value={formData.address} 
        placehHolder='address..' 
        onChange={(e)=>setFormData(prev=>(
        {
          ...prev,
          address:e.target.value
        }
       ))}
       id='address'
       type='text'
       htmlFor="address"
        />
        <Input 
            label='CITY'
            value={formData.city} 
            placehHolder='e.g PUNE' 
            onChange={(e)=>setFormData(prev=>(
            {
              ...prev,
              city:e.target.value
            }
            ))}
            id='city'
            type='text'
            htmlFor="city"
        />
        <Input 
            label='STATE'
            value={formData.state} 
            placehHolder='e.g MAHARASHTRA' 
            onChange={(e)=>setFormData(prev=>(
            {
              ...prev,
              state:e.target.value
            }
            ))}
            id='state'
            type='text'
            htmlFor="state"
        />
        <Input 
            label='COUNTRY'
            value={formData.country} 
            placehHolder='e.g INDIA' 
            onChange={(e)=>setFormData(prev=>(
            {
              ...prev,
              country:e.target.value
            }
            ))}
            id='country'
            type='text'
            htmlFor="country"
        />
        <Input 
            label='PINCODE'
            value={formData.pinCode} 
            placehHolder='0000' 
            onChange={(e)=>setFormData(prev=>(
            {
              ...prev,
              country:e.target.value
            }
            ))}
            id='country'
            type='number'
            htmlFor="country"
        />
      </form>
    </div>
  )
}

export default PlaceOrderFromCart