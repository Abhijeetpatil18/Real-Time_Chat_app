import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { createGroupRequest } from "../lib/groupApi.js";
import SidebarSkeleton from "./skeletons/SidebarSkeleton.jsx";
import { Users } from "lucide-react";
import { setSelectedUser, setSidebarUsers } from "../feauters/messageSlice.js";
import { useSelector, useDispatch } from "react-redux";

const Sidebar = () => {
  const dispatch = useDispatch();
  const [usersLoading, setUsersLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("users");
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  const { sidebarUsers, selectedUser } = useSelector((state) => state.message);
  const { onlineUsers } = useSelector((state) => state.socket);

  const [totalusers, setShowOnlineUsers] = useState(sidebarUsers);
  useEffect(() => {
    fetchSidebarData("users");
  }, []);

  useEffect(() => {
    if (activeSection !== "users") {
      setShowOnlineUsers(sidebarUsers);
      return;
    }

    setShowOnlineUsers(
      showOnlineOnly
        ? sidebarUsers.filter((user) => onlineUsers.includes(user._id))
        : sidebarUsers,
    );
  }, [activeSection, onlineUsers, showOnlineOnly, sidebarUsers]);

  const fetchSidebarData = async (type = "users") => {
    setUsersLoading(true);
    setActiveSection(type);

    try {
      const endpoint = type === "users" ? "/users" : "/groups";

      const res = await axiosInstance.get(endpoint);

      if (res.data.message === "success") {
        const data = type === "users" ? res.data.users : res.data.groups;
        console.log(data);

        dispatch(setSidebarUsers(data));
        setShowOnlineUsers(data);
      }
    } catch (error) {
      console.log(`Error loading ${type}`, error);
    } finally {
      setUsersLoading(false);
    }
  };

  if (usersLoading === true) return <SidebarSkeleton />;

  const handleCreateGroup = async () => {
    const groupName = window.prompt("Enter group name");

    if (!groupName) return;

    const trimmedGroupName = groupName.trim();

    if (!trimmedGroupName) {
      toast.error("Group name is required");
      return;
    }

    setIsCreatingGroup(true);

    try {
      await createGroupRequest({ name: trimmedGroupName });
      toast.success("Group created successfully");
      await fetchSidebarData("groups");
    } catch (error) {
      console.log("Error creating group", error);
      toast.error(error?.response?.data?.message || "Failed to create group");
    } finally {
      setIsCreatingGroup(false);
    }
  };

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2 lg:flex-wrap lg:justify-between">
          <div className="flex items-center gap-2">
            <Users className="size-6" />
            <span
              className="font-medium hidden lg:block cursor-pointer"
              onClick={() => fetchSidebarData("users")}
            >
              Contacts
            </span>
            <Users className="size-6" />
            <span
              className="font-medium hidden lg:block cursor-pointer"
              onClick={() => fetchSidebarData("groups")}
            >
              Groups
            </span>
          </div>

          {activeSection === "groups" && (
            <button
              type="button"
              onClick={handleCreateGroup}
              disabled={isCreatingGroup}
              className="hidden lg:inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-content transition-opacity disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isCreatingGroup ? "Creating..." : "Create Group"}
            </button>
          )}
        </div>
        <div className="mt-3 flex items-center gap-2 lg:hidden">
          <button
            type="button"
            className="text-sm font-medium"
            onClick={() => fetchSidebarData("users")}
          >
            Contacts
          </button>
          <button
            type="button"
            className="text-sm font-medium"
            onClick={() => fetchSidebarData("groups")}
          >
            Groups
          </button>
          {activeSection === "groups" && (
            <button
              type="button"
              onClick={handleCreateGroup}
              disabled={isCreatingGroup}
              className="ml-auto rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-primary-content transition-opacity disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isCreatingGroup ? "Creating..." : "Create"}
            </button>
          )}
        </div>
        {activeSection === "users" && (
          <div className="mt-3 hidden lg:flex items-center gap-2">
            <label className="cursor-pointer flex items-center gap-2">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(event) => setShowOnlineOnly(event.target.checked)}
                className="checkbox checkbox-sm"
              />
              <span className="text-sm">Show online only</span>
            </label>
            <span className="text-xs text-zinc-500">
              ({Math.max(onlineUsers.length - 1, 0)} online)
            </span>
          </div>
        )}
      </div>

      <div className="overflow-y-auto w-full py-3">
        {totalusers.map((user) => (
          <button
            key={user._id}
            onClick={() => {
              dispatch(setSelectedUser(user));
            }}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0 ">
              <img
                src={user.profilePic || "/profile.jpg"}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.name}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}
        {/* {sidebarUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )} */}
      </div>
    </aside>
  );
};
export default Sidebar;
