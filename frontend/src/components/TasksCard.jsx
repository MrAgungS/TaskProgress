"use client";

import { formatDate } from "@/lib/formatDate";
import { Edit2Icon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteTask } from "@/services/task.services";
import toast from "react-hot-toast";

export default function TaskCard({ Tasks, onDelete }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!Tasks) return null; // 🔥 safety guard

  const handleEdit = () => {
    router.push(`/tasks/${Tasks.id}/edit`);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteTask(Tasks.id);
      toast.success("Task deleted 🗑️");
      onDelete?.(Tasks.id);
      setOpen(false);
      return;
    } catch (err) {
      toast.error("Failed to delete task ❌");
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      {/* CARD */}
      <div className="card bg-base-100 shadow-md hover:shadow-xl transition-all border border-base-200">
        <div className="card-body p-4 space-y-3">

          {/* Title + Status */}
          <div className="flex justify-between items-start">
            <h2 className="card-title text-lg">
              {Tasks.title}
            </h2>

            <span
              className={`badge ${
                Tasks.status === "done"
                  ? "badge-success"
                  : Tasks.status === "progress"
                  ? "badge-warning"
                  : "badge-ghost"
              }`}
            >
              {Tasks.status || "todo"}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-base-content/70 line-clamp-2">
            {Tasks.description || "No description provided"}
          </p>

          {/* Meta Info */}
          <div className="flex justify-between text-sm text-base-content/70">
            <span>📅 {formatDate(Tasks.createdAt)}</span>

            {Tasks.priority && (
              <span className="badge badge-outline">
                Priority: {Tasks.priority}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="card-actions justify-end">
            <button
              onClick={handleEdit}
              className="btn btn-sm btn-outline btn-info gap-1"
            >
              <Edit2Icon className="size-4" />
              Edit
            </button>

            <button
              onClick={() => setOpen(true)}
              className="btn btn-sm btn-outline btn-error gap-1"
            >
              <TrashIcon className="size-4" />
              Delete
            </button>
          </div>

        </div>
      </div>

      {/* DELETE MODAL */}
      {open && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Delete Task</h3>
            <p className="py-4">
              Are you sure you want to delete
              <span className="font-semibold"> {Tasks.title}</span>?
            </p>

            <div className="modal-action">
              <button
                className="btn"
                onClick={() => onDelete(Tasks.id)}
              >
                Cancel
              </button>

              <button
                className={`btn btn-error ${loading ? "loading" : ""}`}
                onClick={handleDelete}
                disabled={loading}
              >
                Delete
              </button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}
