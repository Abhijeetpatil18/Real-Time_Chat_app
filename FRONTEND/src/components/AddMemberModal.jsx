import React from "react";
import { X } from "lucide-react";

function AddMemberModal({
  isOpen,
  onClose,
  users = [],
  selectedMembers = [],
  onToggleMember,
  onConfirm,
  isSubmitting = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-xl border border-base-300 bg-base-100 p-4 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Add members</h3>
            <p className="text-sm text-base-content/70">
              Select users who are not already in this group.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-sm btn-circle"
            onClick={onClose}
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
          {users.length === 0 ? (
            <div className="rounded-lg border border-dashed border-base-300 p-3 text-sm text-base-content/70">
              No eligible users available to add.
            </div>
          ) : (
            users.map((user) => {
              const userId = user._id || user.id;
              const isSelected = selectedMembers.includes(userId);

              return (
                <label
                  key={userId}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-base-300 px-3 py-2 transition hover:bg-base-200"
                >
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={isSelected}
                    onChange={() => onToggleMember(userId)}
                  />
                  <div>
                    <div className="font-medium">
                      {user.name || user.username || "User"}
                    </div>
                  </div>
                </label>
              );
            })
          )}
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onConfirm}
            disabled={selectedMembers.length === 0 || isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add members"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddMemberModal;
