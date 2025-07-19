import React from 'react'
interface inputProps {
    label:string,
    id:string,
    value:string | number,
    type:string,
    name:string | number 
    onChange:(e:React.ChangeEvent<HTMLInputElement>
    )=>void
    placehHolder:string,
    htmlFor:string,
    required:boolean
}
function Input({
    label,
    id,
    value,
    type,
    onChange,
    placehHolder,
    required,
    name
    
}:inputProps) {

  return (
    <div className='flex flex-col gap-1'>
    <label className='text-[14px] ml-2 text-gray-300' htmlFor={id}>{label}</label>
      <input 
      id={id}
      name={typeof name === "number" ? String(name) : name}
      required={required}
      type={type}
      className=' text-white border-[1px] min-w-[350px] border-color p-2 rounded-[4px]'
      placeholder={placehHolder}
      value={typeof value === "number" ? String(value) : value} 
      onChange={onChange} />
    </div>
  )
}

export default Input