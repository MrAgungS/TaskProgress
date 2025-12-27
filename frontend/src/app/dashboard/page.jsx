"use client";

import { useEffect, useState } from "react";
import { getTasks } from "@/services/task.services";
import TaskCard from "@/components/TasksCard";

export default function Dashboard() {
  const [isTasks, setIsTasks] = useState([]); // ✅ array

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await getTasks();
        setIsTasks(res.data); // 🔥 AMBIL ARRAY-NYA
      } catch (err) {
        console.log(err);
      }
    };
    fetchTasks();
  }, []);

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      {isTasks.map(Tasks => (
        <TaskCard key={Tasks.id} Tasks={Tasks} />
      ))}
    </div>
  );
}
