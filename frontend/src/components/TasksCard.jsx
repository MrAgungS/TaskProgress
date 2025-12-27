import { formatDate } from "@/lib/formatDate";
import { Edit2Icon, TrashIcon } from "lucide-react";

export default function TaskCard({ Tasks }) {
  const handleEdit = () => {
    toast.success("Edit task clicked ✏️");
  };

  const handleDelete = () => {
    toast.error("Task deleted 🗑️");
  };
  return (
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
            {Tasks.status}
          </span>
        </div>

        {/* Meta Info */}
        <div className="flex justify-between text-sm text-base-content/70">
          <span>
            📅 {formatDate(Tasks.createdAt)}
          </span>

          <span className="badge badge-outline">
            Priority: {Tasks.priority}
          </span>
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
            onClick={handleDelete}
            className="btn btn-sm btn-outline btn-error gap-1"
          >
            <TrashIcon className="size-4" />
            Delete
          </button>
        </div>

      </div>
    </div>
  );
}