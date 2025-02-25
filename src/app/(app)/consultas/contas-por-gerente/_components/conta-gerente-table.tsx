"use client";

import { DataTable } from "@/components/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import {
  type DataTableFilterField,
  useDataTable,
} from "@/hooks/use-data-table";
import { type ContasPorGerente } from "@/server/database/queries/consultas/contas-por-gerente";
import { formatCurrency } from "@/utils/formaters";
import { type ColumnDef } from "@tanstack/react-table";
import { capitalize } from "lodash";
import React from "react";

type TableData = ContasPorGerente;

interface ContasPorGerenteTableProps {
  data: TableData[];
  pageCount: number;
}

export function ContasPorGerenteTable(props: ContasPorGerenteTableProps) {
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
      accessorKey: "funcionarios_matricula_gerente",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Matrícula Gerente" />
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
      accessorKey: "tipo",
      cell: ({ getValue }) => capitalize(getValue<string>()),
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tipo de conta" />
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
    {
      accessorKey: "cpf",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="CPF do cliente" />
      ),
    },
    {
      accessorKey: "nome",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nome do cliente" />
      ),
    },
  ];
}

function getFilters(): DataTableFilterField<TableData>[] {
  return [
    {
      label: "Gerente",
      placeholder: "Selecionar gerente...",
      searchQueryObject: "gerente",
      type: "select",
      value: "funcionarios_matricula_gerente",
    },
  ];
}
