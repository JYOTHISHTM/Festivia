import { useForm, SubmitHandler } from "react-hook-form";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface FormValues {
  email: string;
}

function ForgotOtp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const [emailSubmitted, setEmailSubmitted] = useState<boolean>(false);
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const navigate = useNavigate();
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  const [emailValue, setEmailValue] = useState<string>("");

  const onEmailSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const response = await fetch("http://localhost:5001/users/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email,type:"user" }),
      });

      const resData = await response.json();

      if (response.ok) {
        console.log("✅ OTP sent to:", data.email);
        setEmailSubmitted(true);
        setEmailValue(data.email);
      } else {
        alert(resData.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("❌ Error sending OTP:", error);
      alert("Something went wrong");
    }
  };


  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return; // only allow digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpSubmit = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length === 4) {
      try {
        const response = await fetch("http://localhost:5001/users/verify-otp-forgot-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: emailValue,
            otp: enteredOtp,
            type: "user", // 👈 Make sure this is added
          }),
        });

        const data = await response.json();
        if (response.ok) {
          console.log("✅ OTP sent to:", emailValue);
          console.log("🔐 OTP for testing:", data.otp); // ✅ log the OTP
        } else {
          alert(data.message || "Failed to send OTP");
        }

        if (response.ok) {
          console.log("✅ OTP verified successfully");
          navigate("/user/reset-password", { state: { email: emailValue } });
        } else {
          alert(data.message || "❌ Invalid OTP");
        }
      } catch (error) {
        console.error("❌ Error verifying OTP:", error);
        alert("Something went wrong. Please try again.");
      }
    } else {
      alert("Please enter a valid 4-digit OTP");
    }
  };



  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-green-100 to-green-100 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md text-center space-y-6">
        <h1 className="text-2xl font-bold text-gray-700">Forgot Password</h1>

        <form onSubmit={handleSubmit(onEmailSubmit)} className="space-y-4">
          <div className="relative">
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
              value={emailValue}
              readOnly={emailSubmitted}
              onChange={(e) => setEmailValue(e.target.value)}
              className={`w-full p-3 border rounded-lg focus:outline-none ${emailSubmitted
                  ? "bg-gray-500 cursor-not-allowed"
                  : "border-green-500-300 focus:ring-2 focus:ring-green-500"
                }`}
            />
            {errors.email && !emailSubmitted && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message as string}
              </p>
            )}
          </div>

          {!emailSubmitted && (
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
            >
              Send OTP
            </button>
          )}
        </form>

        {/* Back to login link below email */}
        {!emailSubmitted && (
          <button
            className="text-sm text-blue-600 hover:underline mt-2"
            onClick={() => navigate("/user/login")}
          >
            ← Back to Login
          </button>
        )}

        {/* OTP Section */}
        {emailSubmitted && (
          <div className="space-y-4 transition-all duration-300">
            <h2 className="text-lg font-semibold text-gray-600">Enter OTP</h2>
            <div className="flex justify-center gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  ref={(el) => {
                    otpRefs.current[index] = el;
                  }}
                  className="w-12 h-12 text-center text-xl font-semibold border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              ))}
            </div>

            <button
              onClick={handleOtpSubmit}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              Verify OTP
            </button>
         
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotOtp;
