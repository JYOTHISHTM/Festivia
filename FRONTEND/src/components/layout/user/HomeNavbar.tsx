import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { Calendar, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/slice/authSlice";



const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5001/users/logout", {
        method: "GET", 
        credentials: "include", 
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Logout failed");
      }
  
      console.log("✅ Logout successful");
  
      // ✅ Clear storage and Redux state
      localStorage.removeItem("token");
      sessionStorage.removeItem("user"); 
      document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  
      dispatch(logout()); // ✅ Update Redux state
      window.history.replaceState(null, "", "/user/login");
      window.location.replace("/user/login"); // <--- Forces full refresh

      // ✅ Navigate to login page
      navigate("/user/login");
    } catch (error: any) {
      console.error("❌ Error during logout:", error.message);
    }
  };
  
  
  

  return (
    <div className="pb-20">

      <nav className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md shadow-lg transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center group">
              <div className="relative">
                <Calendar className="h-8 w-8 text-green-600 transform group-hover:rotate-12 transition-transform" />
                <div className="absolute -inset-1 bg-green-100 rounded-full blur opacity-0 group-hover:opacity-75 transition-opacity"></div>
              </div>
              <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                EventPro
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="/user/home" className="text-[#333] font-sans no-underline">Home</a>
              <a href="#" className="text-[#333] font-sans no-underline">About</a>
              <a href="#" className="text-[#333] font-sans no-underline">Contact</a>
              <button
                onClick={handleLogout}
                className="px-6 py-2.5 text-green-600 hover:text-green-700 transition-colors relative group"
              >
                Logout
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
              </button>

            </div>

            <div
              className="relative flex items-center cursor-pointer"
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              onClick={() => navigate("/user/Profile")}
            >
              <FaUserCircle className="text-3xl text-[#333]" />
              {hover && (
                <span className="absolute top-full mt-1 text-sm bg-white shadow-md px-8 py-2 rounded">
                  See Profile
                </span>
              )}
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-gray-900"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden absolute w-full bg-white/95 backdrop-blur-md shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#services" className="block text-[#333] font-sans no-underline">Services</a>
              <a href="#about" className="block text-[#333] font-sans no-underline">About</a>
              <a href="#contact" className="block text-[#333] font-sans no-underline">Contact</a>
              <a href="/user/login" className="block text-[#333] font-sans no-underline">Login</a>
              <a href="/user/sign-up" className="block text-[#333] font-sans no-underline">Create Account</a>
            </div>
          </div>
        )}
      </nav>
    </div>

  );
};

export default Navbar;
