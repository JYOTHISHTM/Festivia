// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import api from '../../services/creator/ApiService';
import { login } from "../../redux/slice/creatorAuthSlice";

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({ email: "", password: "", general: "" });
  
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const validateEmail = (value: string) => {
    if (value.startsWith(" ")) return "Email cannot start with a space";
    if (!value.trim()) return "Email is required";
    if (!value.includes("@")) return "Email must contain '@'";
    if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(value)) return "Invalid email format";
    return "";
  };
  
  const validatePassword = (value: string) => {
    if (!value.trim()) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    if (!/[A-Z]/.test(value)) return "Password must contain at least one uppercase letter";
    if (!/[0-9]/.test(value)) return "Password must contain at least one number";
    if (!/[@$!%*?&]/.test(value)) return "Password must contain at least one special character (@$!%*?&)";
    return "";
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setErrors({ ...errors, email: validateEmail(value) });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setErrors({ ...errors, password: validatePassword(value) });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors((prev) => ({ ...prev, general: "" }));
  
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
  
    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError, general: "" });
      return;
    }
  
    setIsLoading(true); // Start loading
  
    try {
  
      const res = await api.post("http://localhost:5001/creator/login", 
        { email, password,role: "creator" },
        { withCredentials: true }
      );
      console.log("🔍 API Response Data:", res.data);


      
  
      if (!res.data || !res.data.creator) {
        console.error("❌ Invalid server response: Missing creator data");
        throw new Error("Invalid server response: Missing creator data");
      }
  
      const { token, creator } = res.data;
  

      if (!creator) {
        console.error("❌ Invalid server response: Missing creator data");
        throw new Error("Invalid server response: Missing creator data");
      }
      
      if (res.status === 200) {
        dispatch(login({ creator, token })); 
        console.log("📦 Token in localStorage after dispatch:", localStorage.getItem("token"));
        console.log("👤 Creator in localStorage after dispatch:", localStorage.getItem("creator"));
        navigate("/creator/dashboard");
      } else {
        setErrors((prev) => ({ ...prev, general: res.data.message || "Invalid Credentials" }));
      }
  
      console.groupEnd();
    } catch (error: any) {
      console.group("❌ Login Error");
      console.error("Server error:", error);
  
      if (error.response) {
       
  
        if (error.response.status === 403) {
          setErrors((prev) => ({ ...prev, general: error.response.data.message }));
        } else {
          setErrors((prev) => ({
            email: prev.email || "",
            password: prev.password || "",
            general: error.response.data?.message || "Invalid Credentials. Please try again.",
          }));
        }
      } else if (error.request) {
        setErrors((prev) => ({
          email: prev.email || "",
          password: prev.password || "",
          general: "Server is unreachable. Please try again later.",
        }));
      } else {
        setErrors((prev) => ({
          email: prev.email || "",
          password: prev.password || "",
          general: "An unexpected error occurred.",
        }));
      }
  
      console.groupEnd();
    } finally {
      setIsLoading(false);
    }
  };
  
  
  

  return (
    <div className="container mx-auto p-8 flex justify-center items-center min-h-screen">
      <div className="form-card flex w-[1050px] h-[600px] bg-white rounded-[30px] shadow-2xl shadow-gray-600/100 overflow-hidden">
        <div className="image-container w-4/5 bg-[#f9fafb] flex justify-center items-center p-12 relative overflow-hidden">
          <img className="w-[550px] h-[450px] object-contain rounded-[20px]" src="https://res.cloudinary.com/drha2z2qr/image/upload/v1741850318/27637692_7347889_kt6mtf.jpg" alt="Profile" />
        </div>
        <div className="form-content w-3/5 p-12 bg-white flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-[#1a1a1a] mb-4 text-center">CREATOR LOGIN</h1>
          <p className="text-center text-sm mb-6 text-[#666]">
            Don't have an account? <a href="/creator/sign-up" className="text-[#2563eb] font-medium hover:text-[#1d4ed8]">Sign up</a>
          </p>
          {errors.general && <p className="text-red-500 text-center mb-4">{errors.general}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block text-[#4b5563] text-base font-medium mb-2">Email Address</label>
              <input
                type="email"
                className="w-full p-3 border-2 rounded-[12px] focus:border-[#4f4f4f]"
                value={email}
                onChange={handleEmailChange}
                required
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div className="mb-5 relative">
              <label className="block text-[#4b5563] text-base font-medium mb-2">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                className="w-full p-3 border-2 rounded-[12px] focus:border-[#4f4f4f]"
                value={password}
                onChange={handlePasswordChange}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-12 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#020202] text-white py-3 rounded-[22px] text-lg font-semibold hover:bg-[#00AB66] disabled:bg-gray-400"
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>
          </form>
          <div className="text-center mt-4">
            <a href="/creator/forgot-password" className="text-[#666] text-sm hover:underline">Forgot your password?</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;