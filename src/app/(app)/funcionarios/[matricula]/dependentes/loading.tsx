import { DataTableLoading } from "@/components/data-table/data-table-loading";
import { DataTableToolbarLoading } from "@/components/data-table/data-table-toolbar-loading";
import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <PageContainer>
      <PageHeader>
        Dependentes de
        <Skeleton className="size-6" />
      </PageHeader>
      <Separator />
      <div className="w-full space-y-2.5 overflow-auto">
        <DataTableToolbarLoading filtersNumber={1} />
        <DataTableLoading rows={10} columns={5} />
      </div>
    </PageContainer>
  );
}
