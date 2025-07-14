import React, { useEffect } from 'react'
import { Elements} from "@stripe/react-stripe-js"
import { loadStripe } from '@stripe/stripe-js'
import CheckOutForm from '@/components/features/CheckOutForm'
import { Navigate, useLocation } from 'react-router-dom'


const stripePromise = loadStripe("pk_test_51RaqgaENC7R2J1iYc3VvI8iPGx3PyP0CZw8TleDDpGuKs5JBOVH6WXsju4AQzrGQgFlohJYxRlYBE8CAAHgUfmzs00xLHO9BbT")


function CheckOut() {
  const location = useLocation()
  const clientSecret = location.state ?? null
  useEffect(()=>{
    console.log("clientSecret",clientSecret)
  },[clientSecret,location])

  if (!clientSecret)return <Navigate to="/place-order-from-cart"/>
  const options = {
    clientSecret
  }

  return (
    <Elements stripe = {stripePromise} options={options}>
         <CheckOutForm  />
    </Elements>
  )
}

export default CheckOut