import { useEffect, useState } from "react";
import { ArrowLeft, Users } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstance } from "../lib/axios.js";
import { setChatView } from "../feauters/messageSlice.js";

const GroupInfoPanel = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((state) => state.message);
  const [groupDetails, setGroupDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      if (!selectedUser?._id) return;

      setLoading(true);

      try {
        const res = await axiosInstance.get(`/groups/${selectedUser._id}`);
        setGroupDetails(res.data);
      } catch (error) {
        console.log("Error fetching group details", error);
        setGroupDetails(null);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupDetails();
  }, [selectedUser?._id]);

  const members = groupDetails?.members || [];
  const group = groupDetails?.group || selectedUser;

  return (
    <div className="flex-1 overflow-y-auto bg-base-100">
      <div className="border-b border-base-300 p-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => dispatch(setChatView("chat"))}
            className="btn btn-circle btn-ghost btn-sm"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Group Details
            </p>
            <h2 className="text-lg font-semibold">{group?.name || "Group"}</h2>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="rounded-2xl border border-base-300 bg-base-200 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15 text-primary">
              <Users size={28} />
            </div>
            <div>
              <h3 className="text-xl font-semibold">{group?.name}</h3>
              <p className="text-sm text-zinc-500">
                {group?.description?.trim() || "No description added yet."}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-base-300 bg-base-100">
          <div className="border-b border-base-300 px-6 py-4">
            <h3 className="text-lg font-semibold">Members</h3>
            <p className="text-sm text-zinc-500">
              {loading ? "Loading members..." : `${members.length} members`}
            </p>
          </div>

          <div className="divide-y divide-base-300">
            {!loading && members.length === 0 && (
              <div className="px-6 py-8 text-sm text-zinc-500">
                No members found for this group.
              </div>
            )}

            {members.map((member) => (
              <div
                key={member._id}
                className="flex items-center gap-4 px-6 py-4"
              >
                <img
                  src={member.profilePic || "/profile.jpg"}
                  alt={member.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{member.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupInfoPanel;
