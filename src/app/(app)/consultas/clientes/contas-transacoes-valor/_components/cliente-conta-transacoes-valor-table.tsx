"use client";

import { DataTable } from "@/components/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import {
  type DataTableFilterField,
  useDataTable,
} from "@/hooks/use-data-table";
import { type ClienteContasTransacoesValor } from "@/server/database/queries/consultas/clientes";
import { formatCurrency } from "@/utils/formaters";
import { type ColumnDef } from "@tanstack/react-table";
import React from "react";

type TableData = ClienteContasTransacoesValor;

interface ClienteContaTrnsacoesValorTableProps {
  data: TableData[];
  pageCount: number;
}

export function ClienteContaTransacoesValorTable(
  props: ClienteContaTrnsacoesValorTableProps,
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
      accessorKey: "clientes_cpf",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="CPF Cliente" />
      ),
    },
    {
      accessorKey: "agencias_num_ag",
      enableHiding: false,
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Agência Conta" />
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
      label: "Cliente",
      placeholder: "Selecionar cliente...",
      searchQueryObject: "cliente",
      type: "select",
      value: "clientes_cpf",
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
