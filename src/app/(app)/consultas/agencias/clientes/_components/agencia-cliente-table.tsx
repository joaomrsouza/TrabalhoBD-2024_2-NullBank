"use client";

import { DataTable } from "@/components/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import {
  type DataTableFilterField,
  useDataTable,
} from "@/hooks/use-data-table";
import { type AgenciaClientes } from "@/server/database/queries/consultas/agencias";
import { type ColumnDef } from "@tanstack/react-table";
import { capitalize } from "lodash";
import React from "react";

type TableData = AgenciaClientes;

interface AgenciaClienteTableProps {
  data: TableData[];
  pageCount: number;
}

export function AgenciaClienteTable(props: AgenciaClienteTableProps) {
  const { data, pageCount } = props;

  const columns = React.useMemo(() => getColumns(), []);
  const filters = React.useMemo(() => getFilters(), []);

  const { table } = useDataTable({
    columns,
    data,
    defaultPerPage: 10,
    defaultSort: "tipo.asc",
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
      accessorKey: "agencias_num_ag",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="N. Agência" />
      ),
    },
    {
      accessorKey: "nome",
      enableHiding: false,
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader title="Nome" column={column} />
      ),
    },
    {
      accessorKey: "num_conta",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="N. Conta" />
      ),
    },
    {
      accessorKey: "tipo",
      cell: ({ getValue }) => capitalize(getValue<string>()),
      header: ({ column }) => (
        <DataTableColumnHeader title="Tipo" column={column} />
      ),
    },
  ];
}

function getFilters(): DataTableFilterField<TableData>[] {
  return [
    {
      label: "Agência",
      placeholder: "Selecionar agência...",
      searchQueryObject: "agencia",
      type: "select",
      value: "agencias_num_ag",
    },
  ];
}
