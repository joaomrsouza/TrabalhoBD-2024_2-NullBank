"use client";

import { DataTable } from "@/components/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { Button } from "@/components/ui/button";
import { useDataTable } from "@/hooks";
import { type DataTableFilterField } from "@/hooks/use-data-table";
import { type Agencia } from "@/server/database/queries/agencias";
import { formatCurrency } from "@/server/utils/formaters";
import { type ColumnDef } from "@tanstack/react-table";
import { TextSearchIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

type TableData = Agencia;

interface AgenciaTableProps {
  data: TableData[];
  pageCount: number;
}

export function AgenciaTable(props: AgenciaTableProps) {
  const { data, pageCount } = props;

  const columns = React.useMemo(() => getColumns(), []);
  const filters = React.useMemo(() => getFilters(), []);

  const { table } = useDataTable({
    columns,
    data,
    defaultPerPage: 10,
    defaultSort: "num_ag.asc",
    filterFields: filters,
    pageCount,
  });

  return (
    <div className="w-full space-y-2.5 overflow-auto">
      <DataTableToolbar table={table} filterFields={filters} />
      <DataTable table={table} />
    </div>
  );
}

function getColumns(): ColumnDef<TableData>[] {
  return [
    {
      cell: ({ row }) => (
        <Button
          asChild
          // size="icon"
          size="sm"
          title="Visualizar registro"
          aria-label="Visualizar registro"
        >
          <Link href={`./agencias/${row.original.num_ag}`}>
            <TextSearchIcon className="mr-2 size-4" />
            Visualizar
          </Link>
        </Button>
      ),
      enableHiding: false,
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader title="" column={column} />
      ),
      id: "access",
    },
    {
      accessorKey: "num_ag",
      enableHiding: false,
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader title="Número" column={column} />
      ),
    },
    {
      accessorKey: "nome_ag",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader title="Nome" column={column} />
      ),
    },
    {
      accessorKey: "cidade_ag",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader title="Cidade" column={column} />
      ),
    },
    {
      accessorKey: "sal_total",
      cell: ({ cell }) => formatCurrency(cell.getValue<number>()),
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Sal. Total" />
      ),
    },
  ];
}

function getFilters(): DataTableFilterField<TableData>[] {
  return [
    {
      label: "Nome",
      placeholder: "Filtrar nome...",
      type: "text",
      value: "nome_ag",
    },
    {
      label: "Cidade",
      placeholder: "Filtrar cidade...",
      type: "text",
      value: "cidade_ag",
    },
  ];
}
