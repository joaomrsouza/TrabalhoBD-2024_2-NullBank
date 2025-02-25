"use client";

import { DataTable } from "@/components/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import {
  type DataTableFilterField,
  useDataTable,
} from "@/hooks/use-data-table";
import { type TransacoesPorConta } from "@/server/database/queries/consultas/transacoes-por-conta";
import { formatCurrency, formatDataHora } from "@/utils/formaters";
import { type ColumnDef } from "@tanstack/react-table";
import { capitalize } from "lodash";
import React from "react";

type TableData = TransacoesPorConta;

interface TransacoesPorContaTableProps {
  data: TableData[];
  pageCount: number;
}

export function TransacoesPorContaTable(props: TransacoesPorContaTableProps) {
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
      accessorKey: "num_conta",
      enableHiding: false,
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="N. Conta" />
      ),
    },
    {
      accessorKey: "num_transacao",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="N. Transação" />
      ),
    },
    {
      accessorKey: "tipo",
      cell: ({ getValue }) => capitalize(getValue<string>()),
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tipo de transação" />
      ),
    },
    {
      accessorKey: "valor",
      cell: ({ getValue }) => formatCurrency(getValue<number>()),
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader title="Valor" column={column} />
      ),
    },
    {
      accessorKey: "data_hora",
      cell: ({ getValue }) => formatDataHora(getValue<Date>()),
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Data e Hora" />
      ),
    },
    {
      accessorKey: "contas_num_conta_destino",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Conta destino" />
      ),
    },
    {
      accessorKey: "last_x_days",
      enableSorting: false,
      header: "",
    },
  ];
}

function getFilters(): DataTableFilterField<TableData>[] {
  return [
    {
      label: "Conta",
      placeholder: "Selecionar conta...",
      searchQueryObject: "conta",
      type: "select",
      value: "num_conta",
    },
    {
      label: "Período",
      options: [
        { label: "Últimos 7 dias", value: "7" },
        { label: "Últimos 30 dias", value: "30" },
        { label: "Últimos 365 dias", value: "365" },
      ],
      placeholder: "Últimos x dias...",
      type: "select",
      value: "last_x_days",
    },
  ];
}
