import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  filters?: React.ReactNode;
}

const PageHeader = ({
  title,
  description,
  actionLabel,
  onAction,
  filters,
}: PageHeaderProps) => {
  return (
    <div className="flex flex-col gap-4">
      {/* header  */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl sm:text-2xl font-bold">{title}</h1>
          <p className="text-sm sm:text-base text-gray-500">{description}</p>
        </div>

        {actionLabel && (
          <Button onClick={onAction}>{actionLabel}</Button>
        )}
      </div>

      {/* filters */}
      {filters}
    </div>
  );
};

export default PageHeader; 