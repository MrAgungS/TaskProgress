"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getTaskById, updateTask } from "@/services/task.services";

export default function EditTask() {
  const { id } = useParams();
  const router = useRouter();
  const taskId = Number(id);


  console.log("TASK ID:", id);
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "",
  });

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await getTaskById(id);
        // console.log("PARAM FROM useParams:", id);
        setForm(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchTask();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // console.log("PUT URL:", `/tasks/${id}`);

    try {
      await updateTask(Number(id), form);
      router.push("/dashboard");
    } catch (err) {
      console.log(err);
    }
  };


  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-xl font-semibold">Edit Task</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          className="input input-bordered w-full"
          value={form.title}
          onChange={handleChange}
        />

        <textarea
          name="description"
          className="textarea textarea-bordered w-full"
          value={form.description}
          onChange={handleChange}
        />

        <select
          name="status"
          className="select select-bordered w-full"
          value={form.status}
          onChange={handleChange}
        >
          <option value="todo">Todo</option>
          <option value="progress">Progress</option>
          <option value="done">Done</option>
        </select>

        <button className="btn btn-primary w-full">
          Update
        </button>
      </form>
    </div>
  );
}
