"use client";

import { DataTable } from "@/components/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import {
  type DataTableFilterField,
  useDataTable,
} from "@/hooks/use-data-table";
import { type CidadeClientes } from "@/server/database/queries/consultas/cidades";
import { formatData } from "@/utils/formaters";
import { type ColumnDef } from "@tanstack/react-table";
import React from "react";

type TableData = CidadeClientes;

interface CidadeClienteTableProps {
  data: TableData[];
  pageCount: number;
}

export function CidadeClienteTable(props: CidadeClienteTableProps) {
  const { data, pageCount } = props;

  const columns = React.useMemo(() => getColumns(), []);
  const filters = React.useMemo(() => getFilters(), []);

  const { table } = useDataTable({
    columns,
    data,
    defaultPerPage: 10,
    defaultSort: "idade.desc",
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
      accessorKey: "nome",
      enableHiding: false,
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nome Cliente" />
      ),
    },
    {
      accessorKey: "end_tipo",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="End. Tipo" />
      ),
    },
    {
      accessorKey: "end_logradouro",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="End. Logradouro" />
      ),
    },
    {
      accessorKey: "end_numero",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="End. Número" />
      ),
    },
    {
      accessorKey: "end_bairro",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="End. Bairro" />
      ),
    },
    {
      accessorKey: "end_cep",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="End. CEP" />
      ),
    },
    {
      accessorKey: "cidade",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="End. Cidade" />
      ),
    },
    {
      accessorKey: "end_estado",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="End. Estado" />
      ),
    },
    {
      accessorKey: "data_nasc",
      cell: ({ getValue }) => formatData(getValue<Date>()),
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Data Nascimento" />
      ),
    },
    {
      accessorKey: "idade",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader title="Idade" column={column} />
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
