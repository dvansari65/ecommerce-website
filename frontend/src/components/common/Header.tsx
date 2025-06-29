import React, { useCallback, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "@/redux/api/userApi";
import { userNotExist } from "@/redux/reducer/userReducer";
import type { RootState } from "../../redux/reducer/store";
import toast from "react-hot-toast";
import Logo from "../ui/Logo";
import LogoutConfirm from "../ui/LogoutConfirm";
import {ShoppingCartIcon} from "lucide-react"
const navItems = [
  { name: "home", path: "/" },
  { name: "shop", path: "/shop" },
  { name: "about", path: "/about" },
];

const Header: React.FC = () => {
  const [showModal, setShowModal] = useState(false)
  const { user, loading } = useSelector((state: RootState) => state.userReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();

  const handleLogout = useCallback(async()=>{
    try {
      const res = await logout();
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
  },[logout,dispatch])

  return (
    <header className="w-full fixed  top-0 z-50 bg-white shadow border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-xl font-bold text-black">
          <Logo />
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
          {navItems.map((item, index) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `capitalize text-lg transition hover:underline ${isActive ? "text-black underline" : "text-gray-500"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <Link to="/cart" className="mr-2 "><ShoppingCartIcon className="hover:text-gray-500 text-blue-400  "/></Link>
         
          { (!loading && user) ? <button
            onClick={() => setShowModal(true)}
            className="bg-gray-200 px-3 py-1 rounded-md hover:underline"
          >
            Logout
          </button>:(<Link
            to="/login"
            className="bg-gray-200 px-3 py-1 rounded-md hover:underline"
          >
            Login
          </Link>)}
          {showModal && <LogoutConfirm onConfirm={handleLogout} onCancel={() => setShowModal(false)} />}
          
          <Link
            to="/signup"
            className="bg-gray-200 px-3 py-1 rounded-md hover:underline"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
