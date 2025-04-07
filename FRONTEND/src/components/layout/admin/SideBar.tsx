import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, Ticket, User, Wallet, Gift, LogOut } from "lucide-react";
import Logo from "../../../assets/images/Screenshot 2025-03-07 173036.png";
import { logout } from "../../../redux/slice/adminAuthSlice";
import { useDispatch } from "react-redux";

const SidebarNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const dispatch = useDispatch();



  
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5001/admin/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Logout failed");
      }

      console.log("✅ Logout successful");

      // ✅ Clear storage and Redux state
      localStorage.removeItem("token");
      sessionStorage.removeItem("admin");
      document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      dispatch(logout()); // ✅ Update Redux state
      window.history.replaceState(null, "", "/admin/login");
      window.location.replace("/admin/login"); // <--- Forces full refresh

      // ✅ Navigate to login page
      navigate("/admin/login");
    } catch (error: any) {
      console.error("❌ Error during logout:", error.message);
    }
  };

  const menuItems = [
    { id: 'DASHBOARD', icon: LayoutDashboard, label: 'DASHBOARD', path: '/admin/dashboard' },
    { id: 'EVENT_MANAGEMENT', icon: Calendar, label: 'EVENT MANAGEMENT', path: '/admin/eventmanagement' },
    { id: 'CREATORS_MANAGEMENT', icon: Users, label: 'CREATORS MANAGEMENT', path: '/admin/creatormanagement' },
    { id: 'USERS_MANAGEMENT', icon: Users, label: 'USERS MANAGEMENT', path: '/admin/usersmanagement' },
    { id: 'SUBSCRIPTIONS', icon: Ticket, label: 'SUBSCRIPTIONS', path: '#' },
    { id: 'ACCOUNT', icon: User, label: 'ACCOUNT', path: '#' },
    { id: 'COUPON', icon: Wallet, label: 'COUPON', path: '#' },
    { id: 'GIFT_CARD', icon: Gift, label: 'GIFT CARD', path: '#' },
    { id: 'LOGOUT', icon: LogOut, label: 'LOGOUT', action: handleLogout },
  ];

  const handleNavigation = (path?: string, action?: () => void) => {
    if (action) {
      action(); // Call the logout function
    } else if (path) {
      navigate(path);
    }
  };
  
  return (
    <div className="h-screen w-79 bg-white flex flex-col shadow-md">
      <div className="p-3 mb-2 flex justify-center">
        <img src={Logo}  alt="Festivia Logo" className="h-18" />
      </div>

      <div className="flex-grow overflow-y-auto px-2 scrollbar-hide">
        {menuItems.map(({ id, icon: Icon, label, path ,action }) => {
          const isActive = location.pathname === path;

          return (
            <div
              key={id}
              className={`flex items-center py-3 px-4 mb-1 cursor-pointer rounded-md sidebar-font group
                ${isActive ? 'bg-[#1DB954] text-white shadow-md' : 'bg-transparent text-gray-600 hover:bg-[#4FFFB0] hover:text-white'}`}
              onClick={() =>handleNavigation(path, action)}
            >
              <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-white'}`} />
              <span className="text-sm font-medium">{label}</span>
            </div>
          );
        })}
      </div>

      <div className="w-full border-t border-gray-200 mt-4"></div>
    </div>
  );
};

export default SidebarNavigation;
