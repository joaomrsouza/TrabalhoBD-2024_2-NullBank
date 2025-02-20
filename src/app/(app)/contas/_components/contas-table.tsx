"use client";

import { DataTable } from "@/components/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { Button } from "@/components/ui/button";
import { useDataTable } from "@/hooks";
import { type DataTableFilterField } from "@/hooks/use-data-table";
import { type Conta } from "@/server/database/queries/contas";
import { formatCurrency } from "@/utils/formaters";
import { type ColumnDef } from "@tanstack/react-table";
import { TextSearchIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

type TableData = Conta;

interface ContaTableProps {
  data: TableData[];
  pageCount: number;
}

export function ContaTable(props: ContaTableProps) {
  const { data, pageCount } = props;

  const columns = React.useMemo(() => getColumns(), []);
  const filters = React.useMemo(() => getFilters(), []);

  const { table } = useDataTable({
    columns,
    data,
    defaultPerPage: 10,
    defaultSort: "num_conta.asc",
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
          <Link href={`./contas/${row.original.num_conta}`}>
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
      accessorKey: "agencias_num_ag",
      enableHiding: false,
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Número Agência" />
      ),
    },
    {
      accessorKey: "funcionarios_matricula_gerente",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Matrícula Gerente" />
      ),
    },
    {
      accessorKey: "num_conta",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Número Conta" />
      ),
    },
    {
      accessorKey: "saldo",
      cell: ({ cell }) => formatCurrency(cell.getValue<number>()),
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader title="Saldo" column={column} />
      ),
    },
    {
      accessorKey: "tipo",
      cell: ({ cell }) => formatCurrency(cell.getValue<number>()),
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tipo Conta" />
      ),
    },
  ];
}

function getFilters(): DataTableFilterField<TableData>[] {
  return [
    {
      label: "Tipo Conta",
      placeholder: "Filtrar tipo conta...",
      type: "text",
      value: "tipo",
    },
    {
      label: "Número Conta",
      placeholder: "Filtrar número conta...",
      type: "text",
      value: "num_conta",
    },
  ];
}
