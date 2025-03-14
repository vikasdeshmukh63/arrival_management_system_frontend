import { useProducts } from "@/hooks/useProducts";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useBrands } from "@/hooks/useBrands";

const DeleteModal = ({ open, setOpen, type, id }: { open: boolean; setOpen: (open: boolean) => void; type: string; id: string | number }) => {
  const [error, setError] = useState<Error | null>(null);

  const { deleteProduct, deleteProductError } = useProducts();
  const { deleteBrand, deleteBrandError } = useBrands();

  const handleDelete = () => {
    switch (type) {
      case "product":
        deleteProduct(id as string);
        setError(deleteProductError as Error);
        break;
      case "brand":
        deleteBrand(id as number);
        setError(deleteBrandError);
        break;
      case "category":
        break;
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete this {type}?</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;
