import { colorApi, ColorQueryParams } from "@/lib/color";
import { useQuery } from "@tanstack/react-query";

export const useColors = (params?: ColorQueryParams) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["colors", params],
    queryFn: () => colorApi.getColors(params),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  return { data, isLoading, isError };
};
