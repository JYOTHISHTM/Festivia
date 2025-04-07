import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/admin/SideBar";
import Swal from "sweetalert2";
import { fetchUsers, toggleBlockUser } from "../../services/admin/adminService"; 

interface User {
  _id: string;
  name: string;
  email: string;
  isBlocked: boolean;
}

const UsersManagement = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const usersData = await fetchUsers();
      setUsers(usersData);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleToggleBlock = async (userId: string, isBlocked: boolean) => {
    const action = isBlocked ? "Unblock" : "Block";

    const confirm = await Swal.fire({
      title: `Are you sure you want to ${action} this user?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: isBlocked ? "#3085d6" : "#d33",
      cancelButtonColor: "#555",
      confirmButtonText: `Yes, ${action}`,
    });

    if (!confirm.isConfirmed) return;

    try {
      const response = await toggleBlockUser(userId);
      setUsers(users.map(user => (user._id === userId ? { ...user, isBlocked: !user.isBlocked } : user)));

      // Success alert
      Swal.fire({
        title: response.message,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire("Error", "Failed to update user status.", "error");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-6 w-full">
        <h1 className="text-2xl font-semibold mb-4">Users Management</h1>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-900 text-white">
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-center">Email</th>
              <th className="px-6 py-3 text-center">Status</th>
              <th className="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b">
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4 text-center">{user.email}</td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`px-4 py-2 rounded-full ${user.isBlocked ? "bg-red-500" : "bg-green-500"} text-white`}
                  >
                    {user.isBlocked ? "Blocked" : "Active"}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleToggleBlock(user._id, user.isBlocked)}
                    className={`px-4 py-2 text-white rounded ${user.isBlocked ? "bg-blue-500" : "bg-red-500"} hover:opacity-80`}
                  >
                    {user.isBlocked ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersManagement;
