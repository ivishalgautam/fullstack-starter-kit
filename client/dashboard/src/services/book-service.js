import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";

export const fetchBooks = async (searchParams) => {
  const { data } = await http().get(
    `${endpoints.books.getAll}?${searchParams}`,
  );
  return data;
};

export const fetchBook = async (id) => {
  const { data } = await http().get(`${endpoints.books.getAll}/${id}`);
  return data;
};

export const createBook = async (data) => {
  const response = await http().post(endpoints.books.getAll, data, true);
  return response.data;
};

export const updateBook = async (id, data) => {
  return await http().put(`${endpoints.books.getAll}/${id}`, data, true);
};

export const deleteBook = async (id) => {
  return await http().delete(`${endpoints.books.getAll}/${id}`);
};
