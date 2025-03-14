import { CustomPagination } from "@/components/mycomponents/CustomPagination";
import SizeDrawer from "@/components/mycomponents/drawers/SizeDrawer";
import { FilterToolbar } from "@/components/mycomponents/FilterToolbar";
import LoaderComponent from "@/components/mycomponents/Loader";
import NoData from "@/components/mycomponents/NoData";
import PageHeader from "@/components/mycomponents/PageHeader";
import SizeCard from "@/components/mycomponents/SizeCard";
import Layout from "@/components/mycomponents/wrappers/Layout";
import { useSizes } from "@/hooks/useSizes";
import { CreateSize, Size } from "@/lib/size";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const Sizes = () => {
  const [searchParams] = useSearchParams();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [sizeToEdit, setSizeToEdit] = useState<CreateSize | null>(null);

  const { data, isLoading, isError } = useSizes({
    page: parseInt(searchParams.get("page") || "1"),
    itemsPerPage: parseInt(searchParams.get("itemsPerPage") || "10"),
    search: searchParams.get("search") || undefined,
    order: searchParams.get("order") || undefined,
  });

  useEffect(() => {
    if (isError) {
      toast.error("Error fetching sizes");
    }
  }, [isError]);

  const handleOpenCreateDrawer = () => {
    setIsDrawerOpen(true);
  };

  const handleOpenEditDrawer = (size: Size) => {
    const sizeToEdit: CreateSize & { size_id: number } = {
      size_id: size.size_id,
      name: size.name,
    };
    setSizeToEdit(sizeToEdit);
    setIsDrawerOpen(true);
  };

  return (
    <Layout>
      {/* Use flex-col and min-h-full to ensure full height */}
      <div className="flex flex-col min-h-full">
        {/* Main content area with padding and auto height */}
        <div className="flex-1 p-2 sm:p-4 overflow-y-auto">
          <div className="flex flex-col gap-4 w-full max-w-[2000px] mx-auto">
            <PageHeader
              title="Colors"
              description="Manage your colors here"
              actionLabel="New Color"
              onAction={handleOpenCreateDrawer}
              filters={<FilterToolbar />}
            />

            {/* Show loading state while data is being fetched */}
            {isLoading ? (
              <LoaderComponent />
            ) : data && data.items && data.items.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4">
                {data.items.map((size: Size) => (
                  <SizeCard key={size.size_id} size={size} handleOpenEditDrawer={handleOpenEditDrawer} />
                ))}
              </div>
            ) : (
              <NoData item="colors" />
            )}
          </div>
        </div>

        {/* Pagination fixed at the bottom */}
        {data && data.pagination && (
          <div className="p-2 sm:p-4 border-t border-gray-200 dark:border-gray-800 bg-background">
            <CustomPagination pagination={data.pagination} />
          </div>
        )}
      </div>

      {/* Product Drawer */}
      {isDrawerOpen && (
        <SizeDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} data={sizeToEdit as (CreateSize & { size_id: number }) | null} />
      )}
    </Layout>
  );
};

export default Sizes;
