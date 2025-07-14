import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function MyOrders() {
    const location = useLocation()
    const orderRes  = location.state
    useEffect(()=>{
        console.log("order res:",orderRes)
    },[orderRes])
  return (
    <div>o</div>
  )
}

export default MyOrders