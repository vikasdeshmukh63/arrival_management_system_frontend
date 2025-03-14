import { countApi } from "@/lib/counts";
import { useQuery } from "@tanstack/react-query";

export const useCounts = () => {

  const { data: arrivalCounts, isLoading: isLoadingArrivalCounts } = useQuery({
    queryKey: ["arrival-counts"],
    queryFn: countApi.getArrivalCounts,
  });

  const { data: entitiesCount, isLoading: isLoadingEntitiesCount } = useQuery({
    queryKey: ["entities-count"],
    queryFn: countApi.getEntitesCount,
  });

  return { arrivalCounts, entitiesCount, isLoading: isLoadingArrivalCounts || isLoadingEntitiesCount };
};
