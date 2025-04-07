
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001",
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    console.group("🌐 API Request Interceptor");
    const token = localStorage.getItem("token");
    console.log("🔑 Token from localStorage:", token);
    console.log("🌍 Request URL:", config.url);
    console.log("🔧 Request Method:", config.method);

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      console.log("✅ Token added to headers");
    } else {
      console.warn("❌ No token found in localStorage");
    }

    console.groupEnd();
    return config;
  },
  (error) => {
    console.error("❌ Request Interceptor Error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.group("🌐 API Response Interceptor");
    console.log("✅ Response Status:", response.status);
    console.log("📦 Response Data:", response.data);
    console.groupEnd();
    return response;
  },
  async (error) => {
    console.group("❌ API Error Interceptor");
    const status = error.response?.status;
    console.log("🚨 Error Status:", status);
    console.log("📝 Error Details:", error.response?.data);

    
    if (status === 403) {
      console.warn("🚫 User is blocked! Logging out...");
      logoutUser();
      return Promise.reject(error); 
    }
    
    if (status === 401) {
      console.warn("🔄 Token expired, attempting refresh...");

      try {
        const refreshToken = document.cookie
          .split("; ")
          .find((row) => row.startsWith("refreshToken="))
          ?.split("=")[1];

        console.log("🔑 Refresh Token:", refreshToken);

        if (!refreshToken) {
          console.error("❌ No refresh token found");
          logoutUser();
          return Promise.reject(error);
        }

        const { data } = await axios.post("http://localhost:5001/users/refresh-token", {
          refreshToken,
        });

        console.log("🔄 New Token Received:", data.token);

        localStorage.setItem("token", data.token);
        error.config.headers["Authorization"] = `Bearer ${data.token}`;

        console.groupEnd();
        return api(error.config);
      } catch (refreshError) {
        console.error("❌ Refresh token failed:", refreshError);
        logoutUser();
        console.groupEnd();
        return Promise.reject(refreshError);
      }
    }

    console.groupEnd();
    return Promise.reject(error);
  }
);

const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  setTimeout(() => {
    window.location.href = "/user/login";
  }, 1000);
};

export default api;
