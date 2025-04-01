
import { Route, Routes } from "react-router-dom";
import Login from "../pages/admin/LoginPage";
import DashBoard from "../pages/admin/DashBoard";
import EventManagement from "../pages/admin/EventManagement";
import CreatorManagement from "../pages/admin/CreatorManagement";
import UsersManagement from "../components/admin/UsersManagement";
import AdminProtectedRoute from "../routes/ProtectedRoute/AdminProtectedRoute";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin/login" element={<Login />} />
      <Route element={<AdminProtectedRoute />}>
        <Route path="/admin/dashboard" element={<DashBoard />} />
        <Route path="/admin/eventmanagement" element={<EventManagement />} />
        <Route path="/admin/creatormanagement" element={<CreatorManagement />} />
        <Route path="/admin/usersmanagement" element={<UsersManagement />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
