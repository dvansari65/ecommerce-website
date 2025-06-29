import React from 'react'
import CartItem from '../features/CartItem'

function Cart() {

  return (
    <div className='grid grid-cols-12 w-full h-screen overflow-y-autoauto'>
        <div className='col-span-8 h-full bg-gray-200 border-r border-gray-600'>
            <CartItem />
        </div>

        <div className='col-span-4 w-full h-full bg-gray-200'>

        </div>
    </div>
  )
}

export default Cart