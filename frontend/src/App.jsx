import { Route, Routes } from "react-router-dom";

import RightPanel from "./components/common/RightPanel";
import SideBar from "./components/common/Sidebar";

import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import HomePage from "./pages/home/HomePage";
import Notification from "./pages/notification/NotificationPage";
import Profile from "./pages/profile/ProfilePage";

function App() {
  return (
    <div className="flex max-w-6xl mx-auto">
      <SideBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/notifications" element={<Notification />} />
        <Route path="/profile/:username" element={<Profile />} />
      </Routes>
      <RightPanel />
    </div>
  );
}

export default App;
