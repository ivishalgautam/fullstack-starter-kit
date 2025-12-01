import { handleError } from "@/lib/handle-error-toast";
import {
  createTask,
  deleteTask,
  fetchTask,
  fetchTasks,
  updateTask,
} from "@/services/task-services";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useTasks = (searchParams = "") => {
  return useQuery({
    queryKey: ["tasks", searchParams],
    queryFn: () => fetchTasks(searchParams),
  });
};
// export const useFormattedTasks = (searchParams = "") => {
//   return useQuery({
//     queryKey: ["tasks", searchParams],
//     queryFn: () => fetchTasks(searchParams),
//     select: ({ categories }) => {
//       return categories?.map((b) => ({
//         value: b.id,
//         label: b.title,
//       }));
//     },
//   });
// };

export const useTask = (id) => {
  return useQuery({
    queryKey: ["tasks", id],
    queryFn: () => fetchTask(id),
    enabled: !!id,
  });
};

export const useCreateTask = (callback) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      callback?.();
    },
    onError: (error) => handleError(error),
  });
};

export const useUpdateTask = (id, callback) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["tasks", id],
    mutationFn: (data) => updateTask(id, data),
    onSuccess: (_) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      callback?.();
    },
    onError: (error) => handleError(error),
  });
};

export const useDeleteTask = (id, callback) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["tasks", id],
    mutationFn: () => deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      callback?.();
    },
    onError: (error) => handleError(error),
  });
};
