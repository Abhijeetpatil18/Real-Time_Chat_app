import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Plus, Users } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstance } from "../lib/axios.js";
import { setChatView } from "../feauters/messageSlice.js";
import toast from "react-hot-toast";
import AddMemberModal from "./AddMemberModal.jsx";
import { addGroupMemberRequest } from "../lib/groupApi.js";

const GroupInfoPanel = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((state) => state.message);
  const { authUser } = useSelector((state) => state.auth);
  const [groupDetails, setGroupDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [addingMembers, setAddingMembers] = useState(false);
  const [allUsers, setAllUsers] = useState([]);

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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get("/users");
        setAllUsers(res?.data?.users || []);
      } catch (error) {
        console.log("Error fetching users for member picker", error);
        setAllUsers([]);
      }
    };

    fetchUsers();
  }, []);

  const members = groupDetails?.members || [];
  const group = groupDetails?.group || selectedUser;
  const memberIds = useMemo(
    () => new Set(members.map((member) => member._id)),
    [members],
  );

  const eligibleUsers = allUsers.filter((user) => {
    const userId = user._id || user.id;
    return userId !== authUser?.id && !memberIds.has(userId);
  });

  const openAddMemberModal = () => {
    setSelectedMembers([]);
    setIsAddMemberModalOpen(true);
  };

  const toggleMember = (memberId) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId],
    );
  };

  const handleAddMembers = async () => {
    if (!selectedUser?._id || selectedMembers.length === 0) return;

    setAddingMembers(true);

    try {
      for (const memberId of selectedMembers) {
        await addGroupMemberRequest(selectedUser._id, memberId);
      }

      toast.success("Members added successfully");
      setIsAddMemberModalOpen(false);
      setSelectedMembers([]);

      const res = await axiosInstance.get(`/groups/${selectedUser._id}`);
      setGroupDetails(res.data);
    } catch (error) {
      console.log("Error adding members", error);
      toast.error(error?.response?.data?.message || "Failed to add members");
    } finally {
      setAddingMembers(false);
    }
  };

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
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold">Members</h3>
                <p className="text-sm text-zinc-500">
                  {loading ? "Loading members..." : `${members.length} members`}
                </p>
              </div>

              <button
                type="button"
                onClick={openAddMemberModal}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-content transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                disabled={loading}
              >
                <Plus size={16} />
                Add members
              </button>
            </div>
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

        <AddMemberModal
          isOpen={isAddMemberModalOpen}
          onClose={() => setIsAddMemberModalOpen(false)}
          users={eligibleUsers}
          selectedMembers={selectedMembers}
          onToggleMember={toggleMember}
          onConfirm={handleAddMembers}
          isSubmitting={addingMembers}
        />
      </div>
    </div>
  );
};

export default GroupInfoPanel;
