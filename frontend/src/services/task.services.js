import api from "@/lib/axiosIstance";

export const getTasks = async() =>{
    const res = await api.get("/tasks");
    return res.data
}
export const createTask = async() =>{
    const res = await api.post("/tasks");
    return res.data
}
export const getTaskById = async() =>{
    const res = await api.get("/tasks/:id" );
    return res.data
}
export const updateTask = async() =>{
    const res = await api.put("/tasks/:id");
    return res.data
}
export const deleteTask = async() =>{
    const res = await api.delete("/tasks/:id");
    return res.data
}