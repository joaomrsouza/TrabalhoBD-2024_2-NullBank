import { Skeleton } from "../ui/skeleton";

interface DataTableToolbarLoadingProps {
  filtersNumber: number;
}

export function DataTableToolbarLoading(props: DataTableToolbarLoadingProps) {
  const { filtersNumber } = props;

  return (
    <div className="flex w-full items-center justify-between space-x-2 overflow-auto p-1">
      <div className="flex flex-1 items-center space-x-2">
        {Array.from({ length: filtersNumber }).map((_, i) => (
          <Skeleton key={String(i)} className="h-8 w-40 lg:w-64" />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-32" />
      </div>
    </div>
  );
}
