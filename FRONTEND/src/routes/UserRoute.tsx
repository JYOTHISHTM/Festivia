

import { Route, Routes } from "react-router-dom";
import Login from "../pages/user/LoginPage";
import SignUp from "../pages/user/SignUpPage";
import HomePage from "../pages/user/HomePage";
import LandingPage from "../components/layout/user/LandingPage";
import Profile from "../pages/user/ProfilePage";
import VerifyOtp from "../pages/user/verifyotp";
import EventDetails from "../pages/user/EventDetails";
import UserProtectedRoute from "../routes/ProtectedRoute/UserProtectedRoute";
import ResetPassword from '../components/user/ResetPassword'
import ForgotOtp from '../components/user/ForgotOtp'
import OAuthSuccessPage from '../components/user/OAuthSuccessPage'
const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/user/login" element={<Login />} />
      <Route path="/user/sign-up" element={<SignUp />} />
      <Route path="/user/verify-otp" element={<VerifyOtp />} />

      <Route element={<UserProtectedRoute />}>
      <Route path="/user/event/:id" element={<EventDetails />} />
        <Route path="/user/home" element={<HomePage />} />
        <Route path="/user/profile" element={<Profile />} />
      </Route>
      



      <Route path="/oauth-success" element={<OAuthSuccessPage />} />

            <Route path="/user/forgot-password" element={<ForgotOtp />} />
            <Route path="/user/reset-password" element={<ResetPassword />} />






    </Routes>
  );
};

export default UserRoutes;
