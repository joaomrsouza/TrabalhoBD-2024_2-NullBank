"use client";

import { DataTable } from "@/components/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import {
  type DataTableFilterField,
  useDataTable,
} from "@/hooks/use-data-table";
import { type CidadeFuncionarios } from "@/server/database/queries/consultas/cidades";
import { formatCurrency } from "@/utils/formaters";
import { type ColumnDef } from "@tanstack/react-table";
import { capitalize } from "lodash";
import React from "react";

type TableData = CidadeFuncionarios;

interface CidadeFuncionarioTableProps {
  data: TableData[];
  pageCount: number;
}

export function CidadeFuncionarioTable(props: CidadeFuncionarioTableProps) {
  const { data, pageCount } = props;

  const columns = React.useMemo(() => getColumns(), []);
  const filters = React.useMemo(() => getFilters(), []);

  const { table } = useDataTable({
    columns,
    data,
    defaultPerPage: 10,
    defaultSort: "agencias_num_ag.asc",
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
      accessorKey: "nome",
      enableHiding: false,
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nome Funcionário" />
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
      accessorKey: "agencias_num_ag",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="N. Agência" />
      ),
    },
    {
      accessorKey: "agencias_nome",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nome Agência" />
      ),
    },
    {
      accessorKey: "cargo",
      cell: ({ getValue }) => capitalize(getValue<string>()),
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader title="Cargo" column={column} />
      ),
    },
    {
      accessorKey: "salario",
      cell: ({ getValue }) => formatCurrency(getValue<number>()),
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Salário" />
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
