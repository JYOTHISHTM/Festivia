// FRONTEND>src/App.tsx
import { BrowserRouter as Router } from "react-router-dom";
import UserRoutes from "./routes/UserRoute"; 
import CreatorRoutes from "./routes/CreatorRoute"; 
import AdminRoutes from "./routes/AdminRoute";
function App() {
  return (
    
    <Router>
      <UserRoutes />
      <CreatorRoutes/>
      <AdminRoutes/>
    </Router>
  );
}

export default App;
