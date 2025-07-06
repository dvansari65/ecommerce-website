import React from 'react'
import CartItem from '../components/features/CartItem'

function Cart() {

  return (
    <div className='grid grid-cols-12 w-full  h-screen  overflow-y-autoauto'>
        <div className='col-span-8 h-full bg-[rgb(63,46,64)]  border-r border-gray-600'>
            <CartItem increaseQuantity={()=>{}} decreaseQuantity={()=>{}} cancelAddToCart={()=>{}} />
        </div>

        <div className='col-span-4 w-full h-full bg-[rgb(63,46,64)]  '>

        </div>
    </div>
  )
}

export default Cart
// bg-[rgb(103,78,105)]