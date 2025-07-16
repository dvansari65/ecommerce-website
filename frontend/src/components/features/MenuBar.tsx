import React, { useState } from 'react'
import { Link } from 'react-router-dom'

function MenuBar() {
    const [showMenu,setShoMenu] = useState(false)

    return (
        <div>
            <button
            onClick={()=>setShoMenu(prev=>!prev)}
                data-popover-target="menu"
                className="  rounded-md bg-gray-100 p-2 border border-transparent text-center text-sm text-black transition-all shadow-md  active:bg-slate-700  active:shadow-none hover:underline hover:cursor-pointer ml-2" type="button">
                Open Menu
            </button>
            {
                showMenu ? (
                <ul
                role="menu"
                data-popover="menu"
                data-popover-placement="bottom"
                className=" absolute z-10 min-w-[180px] overflow-auto rounded-lg border border-slate-200 bg-white p-1.5 shadow-lg shadow-sm focus:outline-none mt-2"
            >
                <li
                    role="menuitem"
                    className="cursor-pointer text-slate-800 flex w-full text-sm items-center rounded-md p-3 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
                >
                    <Link className='w-full' to="/cart">CART</Link>
                </li>
                <li
                    role="menuitem"
                    className="cursor-pointer text-slate-800 flex w-full text-sm items-center rounded-md p-3 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
                >
                    <Link className='w-full' to="/my-orders">ORDER</Link>
                </li>
                
            </ul>
                ):null
            }

        </div>
    )
}

export default MenuBar