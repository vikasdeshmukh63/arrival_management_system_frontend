import { styleApi, StyleQueryParams } from "@/lib/style";
import { useQuery } from "@tanstack/react-query";

export const useStyles = (params?: StyleQueryParams) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["styles", params],
    queryFn: () => styleApi.getStyles(params),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  return { data, isLoading, isError };
};
