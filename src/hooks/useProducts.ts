import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateProduct, productApi, ProductQueryParams } from "@/lib/products";
import { toast } from "sonner";

export const useProducts = (params?: ProductQueryParams) => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", params],
    queryFn: () => productApi.getProducts(params),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const createProductMutation = useMutation({
    mutationFn: (product: CreateProduct) => productApi.createProduct(product),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product created successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ tsku, product }: { tsku: string; product: CreateProduct }) => {
      return productApi.updateProduct(tsku, product);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product updated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: (productId: string) => productApi.deleteProduct(productId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    data,
    isLoading,
    isError,
    createProduct: createProductMutation.mutate,
    isCreatingProduct: createProductMutation.isPending,
    createProductError: createProductMutation.error,
    updateProduct: updateProductMutation.mutate,
    isUpdatingProduct: updateProductMutation.isPending,
    updateProductError: updateProductMutation.error,
    deleteProduct: deleteProductMutation.mutate,
    isDeletingProduct: deleteProductMutation.isPending,
    deleteProductError: deleteProductMutation.error,
  };
};
