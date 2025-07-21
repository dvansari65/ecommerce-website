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
    required:boolean,
    className?:string
    onFocus?:(e: React.FocusEvent<HTMLInputElement>)=>void
}
function Input({
    label,
    id,
    value,
    type,
    onChange,
    placehHolder,
    required,
    name,
    className,
    onFocus
}:inputProps) {

  return (
    <div className='flex flex-col gap-1'>
    <label className={`text-[14px] ml-1 text-gray-300 `} htmlFor={id}>{label}</label>
      <input 
      onFocus={ onFocus}
      id={id}
      name={typeof name === "number" ? String(name) : name}
      required={required}
      type={type}
      className={`${className}`}
      placeholder={placehHolder}
      value={value} 
      onChange={onChange} />
    </div>
  )
}

export default Input