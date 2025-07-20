import React from 'react'
import Input from './Input';
import CheckCoupon from './CreateCoupon';

interface shippingProps {
    message:string,
    address:string,
    state:string,
    country:string,
    pinCode:number,
    city:string,
    onSubmit:(e: React.FormEvent<HTMLFormElement>)=>Promise<void>,
    onChange:(e: React.ChangeEvent<HTMLInputElement>)=>void
   
}

function Shipping({
    message,
    address,
    city,
    state,
    country,
    pinCode,
    onSubmit,
    onChange,
  
}:shippingProps) {
  return (
    <div className="h-screen w-full">
    <div className="grid grid-cols-2 ">
      <div className="col-span-1 flex flex-col justify-center items-end h-[80vh] mr-5">
        <span>{message}</span>
        <form
          className="p-4  w-[60vh] h-full flex flex-col justify-center items-center gap-2 bg-transparent border-[1px] border-color "
          onSubmit={onSubmit}
        >
          <Input
            name="address"
            required={true}
            label="ADDRESS"
            value={address}
            placehHolder="address.."
            onChange={onChange}
            id="address"
            type="text"
            htmlFor="address"
          />
          <Input
            name="city"
            required={true}
            label="CITY"
            value={city}
            placehHolder="e.g PUNE"
            onChange={onChange}
            id="city"
            type="text"
            htmlFor="city"
          />
          <Input
         name="state"
            required={true}
            label="STATE"
            value={state}
            placehHolder="e.g MAHARASHTRA"
            onChange={onChange}
            id="state"
            type="text"
            htmlFor="state"
          />
          <Input
           name="country"
            required={true}
            label="COUNTRY"
            value={country}
            placehHolder={"e.g. INDIA"}
            onChange={onChange}
            id="country"
            type="text"
            htmlFor="country"
          />
          <Input
            name="pinCode"
            required={true}
            label="PINCODE"
            value={pinCode}
            placehHolder="0000"
            onChange={onChange}
            id="pinCode"
            type="number"
            htmlFor="pinCode"
          />
          <div className="w-full flex justify-center items-center mt-4 ">
            <button className="text-white w-[150px] border-[1px] border-[#322d5e]  p-2 rounded-[4px] hover:border-[#ae90f4] transition-all duration-200 ease-in-out ">
              SUBMIT
            </button>
          </div>
        </form>
      </div>
      <div className="col-span-1 flex flex-col justify-center items-center">
        <CheckCoupon />
      </div>
    </div>
  </div>
  )
}

export default Shipping