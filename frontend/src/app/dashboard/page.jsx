'use client'
import { useEffect, useState } from "react";
import TaskCard from "@/components/TasksCard";
import { getTasks } from "@/services/task.services";

export default function Dashboard(){    
    const [isTasks, SetTasks] = useState([]);
    useEffect(() =>{
        const fetchTasks = async () => {
            const data = await getTasks();
            console.log(data);
            SetTasks(data)
        }
        fetchTasks();
    }, [])

    return(
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {isTasks.map(task => (
                <TaskCard key={task.id} task={task} />
            ))}
        </div>
    )
}