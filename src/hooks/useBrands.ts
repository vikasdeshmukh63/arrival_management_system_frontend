import { Brand, brandApi, BrandQueryParams, CreateBrand } from "@/lib/brand";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useBrands = (params?: BrandQueryParams) => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["brands", params],
    queryFn: () => brandApi.getBrands(params),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const createBrandMutation = useMutation({
    mutationFn: (brand: CreateBrand) => brandApi.createBrand(brand),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["brands"] });
      toast.success("Brand created successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateBrandMutation = useMutation({
    mutationFn: ({ brand_id, brand }: { brand_id: number; brand: CreateBrand }) => brandApi.updateBrand(brand_id, brand),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["brands"] });
      toast.success("Brand updated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteBrandMutation = useMutation({
    mutationFn: (brand_id: number) => brandApi.deleteBrand(brand_id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["brands"] });
      toast.success("Brand deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    data,
    isLoading,
    isError,
    createBrand: createBrandMutation.mutate,
    isCreatingBrand: createBrandMutation.isPending,
    createBrandError: createBrandMutation.error,
    updateBrand: updateBrandMutation.mutate,
    isUpdatingBrand: updateBrandMutation.isPending,
    updateBrandError: updateBrandMutation.error,
    deleteBrand: deleteBrandMutation.mutate,
    isDeletingBrand: deleteBrandMutation.isPending,
    deleteBrandError: deleteBrandMutation.error,
  };
};
