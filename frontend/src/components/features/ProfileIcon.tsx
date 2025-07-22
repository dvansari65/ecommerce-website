import type { RootState } from '@/redux/reducer/store'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import {User } from "lucide-react"
import {Settings} from "lucide-react"
function ProfileIcon() {
    const [openIcon,setOpenIcon] = useState(false)
    const {user} = useSelector((state:RootState)=>state.userReducer)
  return (
    <div className='ml-2 p-2'>
        <button className='bg-white/10 p-2 rounded-[50%] border border-white/20' onClick={()=>setOpenIcon(prev=>!prev)}>
        <User size={25} className='hover:text-gray-100 text-gray-400  '/>
        </button>
        {
            openIcon && <div className='fixed inset-0 top-20 left-[85%]  mt-3 z-50 w-[180px] h-[160px]  rounded-2xl bg-[rgb(252,251,252)] flex flex-col justify-start'>
                    <div className='flex flex-col items-start ml-2 mt-2 gap-1'>
                      <div className='w-full flex justify-center items-center'>
                      <img src={user?.photo} className='size-13 rounded-[50%]' />
                      </div>
                     <div className='flex flex-col items-start'>
                     <span className='text-[15px] text-blue-500  px-1  rounded-[5px]' >@{user?.userName}</span>
                     <span className='text-[12px] text-blue-500 px-1  rounded-[5px] '>{user?.email}</span>
                     <button className='flex text-gray-500 items-center gap-1 mt-2 hover:bg-gray-300 ease-in-out duration-100 px-2 rounded-[4px] py-[2px]'><Settings size={20} className='mt-[1px]'/><span>Settings</span></button>
                     </div>
                    </div>
            </div>
        }
    </div>
  )
}

export default ProfileIcon