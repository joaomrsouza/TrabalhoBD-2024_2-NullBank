"use client";

import { DataTable } from "@/components/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import {
  type DataTableFilterField,
  useDataTable,
} from "@/hooks/use-data-table";
import { type ClienteContasConjunta } from "@/server/database/queries/consultas/clientes";
import { type ColumnDef } from "@tanstack/react-table";
import React from "react";

type TableData = ClienteContasConjunta;

interface ClienteContaConjuntaTableProps {
  data: TableData[];
  pageCount: number;
}

export function ClienteContaConjuntaTable(
  props: ClienteContaConjuntaTableProps,
) {
  const { data, pageCount } = props;

  const columns = React.useMemo(() => getColumns(), []);
  const filters = React.useMemo(() => getFilters(), []);

  const { table } = useDataTable({
    columns,
    data,
    defaultPerPage: 10,
    defaultSort: "cpf.asc",
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
      accessorKey: "clientes_cpf",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="CPF Cliente" />
      ),
    },
    {
      accessorKey: "cpf",
      enableHiding: false,
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="CPF Cliente Conjunta" />
      ),
    },
    {
      accessorKey: "nome",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nome Cliente Conjunta" />
      ),
    },
  ];
}

function getFilters(): DataTableFilterField<TableData>[] {
  return [
    {
      label: "Cliente",
      placeholder: "Selecionar cliente...",
      searchQueryObject: "cliente",
      type: "select",
      value: "clientes_cpf",
    },
  ];
}
