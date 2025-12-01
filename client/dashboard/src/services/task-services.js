import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";

export const fetchTasks = async (searchParams) => {
  const { data } = await http().get(
    `${endpoints.tasks.getAll}?${searchParams}`,
  );
  return data;
};

export const fetchTask = async (id) => {
  const { data } = await http().get(`${endpoints.tasks.getAll}/${id}`);
  return data;
};

export const createTask = async (data) => {
  const response = await http().post(endpoints.tasks.getAll, data, true);
  return response.data;
};

export const updateTask = async (id, data) => {
  return await http().put(`${endpoints.tasks.getAll}/${id}`, data, true);
};

export const deleteTask = async (id) => {
  return await http().delete(`${endpoints.tasks.getAll}/${id}`);
};
