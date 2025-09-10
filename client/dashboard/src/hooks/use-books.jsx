import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createBook,
  deleteBook,
  fetchBook,
  fetchBooks,
  updateBook,
} from "@/services/book-service";

export const useBooks = (searchParams = "") => {
  return useQuery({
    queryKey: ["books", searchParams],
    queryFn: () => fetchBooks(searchParams),
  });
};
export const useFormattedBooks = (searchParams = "") => {
  return useQuery({
    queryKey: ["books", searchParams],
    queryFn: () => fetchBooks(searchParams),
    select: ({ books }) => {
      return books?.map((b) => ({
        value: b.id,
        label: b.title,
      }));
    },
  });
};

export const useBook = (id) => {
  return useQuery({
    queryKey: ["books", id],
    queryFn: () => fetchBook(id),
    enabled: !!id,
  });
};

export const useCreateBook = (callback) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      callback?.();
    },
  });
};

export const useUpdateBook = (id, callback) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["books", id],
    mutationFn: (data) => updateBook(id, data),
    onSuccess: (_) => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      callback?.();
    },
  });
};

export const useDeleteBook = (id, callback) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["books", id],
    mutationFn: () => deleteBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      callback?.();
    },
  });
};
