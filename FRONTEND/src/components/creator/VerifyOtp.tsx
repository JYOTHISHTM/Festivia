// src/pages/VerifyOtp.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { creatorService } from '../../services/creator/creatorService';

const VerifyOtp: React.FC = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(30);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [otpExpired, setOtpExpired] = useState(false);
  const navigate = useNavigate();
  const email = sessionStorage.getItem("email");

  useEffect(() => {
    if (!email) {
      navigate("/creator/sign-up");
    }
    
    startOtpTimer();
  }, [email, navigate]);

  const startOtpTimer = () => {
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(countdown);
          setOtpExpired(true); 
          setResendDisabled(false); 
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return countdown;
  };

  const handleChange = (index: number, value: string) => {
    if (value.match(/^[0-9]$/)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Auto-focus next input
      if (index < 3 && value !== '') {
        const nextInput = document.querySelector(`input[type="text"]:nth-child(${index + 2})`) as HTMLInputElement;
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpExpired) {
      setError("OTP expired. Please request a new one.");
      return;
    }
    
    const otpCode = otp.join('');
    if (!email) return;
    
    const result = await creatorService.verifyOtp(email, otpCode);
    
    if (result.success) {
      sessionStorage.removeItem("email");
      navigate("/creator/login");
    } else {
      setError(result.error || "Verification failed");
    }
  };

  const handleResendOtp = async () => {
    if (!otpExpired || !email) return; 
    
    setError(null);
    const result = await creatorService.resendOtp(email);
    
    if (result.success) {
      setOtp(["", "", "", ""]);
      setTimer(30);
      setOtpExpired(false);
      setResendDisabled(true);

      // Clear any existing timer and start a new one
      const interval = startOtpTimer();
      
      // Clean up the interval when component unmounts or when timer expires
      return () => clearInterval(interval);
    } else {
      setError(result.error || "Verification failed");    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-6">
      <div className="w-[400px] p-6 bg-white shadow-xl rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-4">Verify OTP</h1>
        <p className="text-center text-gray-500 mb-6">Enter the 4-digit OTP sent to {email}</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <div className="flex space-x-3 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                className="w-12 h-12 text-xl text-center border-2 border-gray-300 rounded-lg focus:border-gray-500"
                disabled={otpExpired}
              />
            ))}
          </div>

          <p className="text-sm text-gray-600 mb-3">OTP expires in: <span className="text-red-500 font-semibold">{timer}s</span></p>

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <button type="submit" disabled={otpExpired} 
            className={`w-full py-2 rounded-lg text-white ${!otpExpired ? "bg-black hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"}`}>
            Verify OTP
          </button>

          <button type="button" disabled={resendDisabled} onClick={handleResendOtp}
            className={`w-full mt-3 py-2 rounded-lg ${resendDisabled ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:underline"}`}>
            Resend OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;