import Input from "@/components/features/Input";
import type { signupInputData } from "@/types/api-types";
import React, { useState } from "react";

function Signup() {
  const [formData, setFormData] = useState<signupInputData>({
    userName: "",
    email: "",
    password: "",
    gender: "male",
    dob: "07/01/2003",
    photo:"" 
  });
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, photo: String(e?.target?.files[0]) }));
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };
  const handleSubmit = async () => {
    try {
    } catch (error) {}
  };

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
                required
                className="hidden"
              />
              <span className="text-xs text-gray-400">
                {/* {formData.photo ? formData.photo.name : "No file selected"} */ "not file seel"}
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
            />
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-white/5 backdrop-blur-md text-white border border-white/10 shadow-md hover:bg-white/10 transition duration-200"
            >
              {"signin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
