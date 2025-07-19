import Input from "@/components/features/Input";
import type {
  createPaymentResponse,
  productTypeFromOrder,
  shippingInfo,
} from "@/types/api-types";
import React, {  useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  saveNumericalData,
  saveOrderItems,
  saveShippingInfo,
} from "@/redux/reducer/cartReducer";

import { server } from "@/config/constants";
import type { RootState } from "@/redux/reducer/store";
import Spinner from "@/components/ui/LoaderIcon";
import toast from "react-hot-toast";
import Shipping from "@/components/features/Shipping";

function ShippingInfo() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState<shippingInfo>({
    state: "",
    pinCode: 1212,
    address: "",
    city: "",
    country: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { code } = useSelector((state: RootState) => state.couponReducer);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    dispatch(saveShippingInfo(formData));
    console.log("code:", code);
    try {
      const endpoint = code
        ? `${server}/api/v1/coupon/create-payment-from-cart?code=${code}`
        : `${server}/api/v1/coupon/create-payment-from-cart`;
        console.log("code:", code);
      const { data }: { data: createPaymentResponse } = await axios.post(
        endpoint,
        {
          shippingInfo: formData,
        },
        {
          withCredentials: true,
        }
      );
      console.log("data:", data);
      let items: productTypeFromOrder[] = data.cart.items.map((i) => ({
        name: i.productId?.name || "",
        photo: i.productId?.photo || "",
        price: i.productId?.price || 0,
        quantity: i.quantity || 1,
        productId: i.productId?._id || "",
      }));
      dispatch(saveOrderItems(items));

      dispatch(
        saveNumericalData({
          subtotal: data.subtotal,
          tax: data.tax,
          shippingCharges: data.shippingCharges,
          discount: data.discount,
          total: data.total,
        })
      );
      navigate("/payment",{
        state:data?.clientSecret
      })
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      setError(
        error.message || "failed to proceed! Please visit product page!"
      );
      console.log(error);
      toast.error(
        error?.data?.message || error.message || "failed to submit data!"
      );
    }
  };

  const handleChange=(e: React.ChangeEvent<HTMLInputElement>)=>{
    const {name,value,type} = e.target
    setFormData((prev)=>({
      ...prev,
      [name] : type === "number" ? Number(value) : value
    }))
    setMessage("");
  }

  if (isLoading)
    return (
      <div className="w-full h-screen flex justify-center items-center ">
        <Spinner />
      </div>
    );
  if (error)
    return (
      <div className="w-full h-screen flex justify-center items-center text-red-400 ">
        {error} !!!
      </div>
    );

  return (
    <div>
      <Shipping 
      message={message} 
      address={formData.address} 
      state={formData.state}
      city={formData.city}
      country={formData.country}
      pinCode={formData.pinCode}
      onChange={handleChange}
      onSubmit={handleSubmit}
      />
    </div>
  );
}

export default ShippingInfo;
