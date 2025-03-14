import { CreateStyle, styleApi, StyleQueryParams } from "@/lib/style";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useStyles = (params?: StyleQueryParams) => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["styles", params],
    queryFn: () => styleApi.getStyles(params),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const createStyleMutation = useMutation({
    mutationFn: (style: CreateStyle) => styleApi.createStyle(style),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["styles"] });
      toast.success("Style created successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateStyleMutation = useMutation({
    mutationFn: ({ style_id, style }: { style_id: number; style: CreateStyle }) => styleApi.updateStyle(style_id, style),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["styles"] });
      toast.success("Style updated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteStyleMutation = useMutation({
    mutationFn: (style_id: number) => styleApi.deleteStyle(style_id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["styles"] });
      toast.success("Style deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return {
    data,
    isLoading,
    isError,
    createStyle: createStyleMutation.mutate,
    isCreatingStyle: createStyleMutation.isPending,
    createStyleError: createStyleMutation.error,
    updateStyle: updateStyleMutation.mutate,
    isUpdatingStyle: updateStyleMutation.isPending,
    updateStyleError: updateStyleMutation.error,
    deleteStyle: deleteStyleMutation.mutate,
    isDeletingStyle: deleteStyleMutation.isPending,
    deleteStyleError: deleteStyleMutation.error,
  };
};
