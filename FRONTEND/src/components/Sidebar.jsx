import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios.js";
import SidebarSkeleton from "./skeletons/SidebarSkeleton.jsx";
import { Users } from "lucide-react";
import { setSelectedUser, setSidebarUsers } from "../feauters/messageSlice.js";
import { useSelector, useDispatch } from "react-redux";

const Sidebar = () => {
  const dispatch = useDispatch();
  const [usersLoading, setUsersLoading] = useState(true);

  const { sidebarUsers, selectedUser } = useSelector((state) => state.message);
  const { onlineUsers } = useSelector((state) => state.socket);

  const { authUser } = useSelector((state) => state.auth);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get("/users");
        // console.log(res.data.users);
        if (res.data.message === "success") {
          dispatch(setSidebarUsers(res.data.users));
        }
      } catch (error) {
        console.log("Error in loading users", error);
      } finally {
        setUsersLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (usersLoading === true) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
        {/* TODO: Online filter toggle */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              // checked={showOnlineOnly}
              // onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUsers.length - 1 || 0} online)
          </span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {sidebarUsers.map((user) => (
          <button
            key={user._id.toString()}
            onClick={() => {
              dispatch(setSelectedUser(user));
            }}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
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
              {/* <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div> */}
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
