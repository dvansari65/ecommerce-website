
import Input from "./Input";
import { useState } from "react";
import { useUpdateProfileMutation } from "@/redux/api/userApi";
import type { updateUsertype } from "@/types/api-types";
import toast from "react-hot-toast";
import Spinner from "../ui/LoaderIcon";

interface props {
  isOpen: boolean;
  onClose: () => void;
}

const ChangeProfileInfoCard = ({ isOpen, onClose }: props) => {
  const [formData, setFormData] = useState<updateUsertype>({
    userName: "",
    email: "",
    gender: "male",
    dob:"" ,
  });
  if (!isOpen) return null;

  const [updateProfile,{isError,isLoading}] = useUpdateProfileMutation()

  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const {value,name} = e.target
        setFormData(prev=>({
            ...prev,
            [name]:value
        }))
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
    const {name,value} = e.target
    setFormData((prev)=>({
        ...prev,
        [name] : value
    }))
  }
  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        try {
            const res = await updateProfile(formData) 
            if(res.data?.success){
                toast.success(res.data?.message || "User updated successfully!")
            }else{
                toast.error(res?.data?.message || "something went wrong!")
            }
        } catch (error:any) {
            toast.error(error.data?.message || error.message || "failed to updated user!")
            console.log("failed to update user !",error)
        }
   }
  if(isError) return <div className="text-2xl text-gray-400 w-full text-center">Something went wrong!</div>
  return (
    <div className="absolute inset-0 z-50 w-full  left-0 top-45  bg-zinc-100 rounded-xl  ">
      <form
      onSubmit={handleSubmit}
        className="w-full flex flex-col justify-center items-center p-3 "
      >
        {
            isLoading && <Spinner/>
        }
        <div className="flex flex-col items-center w-full gap-2">
          <div>
            <Input
              label="Username"
              className="text-gray-700 border hover:border-[rgb(45,45,45)] w-[40vh] rounded-[5px] py-[6px] px-2"
              placehHolder="username"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
            />
          </div>
          <div>
            <Input
              label="email"
              className="text-gray-700 border hover:border-[rgb(45,45,45)] w-[40vh] rounded-[5px] py-[6px] px-2"
              placehHolder="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <Input
              label="DOB"
              className="text-gray-700 border hover:border-[rgb(45,45,45)] w-[40vh] rounded-[5px] py-[6px] px-2"
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
            />
          </div>
          <div>
            <div className="flex flex-col ">
              <label className="text-gray-500 mb-1 ml-[3px]" htmlFor="">
                Gender
              </label>
              <select
                className="w-[40vh] py-[6px] border  border-gray-500 rounded-[4px]"
                name="gender"
                value={formData.gender}
                onChange={handleGenderChange}
              >
                <option value="">male</option>
                <option value="">female</option>
                <option value="">transgender</option>
              </select>
            </div>
          </div>
          <div className="w-full px-9 mt-2" >
            <div className="flex justify-between items-center gap-2">
              <button
               type="submit"
                className="bg-blue-500 w-full  rounded-[5px] py-1  "
                onClick={onClose}
              >
                {
                    isLoading ? "saving..." : "Save Changes"
                }
              </button>
              <button
                className="bg-gray-500 w-full  rounded-[5px] py-1 "
                onClick={onClose}
              >
                cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChangeProfileInfoCard;
