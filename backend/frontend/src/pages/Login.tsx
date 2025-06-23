import React, { useState } from 'react';
import './Login.css';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '../firbase';
import toast from 'react-hot-toast';
import { FaGoogle } from 'react-icons/fa';

const Login: React.FC = () => {
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")

  const loginHandler = async()=>{
    try {
      const provider = new GoogleAuthProvider()
     await signInWithPopup(auth,provider)
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
        <form className="login-form">
          <h2>Login to your account</h2>
          <label htmlFor="email">Email address</label>
          <input type="email" id="email" value={email} onChange={e=> setEmail(e.target.value)} placeholder="name@email.com" required />
          <label htmlFor="password">Password</label>
          <input type="password" id="password" value={password} onChange={e=> setPassword(e.target.value)} placeholder="Password" required />
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
          <button type="button" className="login-btn  login-btn-google" onClick={loginHandler} >
          <FaGoogle/> Sign in with Google
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login; 