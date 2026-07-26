import { Outlet, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { checkAuth } from "./feauters/authSlice.js";
import { Loader } from "lucide-react";
import { useState } from "react";
import { axiosInstance } from "./lib/axios.js";

function App() {
  const [authChecking, setAuthCkeking] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    setAuthCkeking(true);
    const checkingAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axiosInstance.get("/auth/check");
        if (res.status === 200) {
          dispatch(checkAuth(res.data));
          navigate("/app");
        }
      } catch {
        toast.error("Login first");
        setAuthCkeking(false);
        navigate("/auth/login");
      } finally {
        setAuthCkeking(false);
      }
    };

    checkingAuth();
  }, [dispatch, navigate]);

  if (authChecking == true) {
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
