import { useState, useEffect } from "react";
import { Edit2, Save, X, User2, Mail } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import Navbar from "../layout/user/HomeNavbar";
import api from '../../services/ApiService'
// Define User type
interface User {
  id: string;
  name: string;
  email: string;
}

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState<User>({ id: "", name: "", email: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
  
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setUpdatedUser(JSON.parse(storedUser));
        return; // Stop further execution if we already have user data
      }
  
      if (!token) {
        toast.error("Unauthorized. Please log in.");
        return;
      }
  
      try {
        const res = await api.get("/users/profile-data");
        if (res.data) {
          setUser(res.data);
          setUpdatedUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data)); // Store fresh data
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
      }
    };
  
    fetchProfile();
  }, []);
  
  

  const handleUpdate = async () => {
    // Check if there are any changes before calling the API
    if (
      updatedUser.name === user?.name &&
      updatedUser.email === user?.email
    ) {
      toast.error("No changes detected");
      setEditMode(false);
      return;
    }
  
    try {
      const res = await api.put("/users/update-profile", updatedUser, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
  
      if (res.status === 200) {
        setUser(res.data); // Update state
        setUpdatedUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data)); // Store updated user
        setEditMode(false);
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };
  

  const handleCancel = () => {
    if (user) {
      setUpdatedUser(user);
    }
    setEditMode(false);
    toast.error("Changes cancelled");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-4xl font-medium text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-green-100/100 to-transparent">
        <Toaster position="top-right" />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden mt-20">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-semibold text-gray-900">Profile Settings</h1>
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Edit2 size={16} />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdate}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      <Save size={16} />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <User2 size={16} className="text-gray-400" />
                    Name
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={updatedUser.name}
                      onChange={(e) => setUpdatedUser({ ...updatedUser, name: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      placeholder="Enter your name"
                    />
                  ) : (
                    <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-700">{user.name}</div>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Mail size={16} className="text-gray-400" />
                    Email
                  </label>
                  {editMode ? (
                    <input
                      type="email"
                      value={updatedUser.email}
                      onChange={(e) => setUpdatedUser({ ...updatedUser, email: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      placeholder="Enter your email"
                    />
                  ) : (
                    <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-700">{user.email}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
