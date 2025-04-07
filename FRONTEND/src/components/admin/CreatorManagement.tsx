import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/admin/SideBar";
import Swal from "sweetalert2";
import { getCreators, toggleCreatorBlockStatus } from "../../services/admin/adminService";

interface Creator {
  _id: string;
  name: string;
  email: string;
  isBlocked: boolean;
}

const CreatorsManagement = () => {
  const [creators, setCreators] = useState<Creator[]>([]);

  useEffect(() => {
    fetchCreators();
  }, []);

  const fetchCreators = async () => {
    try {
      const data = await getCreators();
      setCreators(data);
    } catch (err) {
      console.error("Failed to fetch creators.");
    }
  };

  const toggleBlockCreator = async (creatorId: string, isBlocked: boolean) => {
    const action = isBlocked ? "Unblock" : "Block";

    const confirm = await Swal.fire({
      title: `Are you sure you want to ${action} this creator?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: isBlocked ? "#3085d6" : "#d33",
      cancelButtonColor: "#555",
      confirmButtonText: `Yes, ${action}`,
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await toggleCreatorBlockStatus(creatorId);
      setCreators(creators.map(creator => (creator._id === creatorId ? { ...creator, isBlocked: !creator.isBlocked } : creator)));

      Swal.fire({
        title: res.message,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire("Error", "Failed to update creator status.", "error");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-6 w-full">
        <h1 className="text-2xl font-semibold mb-4">Creators Management</h1>
        <table className="w-280 border-collapse">
          <thead>
            <tr className="bg-gray-900 text-white">
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-center">Email</th>
              <th className="px-6 py-3 text-center">Status</th>
              <th className="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {creators.map((creator) => (
              <tr key={creator._id} className="border-b">
                <td className="px-6 py-4">{creator.name}</td>
                <td className="px-6 py-4 text-center">{creator.email}</td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`px-4 py-2 rounded-full ${creator.isBlocked ? "bg-red-500" : "bg-green-500"} text-white`}
                  >
                    {creator.isBlocked ? "Blocked" : "Active"}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => toggleBlockCreator(creator._id, creator.isBlocked)}
                    className={`px-4 py-2 text-white rounded ${creator.isBlocked ? "bg-blue-500" : "bg-red-500"} hover:opacity-80`}
                  >
                    {creator.isBlocked ? "Unblock" : "Block"}
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

export default CreatorsManagement;
