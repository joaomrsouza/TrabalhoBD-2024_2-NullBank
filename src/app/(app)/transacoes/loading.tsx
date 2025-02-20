import { DataTableLoading } from "@/components/data-table/data-table-loading";
import { DataTableToolbarLoading } from "@/components/data-table/data-table-toolbar-loading";
import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Separator } from "@/components/ui/separator";

export default function Loading() {
  return (
    <PageContainer>
      <PageHeader>Transações</PageHeader>
      <Separator />
      <div className="w-full space-y-2.5 overflow-auto">
        <DataTableToolbarLoading filtersNumber={2} />
        <DataTableLoading rows={10} columns={10} />
      </div>
    </PageContainer>
  );
}
