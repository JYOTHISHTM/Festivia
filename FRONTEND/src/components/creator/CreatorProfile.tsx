import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { User2, Mail, Edit2, Save, X, Calendar } from "lucide-react";
import Sidebar from "../../components/layout/creator/SideBar";
import api from "../../services/creator/ApiService";

interface Creator {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}


const Profile = () => {
  const [creator, setCreator] = useState<Creator | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedCreator, setUpdatedCreator] = useState<Creator>({ id: "", name: "", email: "" ,createdAt:""});

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Unauthorized. Please log in.");
        return;
      }

      try {
        const res = await api.get("/creator/profile-data");
        if (res.data) {
          setCreator(res.data);
          setUpdatedCreator(res.data);
          localStorage.setItem("creator", JSON.stringify(res.data)); 
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
      }
    };

    fetchProfile();
  }, []);
  
  

  const handleUpdate = async () => {
    if (
      updatedCreator.name === creator?.name &&
      updatedCreator.email === creator?.email
    ) {
      toast.error("No changes detected");
      setEditMode(false);
      return;
    }
  
    try {
      const res = await api.put("/creator/update-profile", updatedCreator, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
  
      if (res.status === 200) {
        setCreator(res.data);
        setUpdatedCreator(res.data);
        localStorage.setItem("creator", JSON.stringify(res.data)); 
        setEditMode(false);
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile ");
    }
  };


  const handleCancel = () => {
    if (creator) {
      setUpdatedCreator(creator);
    }
    setEditMode(false);
    toast.error("Changes cancelled");
  };

  if (!creator) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-pulse text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8 mt-20">
        <Toaster position="top-right" />

        <div className="max-w-3xl mx-auto ">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-semibold text-gray-900">Creator Profile</h1>
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
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Save size={16} />
                      Save Changes
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
                      value={updatedCreator.name}
                      onChange={(e) => setUpdatedCreator({ ...updatedCreator, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="Enter your name"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-700">{creator.name}</div>
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
                      value={updatedCreator.email}
                      onChange={(e) => setUpdatedCreator({ ...updatedCreator, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="Enter your email"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-700">{creator.email}</div>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Calendar size={16} className="text-gray-400" />
                    Member Since
                  </label>
                  <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-700">
                    {new Date(creator.createdAt).getFullYear()}
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;