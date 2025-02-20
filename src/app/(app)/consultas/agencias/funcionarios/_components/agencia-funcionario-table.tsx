"use client";

import { DataTable } from "@/components/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import {
  type DataTableFilterField,
  useDataTable,
} from "@/hooks/use-data-table";
import { type AgenciaFuncionarios } from "@/server/database/queries/consultas/agencias";
import { formatCurrency } from "@/utils/formaters";
import { type ColumnDef } from "@tanstack/react-table";
import React from "react";

type TableData = AgenciaFuncionarios;

interface AgenciaFuncionarioTableProps {
  data: TableData[];
  pageCount: number;
}

export function AgenciaFuncionarioTable(props: AgenciaFuncionarioTableProps) {
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
      accessorKey: "agencias_num_ag",
      enableHiding: true,
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="N. Agência" />
      ),
    },
    {
      accessorKey: "nome",
      enableHiding: false,
      header: ({ column }) => (
        <DataTableColumnHeader title="Nome" column={column} />
      ),
    },
    {
      accessorKey: "cargo",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader title="Cargo" column={column} />
      ),
    },
    {
      accessorKey: "endereco",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Endereço" />
      ),
    },
    {
      accessorKey: "cidade",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader title="Cidade" column={column} />
      ),
    },
    {
      accessorKey: "salario",
      cell: ({ getValue }) => formatCurrency(getValue<number>()),
      header: ({ column }) => (
        <DataTableColumnHeader title="Salário" column={column} />
      ),
    },
    {
      accessorKey: "dependentes",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Qtd. Dependentes" />
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
