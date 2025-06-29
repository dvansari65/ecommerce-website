import React from 'react'
import { ArrowDown ,ArrowUp} from "lucide-react"
import canonImage from "../../assets/canon2.png";
type CartMethodType = {
    cancelAddToCart: () => void,
    increaseQuantity: () => void,
    decreaseQuantity : ()=>void
}

function CartItem({ cancelAddToCart, increaseQuantity,decreaseQuantity }: CartMethodType) {
    return (
        <div className='grid grid-cols-4 p-2 m-2 rounded-2xl border-none bg-white min-h-[120px]'>
            <div className='col-span-2 p-3 bg-white'>
                <div className='grid grid-cols-6 '>
                    <div className='col-span-1  ml-5'><img className='size-22 rounded-xl' src={canonImage} alt="" /></div>
                    <div className='col-span-5 pl-4 ml-2 pr-3'>info:If you get a TypeScript error about image types,</div>
                </div>
            </div>
            <div className='col-span-2' >
                <div className='grid grid-cols-3 p-5 mt-2'>
                    <div className='col-span-1  flex justify-center  '>
                    <button onClick={cancelAddToCart} className=' p-2 rounded-2xl text-red-500 hover:bg-gray-200' >
                        cancel order
                    </button>
                    </div>
                   <div className='col-span-2 flex justify-center items-center gap-2 rounded-2xl hover:bg-gray-200'>
                    <div>(4)</div>
                    <button onClick={decreaseQuantity} className='hover:cursor-pointer'><ArrowDown className='hover:text-red-500'/></button>
                    <span className='text-gray-500' >quantity</span>
                    <button onClick={increaseQuantity}  className='hover:cursor-pointer'><ArrowUp className='hover:text-blue-500'/></button>
                   </div>
                </div>
            </div>
        </div>
    )
}

export default CartItem