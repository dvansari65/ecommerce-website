import React from 'react'
interface inputProps {
    label:string,
    id:string,
    value:string | number,
    type:string
    onChange:(e:React.ChangeEvent<HTMLInputElement>
    )=>void
    placehHolder:string,
    htmlFor:string
}
function Input({
    label,
    id,
    value,
    type,
    onChange,
    placehHolder,
    
}:inputProps) {

  return (
    <div className='flex flex-col gap-1'>
    <label htmlFor={id}>{label}</label>
      <input 
      id={id}
      type={type}
      className='text-white border-[1px] min-w-[300px] border-[#322d5e] p-2 rounded-[4px]'
      placeholder={placehHolder}
      value={value} 
      onChange={onChange} />
    </div>
  )
}

export default Input