import React from 'react'

interface buttonProps{
    onClick : ()=> void
}

function Button({onClick}:buttonProps) {
  return (
    <div className='bg-transparent px-3 py-2 border-[0.5px] hover:border-[rgb(144,132,149)] rounded-[3px] min-w-[100px]'>
        <button onClick={onClick} className='text-white text-[15px]'>click me</button>
    </div>
  )
}

export default Button