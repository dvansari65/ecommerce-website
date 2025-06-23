import React, { useState } from 'react';
import './Login.css';
import toast from 'react-hot-toast';
import { useLoginMutation } from '../redux/api/userApi';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import type { messageResponse } from '../types/api-types';
import { useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
import { userExist } from '../redux/reducer/userReducer';


const Login: React.FC = () => {
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const dispatch = useDispatch()
  // const navigate = useNavigate()
  const [login] = useLoginMutation()
  const loginHandler = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await login({
        userName: userName || "",
        password: password || ""
      })
      const user = res.data?.user!
      const token = res.data?.accessToken
      console.log("user:",user)
      if("data" in res && res.data?.success){
        toast.success(res.data?.message!)
        dispatch(userExist(user))
        localStorage.setItem("user",JSON.stringify(user))
       if(token) localStorage.setItem("token",token!)
      }else{
        const error = res.error as FetchBaseQueryError
        const message = error.data as messageResponse
        toast.error(message.message)
      }  
      console.log("res:",res)
    } catch (error) {
      toast.error("sign-in fail!")
    }
  }
  return (
    <div className="login-root">
      <div className="login-left">
        <div className="login-logo-anim">

          <span className="login-logo-text">Shopit</span>
        </div>
        <h1 className="login-welcome">Welcome to Shopit!</h1>
        <p className="login-desc">Your one-stop shop for everything you love. Discover amazing products, exclusive deals, and a seamless shopping experience.</p>
      </div>
      <div className="login-right">
        <form onSubmit={loginHandler} className="login-form">
          <h2>Login to your account</h2>
          <label htmlFor="userName">user name</label>
          <input type="text" id="userName" value={userName} onChange={e => setUserName(e.target.value)} placeholder="joenDo360" required />
          <label htmlFor="password">Password</label>
          <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
          <div className="login-form-row">
            <label className="login-remember">
              <input type="checkbox" /> Remember me
            </label>
            <a href="/forgot" className="login-forgot">Forgot password?</a>
          </div>
          <div className="login-form-actions">
            <button type="submit" className="login-btn login-btn-primary">Login</button>
            <button type="button" className="login-btn login-btn-secondary">Sign up</button>
          </div>
          <div className="login-divider"><span>or</span></div>

        </form>
      </div>
    </div>
  );
};

export default Login; 