import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../../services/admin/adminService"; 
import { login } from "../../redux/slice/adminAuthSlice";
import { useDispatch } from "react-redux";


const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
  
    try {
      const response = await adminLogin(username, password);
      console.log("Response:", response);
  
      if (response.status === 200) {
        const { token, admin } = response.data;
  
        localStorage.setItem("token", token);
  
        dispatch(login({ admin, token }));
  
        navigate("/admin/dashboard"); 
      }
    } catch (err) {
      setError("Invalid username or password!");
    }
  };
  
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-100 p-4 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-10 text-center">ADMIN LOGIN</h1>
        
        {error && <p className="text-red-500">{error}</p>}

        <form className="w-full space-y-6" onSubmit={handleLogin}>
          <input 
            type="text" 
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-100 border-0 text-gray-500 placeholder-gray-400"
          />
          <input 
            type="password" 
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-100 border-0 text-gray-500 placeholder-gray-400"
          />
          <button 
            type="submit" 
            className="px-15 py-2 bg-blue-500 text-white rounded-full shadow-md text-gray-700 font-medium text-sm"
          >
            SIGN IN
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
