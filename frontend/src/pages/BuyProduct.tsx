import Input from "@/components/features/Input";
import Shipping from "@/components/features/Shipping";
import Spinner from "@/components/ui/LoaderIcon";
import { server } from "@/config/constants";
import { saveNumericalData, saveShippingInfo } from "@/redux/reducer/cartReducer";

import type { RootState } from "@/redux/reducer/store";
import type { createPaymentResponse, shippingInfo } from "@/types/api-types";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


function BuyProduct() {
  const [message, setMessage] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<shippingInfo>({
    state: "",
    address: "",
    city: "",
    pinCode: "",
    country: "",
  });
  
  const { orderItems } = useSelector((state: RootState) => state.cartReducer);
  const { code } = useSelector((state: RootState) => state.couponReducer);
  const dispatch = useDispatch();
  console.log("orderItems", orderItems);

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    // 
    dispatch(saveShippingInfo(formData))
    e.preventDefault()
    setLoading(true);
    if (orderItems.length === 0) {
      toast.custom("please select items!")
      navigate("/shop");
    } else {
      try {
        const endPoint = code
          ? `${server}/api/v1/coupon/create-payment-directly?code=${code}`
          : `${server}/api/v1/coupon/create-payment-directly`;
        const { data }: { data: createPaymentResponse } = await axios.post(
          endPoint,
          {
            shippingInfo: formData,
            orderItems,
          },
          {
            withCredentials: true,
          }
        );
        dispatch(
          saveNumericalData({
            tax: data.tax,
            subtotal: data.subtotal,
            discount: data.discount,
            total: data.total,
            shippingCharges: data.shippingCharges,
          })
        );
        setLoading(false);
        setMessage("");
        navigate("/payment", {
          state: data?.clientSecret,
        });
      } catch (error: any) {
        setMessage("");
        setLoading(false);
        setError(
          error.message || "failed to proceed! Please visit product page!"
        );
        console.log(error);
        toast.error(
          error?.data?.message || error.message || "failed to submit data!"
        );
      }
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:value
    }));
  };
  // const changePincodeEvent  = (e:React.ChangeEvent<HTMLInputElement>)=>{
  //     const {name,value} = e.target
  //     setFormData(prev=>({
  //        ...prev,
  //       [name] : Number(value)
  //     }))
  // }

  if (isLoading) return <Spinner />;
  if (isError)
    return (
      <div className="flex flex-row w-full justify-center items-center gap-3">
        <span className="text-[rgb(234,54,54)] text-xl">
          failed to submit data !
        </span>
        <span className="text-green-400">please try again!</span>
      </div>
    );

  return (
    <div>
      <Shipping
        message={message}
        state={formData.state}
        address={formData.address}
        city={formData.city}
        pinCode={Number(formData.pinCode)}
        country={formData.country}
        onChange={handleChange}
        onSubmit={handleSubmit}
      
      />
      {/* <Input
      id="pincode"
      htmlFor="pincode"
      label="pin code"
      value={Number(formData?.pinCode)}
      onChange={(e)=>{
        setFormData((prev)=>({
          ...prev,
          pinCode : Number( e.target.value)
        }))
      }}
      placehHolder="enter pincode"
      required = {true}
      name = "pinCode"
      type="number"
      /> */}
    </div>
  );
}

export default BuyProduct;
