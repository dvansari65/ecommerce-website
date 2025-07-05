import React from 'react'
import { Link } from 'react-router-dom'

function MenuBar({ref}: React.RefAttributes<HTMLDivElement>) {
    return (
        <div ref={ref} className="bg-slate-200 shadow-lg rounded-2xl w-48 p-3 flex flex-col gap-2">
            <Link 
                to="/cart" 
                className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-slate-100 rounded-xl transition"
            >
                My Cart
            </Link>
            <Link 
                to="/orders" 
                className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-slate-100 rounded-xl transition"
            >
                My Orders
            </Link>
        </div>
    )
}

export default MenuBar
