import { useDeleteCouponMutation } from '@/redux/api/couponApi'
import type { RootState } from '@/redux/reducer/store'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

function MyOrders() {
    const {_id} = useSelector((state:RootState)=>state.couponReducer)
    const location = useLocation()
    const orderRes  = location.state
    const [deleteCoupon] = useDeleteCouponMutation()
    useEffect(()=>{
       console.log("_id",_id)
    },[])
  return (
    <div>o</div>
  )
}

export default MyOrders