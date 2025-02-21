"use client";

import { DataTable } from "@/components/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import {
  type DataTableFilterField,
  useDataTable,
} from "@/hooks/use-data-table";
import { type CidadeAgencias } from "@/server/database/queries/consultas/cidades";
import { formatCurrency } from "@/utils/formaters";
import { type ColumnDef } from "@tanstack/react-table";
import React from "react";

type TableData = CidadeAgencias;

interface CidadeAgenciaTableProps {
  data: TableData[];
  pageCount: number;
}

export function CidadeAgenciaTable(props: CidadeAgenciaTableProps) {
  const { data, pageCount } = props;

  const columns = React.useMemo(() => getColumns(), []);
  const filters = React.useMemo(() => getFilters(), []);

  const { table } = useDataTable({
    columns,
    data,
    defaultPerPage: 10,
    defaultSort: "sal_total.desc",
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
      accessorKey: "cidade",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader title="Cidade" column={column} />
      ),
    },
    {
      accessorKey: "num_ag",
      enableHiding: false,
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="N. Agência" />
      ),
    },
    {
      accessorKey: "nome_ag",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nome Agência" />
      ),
    },
    {
      accessorKey: "sal_total",
      cell: ({ getValue }) => formatCurrency(getValue<number>()),
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Salário Total" />
      ),
    },
  ];
}

function getFilters(): DataTableFilterField<TableData>[] {
  return [
    {
      label: "Cidade",
      placeholder: "Pesquisar cidade...",
      type: "text",
      value: "cidade",
    },
  ];
}
