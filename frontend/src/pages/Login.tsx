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
  const navigate = useNavigate()
  const loginHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login({ userName, password });
      // console.log("res.data?.refreshToken:",res)
      const user = res.data?.user!;
      const token = user?.refreshToken
      if ("data" in res && res.data?.success) {

        toast.success(res.data?.message!);

        navigate("/");

        localStorage.setItem("user", JSON.stringify(user));
        if(token){
          localStorage.setItem("token",token)
        }
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
            if (match) {
              message = match[1].split("<br>")[0]; // Extract just the main error line
            }
          }
        }
        toast.error(message);
        dispatch(userNotExist());
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    } catch (error) {
      toast.error("sign-in fail!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Left Intro with Aesthetic Background */}
      <div className="md:w-1/2 flex flex-col justify-center items-center p-10 bg-gradient-to-br from-green-700 to-green-500 text-white relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-white opacity-5 rounded-full animate-pulse" />
        <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-white opacity-10 rounded-full animate-ping" />

        <div className="z-10 text-center space-y-4">
          <h1 className="text-5xl font-bold tracking-wide animate-fade-in">Shopit</h1>
          <h2 className="text-2xl font-medium">Welcome to Shopit!</h2>
          <p className="max-w-md text-sm leading-relaxed">
            Your one-stop shop for everything you love. Discover amazing products,
            exclusive deals, and a seamless shopping experience that you'll keep coming back to.
          </p>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="md:w-1/2 flex flex-col justify-center items-center p-8">
        <form onSubmit={loginHandler} className="w-full max-w-md bg-white rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Login to your account</h2>

          <label htmlFor="userName" className="block text-sm text-gray-600 mb-1">User name</label>
          <input
            type="text"
            id="userName"
            value={userName}
            onChange={e => setUserName(e.target.value)}
            placeholder="joenDo360"
            required
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <label htmlFor="password" className="block text-sm text-gray-600 mb-1">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Remember me
            </label>
            <a href="/forgot" className="text-green-600 hover:underline">Forgot password?</a>
          </div>

          <div className="flex flex-col space-y-2 mb-4">
            <button type="submit" className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
              Login
            </button>
            <button type="button" className="border border-green-600 text-green-600 py-2 rounded hover:bg-green-50 transition">
              Sign up
            </button>
          </div>

          <div className="text-center text-gray-400 text-sm">
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
