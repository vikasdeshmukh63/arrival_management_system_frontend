import { brandApi, BrandQueryParams } from "@/lib/brand";
import { useQuery } from "@tanstack/react-query";

export const useBrands = (params?: BrandQueryParams) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["brands", params],
    queryFn: () => brandApi.getBrands(params),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  return { data, isLoading, isError };
};