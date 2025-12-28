"use client";

import { useEffect, useState } from "react";
import { deleteTask, getTasks } from "@/services/task.services";
import TaskCard from "@/components/TasksCard";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [isTasks, setIsTasks] = useState([]); // ✅ array
  const router = useRouter();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await getTasks();
        setIsTasks(res.data); 
      } catch (err) {
        console.log(err);
      }
    };
    fetchTasks();
  }, []);

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => router.push("/tasks/create")}
          className="btn btn-primary"
        >
          + New Task
        </button>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {isTasks.map(Tasks => (
          <TaskCard key={Tasks.id} Tasks={Tasks} />
        ))}
      </div>
    </div>
    
  );
}
