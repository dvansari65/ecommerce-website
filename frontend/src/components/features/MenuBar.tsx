import React from 'react'
import { Link } from 'react-router-dom'

function MenuBar() {
    return (
        <div className="bg-[rgb(135,106,137)] shadow-lg rounded-2xl w-48 p-3 grid grid-cols-1 grid-rows-2 gap-2">
            <Link
                to="/cart"
                className="w-full px-4 py-2 text-sm text-white hover:border-gray-400 hover:border-[1px] rounded-xl transition"
            >
                My Cart
            </Link>
            <Link
                to="/orders"
                className="w-full px-4 py-2 text-sm text-white  hover:border-gray-400 hover:border-[1px] rounded-xl transition"
            >
                My Orders
            </Link>
        </div>
    )
}

export default MenuBar
