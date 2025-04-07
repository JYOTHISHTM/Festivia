// src/routes/userRoute.tsx
import { Route, Routes } from "react-router-dom";
import Login from "../pages/creator/LoginPage";
import SignUp from "../pages/creator/SignUpPage";
import DashBoard from "../pages/creator/DashBoard";
import VerifyOtp from '../pages/creator/VerifyOtp';
import CreatorProfile from '../pages/creator/CreatorProfile';
import CreateAndManageEvents from "../components/creator/CreateAndManageEvents";
import CreateEventform from "../components/creator/CreateEventForm";
import EventProfile from "../components/creator/EventProfile";
import EventDetails from "../components/creator/EventDetails";
import Events from "../components/creator/Events";
import CreatorProtectedRoute from "./ProtectedRoute/CreatorProtectedRoute";

import ResetPassword from '../components/creator/ResetPassword'
import ForgotOtp from '../components/creator/ForgotPassword'
const CreatorRoutes = () => {
  return (
    <Routes>


      <Route element={<CreatorProtectedRoute />}>

        <Route path="/creator/dashboard" element={<DashBoard />} />
        <Route path="/creator/profile" element={<CreatorProfile />} />

      </Route>


      <Route path="/creator/login" element={<Login />} />
      <Route path="/creator/sign-up" element={<SignUp />} />
      <Route path="/creator/verify-otp" element={<VerifyOtp />} />
      <Route path="/creator/create-and-manageEvents" element={<CreateAndManageEvents />} />
      <Route path="/creator/event-profile" element={<EventProfile />} />
      <Route path="/creator/create-event" element={<CreateEventform />} />
      <Route path="/creator/event/:id" element={<EventDetails />} />
      <Route path="/creator/events" element={<Events />} />


      
      <Route path="/creator/forgot-password" element={<ForgotOtp />} />
            <Route path="/creator/reset-password" element={<ResetPassword />} />


    </Routes>
  );
};

export default CreatorRoutes;

