import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
const Header: React.FC = () => {
  return (
    <header className="w-full bg-orange-100 shadow-sm sticky top-0 z-50 animate-fade-down">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between transition-all duration-300">
        <div className='flex justify-around flex-row items-center'>
        <button ><Menu className="absolute left-0 ml-10 top-1/2 -translate-y-1/2"/></button>
        {/* Logo */}
        <div className="text-2xl font-bold text-black tracking-wide hover:scale-105 transition-transform duration-300">
          <Link to="/">SHOPIT</Link>
        </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex space-x-8 text-sm font-medium text-gray-600">
          <Link  to="/">Home</Link>
          <Link to="/">about us</Link>
          <Link to="/">catalogue</Link>
        </nav>

        {/* Login/Signup */}
        <div className="flex items-center space-x-4">
          <div className="bg-[#4a7c6a] px-4 py-2 rounded-full flex items-center space-x-4 text-white text-sm font-medium transition-transform duration-300 hover:scale-105 hover:shadow-md">
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/signup" className="hover:underline">Sign Up</Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
