import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useLoginMutation } from '../redux/api/userApi';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { useDispatch } from 'react-redux';
import { userExist, userNotExist } from '../redux/reducer/userReducer';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const [login] = useLoginMutation();
  const navigate = useNavigate();

  const loginHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login({ userName, password });
      const user = res.data?.user!;
      const token = user?.refreshToken;

      if ("data" in res && res.data?.success) {
        toast.success(res.data?.message!);
        navigate("/");
        localStorage.setItem("user", JSON.stringify(user));
        if (token) localStorage.setItem("token", token);
        dispatch(userExist(user));
      } else {
        const error = res.error as FetchBaseQueryError;
        let message = "Something went wrong";

        if (error?.data) {
          if (typeof error.data === "object" && "message" in error.data) {
            message = (error.data as any).message;
          }
          if (typeof error.data === "string") {
            const match = error.data.match(/<pre>(.*?)<\/pre>/);
            if (match) message = match[1].split("<br>")[0];
          }
        }
        toast.error(message);
        dispatch(userNotExist());
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    } catch {
      toast.error("Sign-in failed!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#0f0c29] text-white relative overflow-hidden">

      {/* Glow Effects */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#b075f5]/30 rounded-full blur-[150px] pointer-events-none z-0" />

      {/* Left Side (Intro) */}
      <div className="lg:w-1/2 flex items-center justify-center p-10 z-10">
        <div className="max-w-lg space-y-5 text-center">
          <h1 className="text-5xl font-bold text-purple-300">Shopit</h1>
          <p className="text-gray-300 text-sm">
            Welcome to Shopit — your one-stop shop for everything you love. Discover amazing products, exclusive deals, and a seamless shopping experience.
          </p>
        </div>
      </div>

      {/* Right Side (Form) */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 z-10">
        <form
          onSubmit={loginHandler}
          className="w-full max-w-md bg-[#1b1321] border border-[#3f2e40] rounded-2xl shadow-lg hover:shadow-purple-500/20 transition-all p-6 space-y-5"
        >
          <h2 className="text-2xl font-semibold text-purple-300 text-center">Login to your account</h2>

          <div>
            <label htmlFor="userName" className="block text-sm text-white mb-1">Username</label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={e => setUserName(e.target.value)}
              required
              placeholder="dan@gmail.com"
              className="w-full bg-[#2a1e30] text-white px-4 py-2 rounded border border-[#3f2e40] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#b075f5]"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-white mb-1">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full bg-[#2a1e30] text-white px-4 py-2 rounded border border-[#3f2e40] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#b075f5]"
            />
          </div>

          <div className="flex items-center justify-between text-sm text-gray-400">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2 accent-[#b075f5]" /> Remember me
            </label>
            <a href="/forgot" className="text-purple-300 hover:underline">Forgot password?</a>
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              className="bg-[#6b65e1] hover:bg-[#7a74f2] text-white py-2 rounded-full font-semibold transition"
            >
              Login
            </button>
            <button
              type="button"
              className="border border-[#6b65e1] text-[#6b65e1] py-2 rounded-full hover:bg-[#2a1e30] transition"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
