import { Skeleton } from "../ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

interface DataTableLoadingProps {
  columns: number;
  rows: number;
}

export function DataTableLoading(props: DataTableLoadingProps) {
  const { columns, rows } = props;

  return (
    <div className="w-full space-y-2.5 overflow-auto">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: columns }).map((_, i) => (
                <TableHead key={String(i)}>
                  <Skeleton className="h-6 w-full" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rows }).map((_, i) => (
              <TableRow key={String(i)}>
                {Array.from({ length: columns }).map((_, ind) => (
                  <TableCell key={String(ind) + String(i)}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-2.5">
        <div className="flex w-full flex-col-reverse items-center justify-between gap-4 overflow-auto p-1 sm:flex-row sm:gap-8">
          <div className="flex-1 whitespace-nowrap text-sm text-muted-foreground">
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
            <div className="flex items-center space-x-2">
              <div className="whitespace-nowrap text-sm font-medium">
                <Skeleton className="h-8 w-32" />
              </div>
              <Skeleton className="h-8 w-20" />
              <div className="flex items-center justify-center text-sm font-medium">
                <Skeleton className="h-8 w-24" />
              </div>

              <div className="flex items-center space-x-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
