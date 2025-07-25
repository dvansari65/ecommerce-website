import type { RootState } from "@/redux/reducer/store";
import React, { Profiler, useState } from "react";
import { useSelector } from "react-redux";
import { Calendar, MoreVertical, User, X } from "lucide-react";
import getRelativeTimeFromNow from "@/utils/timeStatusConverter";
import calculateAge from "@/utils/calculateAge";
import { FaEnvelope } from "react-icons/fa";
import Button from "./Button";

function ProfileIcon() {
  const [openIcon, setOpenIcon] = useState(false);
  const { user } = useSelector((state: RootState) => state.userReducer);
  const lastTimeActive = getRelativeTimeFromNow(user?.lastTimeActive || "some time ago!")
  const age = calculateAge(user?.dob || "Age : ? years old")
  return (
    <div className="ml-2 p-2">
      <button
        className="bg-white/10 p-2 rounded-[50%] border border-white/20"
        onClick={() => setOpenIcon((prev) => !prev)}
      >
        <User size={25} className="hover:text-gray-100 text-gray-400  " />
      </button>
      {openIcon && (
        <div className="fixed inset-0 z-50 bg-zinc-100 w-[400px] h-[560px] left-[40%] top-[80%] rounded-2xl ">
          <div className="relative w-full h-[120px] bg-gradient-to-r from-blue-600 via-[rgb(78,81,234)] to-purple-500 rounded-t-2xl">
            <span className="w-full flex justify-between items-center px-3 py-2">
              <button onClick={() => setOpenIcon((prev) => !prev)}>
                <X />
              </button>
              <button>
                <MoreVertical />
              </button>
            </span>
          </div>

          <span className="absolute  rounded-[50%]  border-3 border-white bg-transparent size-32 top-12 right-33 shadow-gray-400 shadow-sm">
            {user?.photo ? (
              <img
                className="w-full h-full object-cover rounded-full"
                src={user?.photo}
                alt=""
              />
            ) : (
              <User className="w-full h-full " />
            )}
          </span>
          <div className="w-full h-[25%] flex flex-col  items-center justify-center mt-10">
            <span className="text-black text-2xl font-bold">
              @{user?.userName}
            </span>
            <span className="text-black">{user?.email}</span>
            <div className="flex flex-row justify-center items-center mt-2 bg-[rgb(178,231,166)] px-3 rounded-xl">
              <User size={18} className="text-gray-400" />
              <span className="text-[18px] text-gray-400">user</span>
            </div>
          </div>
          <div className="h-[20%] w-full flex flex-col justify-start gap-3 ml-3 ">
            <div className="flex flex-row items-center  text-gray-500">
              <Calendar className="mr-2"/>
              <span>{age}</span>
            </div>
            <div className="flex flex-row items-center  text-gray-500">
              <User/>
              <span className="text-gray-500 mr-2">Gender: </span>
              <span>{user?.gender || "male"}</span>
            </div>
            <div className="flex flex-row items-center  text-gray-500">
              <FaEnvelope className="mr-2 ml-1"/>
              <span className="mt-[1px] mr-2">Last Time Active :</span>
              <span className="mt-[1px]">{lastTimeActive}</span>
            </div>
            <div className="w-full flex justify-center">
              <button className="w-[90%] bg-blue-600 mr-5 mt-3 py-2 rounded-[7px]">Edit Profile</button>
            </div>
          </div>
          <div className="flex justify-center items-center gap-5 w-full h-full">
            <Button onClick={()=>{}}  />
            <Button onClick={()=>{}}/>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileIcon;
