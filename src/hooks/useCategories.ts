import { categoryApi, CategoryQueryParams } from "@/lib/category";
import { useQuery } from "@tanstack/react-query";

export const useCategories = (params?: CategoryQueryParams) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["categories", params],
    queryFn: () => categoryApi.getCategories(params),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  return { data, isLoading, isError };
};
