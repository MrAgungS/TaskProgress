import api from "@/lib/axiosIstance";

export const getTasks = async(payload) =>{
    const res = await api.get("task/", payload);
    return res.data
}
export const createTask = async(payload) =>{
    const res = await api.post("task/", payload);
    return res.data
}
export const getTaskById = async(payload) =>{
    const res = await api.get("task/:id", payload);
    return res.data
}
export const updateTask = async(payload) =>{
    const res = await api.put("task/:id", payload);
    return res.data
}
export const deleteTask = async(payload) =>{
    const res = await api.delete("task/:id", payload);
    return res.data
}