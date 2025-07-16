import React from 'react'
import { useNavigate } from 'react-router-dom'

function IsLoggedInModal() {
    const navigate = useNavigate()

    const handleCancel = ()=>{
        navigate(-1)
    }
    const handleLogin = ()=>{
        navigate("/login")
    }
    return (
        <div className='flex flex-col justify-center items-center'>
            <div className='fixed inset-0 z-50 top-50 left-100 w-[300px] h-[200px] bg-[rgb(17,9,46)] border-[1px] border-gray-500 flex flex-col justify-center items-center rounded-[4px] '>
            <h2 className='text-green-400 ml-4'>you want to login first!</h2>
            <div className='flex flex-row justify-center items-center w-full mt-3 p-2 gap-5 '>
                <button onClick={()=>handleCancel()} className='text-red-400 ml-5'>cancel</button>
                <button onClick={handleLogin} className='bg-[rgb(29,15,82)] py-1 px-3 rounded-[3px] hover:cursor-pointer'>login</button>
            </div>
        </div>
        </div>
    )
}

export default IsLoggedInModal