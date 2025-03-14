import { sizeApi, SizeQueryParams } from "@/lib/size";
import { useQuery } from "@tanstack/react-query";

export const useSizes = (params?: SizeQueryParams) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["sizes", params],
    queryFn: () => sizeApi.getSizes(params),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  return { data, isLoading, isError };
};
