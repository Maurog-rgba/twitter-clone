import { Navigate, Route, Routes } from "react-router-dom";

import RightPanel from "./components/common/RightPanel";
import SideBar from "./components/common/Sidebar";

import { useQuery } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import LoadingSpinner from "./components/common/LoadingSpinner";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import HomePage from "./pages/home/HomePage";
import Notification from "./pages/notification/NotificationPage";
import Profile from "./pages/profile/ProfilePage";

function App() {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();

        if (data.error) return null;

        if (!res.ok) {
          throw new Error(data.error);
        }
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex max-w-6xl mx-auto">
      {authUser && <SideBar />}
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/login" element={authUser ? <Navigate to="/" /> : <LoginPage />} />
        <Route path="/signup" element={authUser ? <Navigate to="/" /> : <SignUpPage />} />
        <Route
          path="/notifications"
          element={authUser ? <Notification /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile/:username"
          element={authUser ? <Profile /> : <Navigate to="/login" />}
        />
      </Routes>
      {authUser && <RightPanel />}
      <Toaster />
    </div>
  );
}

export default App;
