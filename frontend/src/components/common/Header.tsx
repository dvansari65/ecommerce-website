import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from "../../redux/reducer/store"
import { Button } from '@chakra-ui/react';
import { useLogoutMutation } from '@/redux/api/userApi';
import toast from 'react-hot-toast';
import { userNotExist } from '@/redux/reducer/userReducer';
const Header: React.FC = () => {
  const [isModalOpen,setModalOpen] = useState(false) 
  const { user } = useSelector((state: RootState) => state.userReducer)
  const dispatch = useDispatch()
  const [logout] = useLogoutMutation()
  const navigate = useNavigate()
  const logoutHandler = async () => {
    try {
      const res = await logout()
      const message = res?.data?.message || "Logged out successfully!"
      toast.success(message as string)
    } catch (error) {
      console.error("failed to logged out!",error)
      toast.error(error as string)
    }finally{
      localStorage.removeItem("user")
      localStorage.removeItem("token")
      dispatch(userNotExist())
      navigate("/")
    }
  }
  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50 animate-fade-down">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between transition-all duration-300">
        <div className='flex justify-around flex-row items-center'>
          <button ><Menu className="absolute left-0 ml-10 top-1/2 -translate-y-1/2" /></button>
          {/* Logo */}
          <div className="text-2xl font-bold text-black tracking-wide hover:scale-105 transition-transform duration-300">
            <Link to="/">SHOPIT</Link>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex space-x-8 text-sm font-medium text-gray-600">
          <Link to="/">Home</Link>
          <Link to="/">about us</Link>
          <Link to="/">catalogue</Link>
        </nav>

        {/* Login/Signup */}
        <div className="flex items-center space-x-4">
          <div className="flex justify-center items-center gap-3">
            {
              user ? 
              <button 
              onClick={logoutHandler} 
              className="bg-gray-200 p-1 m-1 rounded-md  hover:underline">
                logout
                </button>
                :
                <Link to="/login" className="bg-gray-200 p-1 m-1 rounded-md  hover:underline">Login</Link>
            }
            <Link to="/signup" className="bg-gray-200 p-1 m-1 rounded-md  hover:underline">Sign Up</Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
