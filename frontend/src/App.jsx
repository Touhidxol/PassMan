import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./context/ProtectedRoute";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";// import Login from "./pages/Login";
import DashboardLayout from "./layouts/DashboardLayout";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Passwords from "./pages/Passwords"
import Stats from "./pages/Stats";
import Favorites from "./pages/Favorites";
import Settings from "./pages/Settings";
// import Navbar from "./components/Navbar";



function App() {
  return (
    <>
      <Toaster position="top-center" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<Passwords />} />
            <Route path="passwords" element={<Passwords />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="stats" element={<Stats />} />
            <Route path="settings" element={<Settings />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;