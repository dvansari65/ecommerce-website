import Input from "@/components/features/Input";
import { useSignupMutation } from "@/redux/api/userApi";
import { userExist, userNotExist } from "@/redux/reducer/userReducer";
import type { signupInputData } from "@/types/api-types";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [formData, setFormData] = useState<signupInputData>({
    userName: "",
    email: "",
    password: "",
    gender: "male",
    dob: "",
    photo: null,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [signup, { isLoading, isError }] = useSignupMutation();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, photo: e.target.files![0] }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("FORMDATA:",formData)
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (formData.password.length < 8) {
        return toast.error(
          "enter valid email or 8 minimum characters for password!"
        );
      }
      if (!emailRegex.test(formData.email)) {
        return toast.error("please enter valid email format!");
      }
      if (!formData.photo) {
        return toast.error("photo is missing!");
      }

      const formPayload = new FormData();
      formPayload.append("userName", formData.userName);
      formPayload.append("email", formData.email);
      formPayload.append("password", formData.password);
      formPayload.append("gender", formData.gender);
      formPayload.append("dob", formData.dob);
      formPayload.append("photo", formData.photo);

      const res = await signup(formPayload);
      const user = res.data?.user;
      if (res.data?.success) {
        localStorage.setItem("user", JSON.stringify(user) );
        toast.success(res.data.message || "welcome!");
        dispatch(userExist(res.data?.user));
        navigate("/shop");
      } else {
        toast.error(res.data?.message || "failed to signup!");
        console.log("Res3:", res.data?.message);

        dispatch(userNotExist());
        navigate("/shop");
      }
    } catch (error: any) {
      dispatch(userNotExist());
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Something went wrong. Please try again.";

      console.error("Signup error:", error);
      toast.error(errorMessage);
    }
  };
  if (isError)
    return (
      <div className="text-[15px] w-full text-center text-red-500 h-[60vh] flex justify-center items-center ">
        something went wrong!
      </div>
    );

  return (
    <div className="w-full h-[70vh] bg-transparent flex justify-center items-center">
      <div className="border-[1px] rounded-xl  border-blue-300   ">
        <h1 className="w-full text-center mt-4 ">SIGNUP</h1>
        <form onSubmit={handleSubmit}>
          <div className="p-3 flex flex-col gap-3 min-w-[300px] max-w-[500px]  border-blue-300  mx-2 mb-2 ">
            <label
              htmlFor="photo"
              className="cursor-pointer border-[1px] border-[rgb(95,89,89)] rounded-[4px] p-[5px] hover:border-[rgb(183,203,245)] ease-in-out duration-100 text-white flex flex-col gap-1"
            >
              <span className="text-sm">Profile Photo</span>
              <input
                id="photo"
                name="photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              <span className="text-xs text-gray-400">
                {formData.photo ? formData.photo.name : "No file selected"}
              </span>
            </label>
            <Input
              className="border-[1px] border-[rgb(95,89,89)] rounded-[4px] p-[5px] hover:border-[rgb(183,203,245)] ease-in-out  duration-100"
              placehHolder="enter user name.."
              label="User Name"
              id="username"
              name="userName"
              onChange={handleChange}
              type="text"
              required={true}
              value={formData.userName}
              htmlFor="username"
            />
            <Input
              className="border-[1px] border-[rgb(95,89,89)] rounded-[4px] p-[5px] hover:border-[rgb(183,203,245)] ease-in-out  duration-100"
              placehHolder="enter email.."
              label="Email"
              id="email"
              name="email"
              onChange={handleChange}
              type="email"
              required={true}
              value={formData.email}
              htmlFor="email"
            />
            <Input
              className="border-[1px] border-[rgb(95,89,89)] rounded-[4px] p-[5px] hover:border-[rgb(183,203,245)] ease-in-out  duration-100"
              placehHolder="enter password.."
              label="Password"
              id="password"
              name="password"
              onChange={handleChange}
              type="password"
              required={true}
              value={formData.password}
              htmlFor="password"
            />
            <Input
              className="border-[1px] border-[rgb(95,89,89)] text-[12px] rounded-[4px] p-[9px] hover:border-[rgb(183,203,245)] ease-in-out  duration-100"
              placehHolder="enter date of birth.."
              label="DOB"
              id="dob"
              name="dob"
              onFocus={(e) => e.target.showPicker?.()}
              onChange={handleChange}
              type="date"
              required={true}
              value={formData.dob}
              htmlFor="dob"
              max={new Date().toISOString().split("T")[0]}
            />
            <label htmlFor="gender" className="text-gray-300 text-sm ml-1">
              Gender
            </label>
            <select
              className="my border-[1px] p-2 rounded-[4px] border-[rgb(95,89,89)]"
              name="gender"
              onChange={handleGenderChange}
              value={formData.gender}
            >
              <option value="male">male</option>
              <option value="female">female</option>
              <option value="transgender">transgender</option>
            </select>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-white/5 backdrop-blur-md text-white border border-white/10 shadow-md hover:bg-white/10 transition duration-200"
            >
              {isLoading ? "signup..." : "signup"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
