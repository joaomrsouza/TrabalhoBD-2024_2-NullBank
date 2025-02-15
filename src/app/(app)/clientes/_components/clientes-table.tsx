"use client";

import { DataTable } from "@/components/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { Button } from "@/components/ui/button";
import { useDataTable } from "@/hooks";
import { type DataTableFilterField } from "@/hooks/use-data-table";
import { type Cliente } from "@/server/database/queries/clientes";
import { formatCurrency, formatData } from "@/server/utils/formaters";
import { type ColumnDef } from "@tanstack/react-table";
import { TextSearchIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

type TableData = Cliente;

interface ClienteTableProps {
  data: TableData[];
  pageCount: number;
}

export function ClienteTable(props: ClienteTableProps) {
  const { data, pageCount } = props;

  const columns = React.useMemo(() => getColumns(), []);
  const filters = React.useMemo(() => getFilters(), []);

  const { table } = useDataTable({
    columns,
    data,
    defaultPerPage: 10,
    defaultSort: "nome.asc",
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
          size="sm"
          title="Visualizar registro"
          aria-label="Visualizar registro"
        >
          <Link href={`./clientes/${row.original.cpf}`}>
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
      accessorKey: "cpf",
      enableHiding: false,
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader title="CPF" column={column} />
      ),
    },
    {
      accessorKey: "nome",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader title="Nome" column={column} />
      ),
    },
    {
      accessorKey: "data_nasc",
      cell: ({getValue}) => formatData(getValue<Date>()),
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader title="Data Nascimento" column={column} />
      ),
    },
    {
      accessorKey: "rg_num",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Num. RG" />
      ),
    },
  ];
}

function getFilters(): DataTableFilterField<TableData>[] {
  return [
    {
      label: "CPF",
      placeholder: "Filtrar CPF...",
      type: "text",
      value: "cpf",
    },
    {
      label: "Nome",
      placeholder: "Filtrar nome...",
      type: "text",
      value: "nome",
    },
  ];
}
