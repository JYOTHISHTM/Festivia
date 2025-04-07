import api from "./ApiService";

export const getCreators = async () => {
  try {
    const res = await api.get(`http://localhost:5001/admin/creator`);
    return res.data;
  } catch (err) {
    console.error("Error fetching creators:", err);
    throw err;
  }
};

export const toggleCreatorBlockStatus = async (creatorId: string) => {
  try {
    const res = await api.put(`http://localhost:5001/admin/toggle-block-creator/${creatorId}`);
    return res.data;
  } catch (err) {
    console.error("Error updating creator status:", err);
    throw err;
  }
};


export const adminLogin = async (username: string, password: string) => {
  try {
    const response = await api.post(`/admin/login`, { username, password });
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchUsers = async () => {
  try {
    const response = await api.get(`http://localhost:5001/admin/users`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const toggleBlockUser = async (userId: string) => {
  try {
    const response = await api.put(`http://localhost:5001/admin/toggle-block/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error updating user status:", error);
    throw error;
  }
};


