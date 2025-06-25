import React from 'react';
import { Link, NavLink } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from "../../redux/reducer/store"
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '@/redux/api/userApi';
import toast from 'react-hot-toast';
import { userNotExist } from '@/redux/reducer/userReducer';
import Logo from '../ui/Logo';
const Header: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.userReducer)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [logout] = useLogoutMutation()
  const handleLogout = async () => {
    try {
      const res = await logout()
      const message = res?.data?.message || "Logged out successfully!"
      toast.success(message as string)
    } catch (error) {
      console.error("failed to logged out!", error)
      toast.error(error as string)
    } finally {
      localStorage.removeItem("user")
      localStorage.removeItem("token")
      dispatch(userNotExist())
      navigate("/home")
    }
  }
  return (
    <header className="w-full bg-white shadow-sm border-b  fixed   top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-xl font-bold text-black tracking-tight">
          <Link to="/"><Logo /></Link>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `hover:underline hover:text-black ${isActive ? "text-black underline" : "text-gray-500"}`
          }
          >home</NavLink>
          <span className="text-gray-400">·</span>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `hover:underline hover:text-black ${isActive ? "text-black underline" : "text-gray-500"}`
          }
          >about</NavLink>
          <span className="text-gray-400">·</span>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `hover:underline hover:text-black ${isActive ? "text-black underline" : "text-gray-500"}`
          }
          >activities</NavLink>
          {/* <Search className="w-4 h-4 ml-2 cursor-pointer hover:text-black transition" /> */}
        </nav>

        {/* Auth Buttons */}
        <div className="flex justify-center items-center gap-3">
          {
            user ?
              <button
                onClick={handleLogout}
                className="bg-gray-200 p-1 m-1 rounded-md  hover:underline">
                logout
              </button>
              :
              <Link to="/login" className="bg-gray-200 p-1 m-1 rounded-md  hover:underline">Login</Link>
          }
          <Link to="/signup" className="bg-gray-200 p-1 m-1 rounded-md  hover:underline">Sign Up</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;

