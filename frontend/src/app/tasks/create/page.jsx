"use client";

import { useRouter } from "next/navigation";
import { createTask } from "@/services/task.services";
import { useState } from "react";
import toast from "react-hot-toast";

export default function CreateTaskPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "low",
    status: "todo",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createTask(form);
      toast.success("Task created successfully 🚀");
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create task ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="card w-full max-w-md bg-base-100 shadow-xl"
      >
        <div className="card-body space-y-4">
          <h2 className="card-title justify-center">
            Create New Task
          </h2>

          {/* Title */}
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Task title"
            required
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />

          {/* Description */}
          <textarea
            className="textarea textarea-bordered w-full"
            placeholder="Task description"
            rows={3}
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          {/* Priority */}
          <select
            className="select select-bordered w-full"
            value={form.priority}
            onChange={(e) =>
              setForm({ ...form, priority: e.target.value })
            }
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>

          {/* Status */}
          <select
            className="select select-bordered w-full"
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value })
            }
          >
            <option value="todo">To Do</option>
            <option value="progress">In Progress</option>
            <option value="done">Done</option>
          </select>

          {/* Action */}
          <div className="card-actions justify-end pt-2">
            <button
              type="submit"
              className={`btn btn-primary w-full ${
                loading ? "loading" : ""
              }`}
              disabled={loading}
            >
              Create Task
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
