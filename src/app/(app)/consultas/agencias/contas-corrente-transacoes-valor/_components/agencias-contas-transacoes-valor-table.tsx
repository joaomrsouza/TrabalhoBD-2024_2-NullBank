"use client";

import { DataTable } from "@/components/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import {
  type DataTableFilterField,
  useDataTable,
} from "@/hooks/use-data-table";
import { type AgenciaContasCorrenteTransacoesValor } from "@/server/database/queries/consultas/agencias";
import { formatCurrency } from "@/utils/formaters";
import { type ColumnDef } from "@tanstack/react-table";
import React from "react";

type TableData = AgenciaContasCorrenteTransacoesValor;

interface AgenciaContasCorrenteTransacoesValorTableProps {
  data: TableData[];
  pageCount: number;
}

export function AgenciaContasCorrenteTransacoesValorTable(
  props: AgenciaContasCorrenteTransacoesValorTableProps,
) {
  const { data, pageCount } = props;

  const columns = React.useMemo(() => getColumns(), []);
  const filters = React.useMemo(() => getFilters(), []);

  const { table } = useDataTable({
    columns,
    data,
    defaultPerPage: 10,
    defaultSort: "valor_transacoes.desc",
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
      accessorKey: "num_conta",
      enableHiding: false,
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="N. Conta" />
      ),
    },
    {
      accessorKey: "valor_transacoes",
      cell: ({ getValue }) => formatCurrency(getValue<number>()),
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Valor Transações" />
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
      label: "Agência",
      placeholder: "Selecionar agência...",
      searchQueryObject: "agencia",
      type: "select",
      value: "agencias_num_ag",
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
