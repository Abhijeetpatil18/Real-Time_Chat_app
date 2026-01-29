import { Outlet, Navigate, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth, LoginDone } from "./feauters/authSlice.js";
import axios from "axios";
import { Loader } from "lucide-react";
import { useState } from "react";

function App() {
  const [authChecking, setAuthCkeking] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  useEffect(() => {
    const checkingAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get("http://localhost:5000/api/auth/check", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 200) {
          dispatch(checkAuth(res.data));
        }
      } catch {
        toast.error("Not authenticated");
      } finally {
        setAuthCkeking(false);
      }
    };

    checkingAuth();
  }, [dispatch]);

  // if (!authChecking && !isAuthenticated) {
  //   toast.error("Not authenticated");
  //   navigate("/auth/login");
  // }
  if (authChecking) {
    return <Loader className="h-10 w-8  animate-spin" />;
  }

  return (
    <>
      <Outlet />
      <Toaster />
    </>
  );
}

export default App;
