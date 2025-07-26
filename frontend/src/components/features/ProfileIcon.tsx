import type { RootState } from "@/redux/reducer/store";
import React, { Profiler, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, MoreVertical, User, X } from "lucide-react";
import getRelativeTimeFromNow from "@/utils/timeStatusConverter";
import calculateAge from "@/utils/calculateAge";
import { FaEnvelope } from "react-icons/fa";
import Spinner from "../ui/LoaderIcon";
import LogoutConfirm from "../ui/LogoutConfirm";
import { useLogoutMutation } from "@/redux/api/userApi";
import toast from "react-hot-toast";
import { userNotExist } from "@/redux/reducer/userReducer";
import { useNavigate } from "react-router-dom";

function ProfileIcon() {
  const [openIcon, setOpenIcon] = useState(false);
  const [isLogoutOpen,setIsLogoutOpen] = useState(false)
  const [isUpdateProfileModal,setUpdateProfileModal] = useState(false)
  const { user,loading } = useSelector((state: RootState) => state.userReducer);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [logout] = useLogoutMutation();

  const lastTimeActive = getRelativeTimeFromNow(user?.lastTimeActive || "some time ago!")
  const age = calculateAge(user?.dob || "Age : ? years old")

  const onLogout = useCallback(async () => {
    try {
      const res = await logout();
      setIsLogoutOpen(false);
      setOpenIcon(false)
      const message = res?.data?.message || "Logged out successfully!";
      toast.success(message);
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to log out!");
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      dispatch(userNotExist());
      navigate("/");
    }
  }, [ logout]);

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
          {
            loading && <Spinner/>
          }
          <div className="relative w-full h-[120px] bg-gradient-to-r from-[rgb(37,1,60)] via-[rgb(143,61,231)] to-[rgb(205,149,237)] rounded-t-2xl">
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
            <div className="w-full flex justify-center ">
              <button onClick={()=>setUpdateProfileModal(false)} className="w-[90%] bg-[#1b1321] border hover:border-[#b075f5] border-[#3f2e40] shadow-lg hover:shadow-purple-500/20 mr-5 mt-3 py-2 rounded-[7px]">
              Edit Profile
              </button>
            </div>
            <div className="flex justify-center items-center gap-18 w-full mt-2">
              <div className="w-[18vh] flex justify-center py-1  bg-gray-200 mr-2 rounded-2xl">
              <button className="text-gray-500  ">setting</button>
              </div>
              <div className="w-[18vh] flex justify-center  bg-red-100 mr-6 rounded-2xl ">
              <button onClick={()=>setIsLogoutOpen(true)} className="text-red-400  py-1 ">logout</button>
              </div>
            </div>
            {
              isLogoutOpen && <LogoutConfirm isOpen={isLogoutOpen} handleLogout={onLogout} onClose={()=>setIsLogoutOpen(false)}/>
            }

          </div>
          
        </div>
      )}
    </div>
  );
}

export default ProfileIcon;
