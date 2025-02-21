"use client";

import { DataTable } from "@/components/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import {
  type DataTableFilterField,
  useDataTable,
} from "@/hooks/use-data-table";
import { type ClienteContas } from "@/server/database/queries/consultas/clientes";
import { formatCurrency } from "@/utils/formaters";
import { type ColumnDef } from "@tanstack/react-table";
import { capitalize } from "lodash";
import React from "react";

type TableData = ClienteContas;

interface ClienteContaTableProps {
  data: TableData[];
  pageCount: number;
}

export function ClienteContaTable(props: ClienteContaTableProps) {
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
      accessorKey: "clientes_cpf",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="CPF Cliente" />
      ),
    },
    {
      accessorKey: "num_conta",
      enableHiding: false,
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="N. Conta" />
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
      accessorKey: "funcionarios_matricula_gerente",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Matricula Gerente" />
      ),
    },
    {
      accessorKey: "funcionarios_nome_gerente",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nome Gerente" />
      ),
    },
    {
      accessorKey: "tipo",
      cell: ({ getValue }) => capitalize(getValue<string>()),
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader title="Tipo" column={column} />
      ),
    },
    {
      accessorKey: "saldo",
      cell: ({ getValue }) => formatCurrency(getValue<number>()),
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader title="Saldo" column={column} />
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
