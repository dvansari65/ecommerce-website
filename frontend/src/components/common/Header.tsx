import React, { useCallback, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "@/redux/api/userApi";
import { userNotExist } from "@/redux/reducer/userReducer";
import type { RootState } from "@/redux/reducer/store";
import toast from "react-hot-toast";
import Logo from "../ui/Logo";
import LogoutConfirm from "../ui/LogoutConfirm";
import { ShoppingCartIcon } from "lucide-react";
import MenuBar from "../features/MenuBar";

const navItems = [
  { name: "home", path: "/" },
  { name: "shop", path: "/shop" },
  { name: "about", path: "/about" },
];

const Header: React.FC = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { user, loading } = useSelector((state: RootState) => state.userReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();

  const handleLogout = useCallback(async () => {
    try {
      const res = await logout();
      setShowLogoutModal(false)
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

  return (
    <header className="fixed top-0 z-50 w-full bg-[rgb(63,46,64)] shadow ">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Logo />

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navItems.map(({ name, path }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `capitalize text-lg transition hover:underline ${
                  isActive ? "text-white underline" : "text-gray-300"
                }`
              }
            >
              {name}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4 relative">
          {/* Cart Icon & Menu */}
          <div className="relative ">
            <button onClick={() => setShowMenu((prev) => !prev)}>
              <ShoppingCartIcon className="text-white hover:cursor-pointer" />
            </button>
            {showMenu && (
              <div className="absolute mt-3 right-0 z-50">
                <MenuBar />
              </div>
            )}
          </div>

          {/* Auth Actions */}
          {!loading && (
            <>
              {user ? (
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="bg-gray-200 px-3 py-1 rounded-md hover:underline hover:cursor-pointer"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="bg-gray-200 px-3 py-1 rounded-md hover:underline"
                >
                  Login
                </Link>
              )}
              <Link
                to="/signup"
                className="bg-gray-200 px-3 py-1 rounded-md hover:underline"
              >
                Sign Up
              </Link>
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
