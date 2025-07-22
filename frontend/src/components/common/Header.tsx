import React, { useCallback, useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "@/redux/api/userApi";
import { userNotExist } from "@/redux/reducer/userReducer";
import type { RootState } from "@/redux/reducer/store";
import toast from "react-hot-toast";
import Logo from "../ui/Logo";
import LogoutConfirm from "../ui/LogoutConfirm";
import MenuBar from "../features/MenuBar";
import ProfileIcon from "../features/ProfileIcon";

const navItems = [
  { name: "home", path: "/" },
  { name: "shop", path: "/shop" },
  { name: "about", path: "/about" },
];

const Header: React.FC = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { user, loading } = useSelector((state: RootState) => state.userReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();

  const handleLogout = useCallback(async () => {
    try {
      const res = await logout();
      setShowLogoutModal(false);
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
  }, [dispatch, logout, navigate]);

  useEffect(()=>{
    console.log("user:",user)
  },[])

  return (
    <header className=" fixed top-0 z-50 w-full  bg-[#0f0c29]  bg-opacity-90 shadow-lg backdrop-blur-md ">
       
    <div className="max-w-7xl mx-auto py-3  flex justify-between items-center  ">
      
      <Logo />
    

      <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
        {navItems.map(({ name, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `capitalize text-lg transition hover:underline ${
                isActive ? "text-white underline" : "text-gray-300 hover:text-white"
              }`
            }
          >
            {name}
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center gap-4 relative">
        {
          user && <MenuBar />
        }

        {!loading && (
          <>
            {user ? (
             <div className="flex items-center">
               
              <button
                onClick={() => setShowLogoutModal(true)}
                className="bg-white/10 text-white border border-white/20 px-4 py-2 rounded-full hover:bg-white/20 transition"
              >
                Logout
              </button>
              <ProfileIcon/>
             </div>
            ) : (
              <Link
                to="/login"
                className="bg-white/10 text-white border border-white/20 px-4 py-2 rounded-full hover:bg-white/20 transition"
              >
                Login
              </Link>
            )}
            {
              user ? null : (
                <Link
              to="/signup"
              className="bg-white/10 text-white border border-white/20 px-4 py-2 rounded-full hover:bg-white/20 transition"
            >
              Sign Up
            </Link>
              )
            }
          </>
        )}

        {showLogoutModal && (
          <LogoutConfirm
            onClose={() => setShowLogoutModal(false)}
            proceedAction={handleLogout}
          />
        )}
      </div>
    </div>
  </header>
  );
};

export default Header;
