import React from 'react'

interface buttonProps{
    onClick : ()=> void,
    title:string,
    disabled?:boolean
}

function Button({onClick,title,disabled}:buttonProps) {
  return (
    <div className='bg-transparent px-3 py-2 hover:bg-[rgb(40,41,95)]  rounded-[4px] max-w-[100px] m-2'>
        <button disabled={disabled} onClick={onClick} className={disabled ? `text-gray-500 text-[15px] py-1 px-1` :`text-white text-[15px] py-1 px-1 `}>{title}</button>
    </div>
  )
}

export default Button