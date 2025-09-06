// hooks/useProducts.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchProducts,
  fetchProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/services/product-service";
import { handleError } from "@/lib/handle-error-toast";

export const useProducts = (searchParams = "") => {
  return useQuery({
    queryKey: ["products", searchParams],
    queryFn: () => fetchProducts(searchParams),
  });
};

export const useProduct = (id) => {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => fetchProduct(id),
    enabled: !!id,
  });
};

export const useCreateProduct = (callback) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      callback?.();
    },
    onError: (error) => handleError(error),
  });
};

export const useUpdateProduct = (id, callback) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (product) => updateProduct(id, product),
    onSuccess: (_) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      callback?.();
    },
    onError: (error) => handleError(error),
  });
};

export const useDeleteProduct = (id, callback) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      callback?.();
    },
    onError: (error) => handleError(error),
  });
};
