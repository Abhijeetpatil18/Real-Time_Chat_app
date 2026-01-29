import { useState } from "react";
import { Camera, Mail, User } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Link } from "react-router-dom";
import { updateProfileImage } from "../feauters/authSlice";
import { axiosInstance } from "../lib/axios";

const ProfilePage = () => {
  const { authUser, isAuthenticated } = useSelector((state) => state.auth);
  console.log("profile image", authUser);
  const dispatch = useDispatch();

  const handleImageUpload = async (e) => {
    const profilePic = e.target.files[0];
    if (!profilePic) return;
    updateProfile(profilePic);

    const reader = new FileReader();

    reader.readAsDataURL(profilePic);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      // dispath(updateProfileImage(base64Image));
    };
  };
  const updateProfile = async (profilePic) => {
    try {
      const formData = new FormData();
      formData.append("profilePic", profilePic);
      const res = await axiosInstance.post("/auth/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // console.log(res.data.updatedProfile);
      dispatch(updateProfileImage(res.data.updatedProfile));
    } catch (error) {
      console.error("Unable to update image", error);
    }
  };

  // If not authenticated but token exists, show loading while checking
  if (!isAuthenticated && localStorage.getItem("token")) {
    console.log("Token exists, waiting for auth check", isAuthenticated);
    return (
      <div className="h-screen flex items-center justify-center">
        Verifying authentication...
      </div>
    );
  }

  // not logged in → kick out
  if (!isAuthenticated) {
    console.log("not allowed, redirecting to login");
    return <Navigate to="/auth/login" />;
  }

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <Link to="/" className="link link-danger">
          Back to chat
        </Link>
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* avatar upload section */}

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={authUser.profilePic || "profile.jpg"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  // disabled={isUpdatingProfile}
                />
              </label>
            </div>
            {/* <p className="text-sm text-zinc-400">
              {
                ? "Uploading..."
                : "Click the camera icon to update your photo"}
            </p> */}
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser.name}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser.email}
              </p>
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
