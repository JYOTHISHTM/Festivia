import axios from 'axios';

const BASE_URL = 'http://localhost:5001/creator';

export const creatorService = {

  signUp: async (userData: { name: string, email: string, password: string }) => {
    try {
      const response = await axios.post(`${BASE_URL}/sign-up`, userData);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || "Something went wrong" 
      };
    }
  },
  
  verifyOtp: async (email: string, otp: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/verify-otp`, { email, otp });
      return { success: true, data: response.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || "Invalid OTP" 
      };
    }
  },
  
  resendOtp: async (email: string) => {
    try {
      await axios.post(`${BASE_URL}/resend-otp`, { email });
      return { success: true };
    } catch (error) {
      return { success: false, error: "Failed to resend OTP. Try again later." };
    }
  }
};