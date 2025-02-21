"use client";

import { DataTable } from "@/components/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { Button } from "@/components/ui/button";
import { useDataTable } from "@/hooks";
import { type DataTableFilterField } from "@/hooks/use-data-table";
import { type Transacao } from "@/server/database/queries/transacoes";
import { formatCurrency, formatDataHora } from "@/utils/formaters";
import { type ColumnDef } from "@tanstack/react-table";
import { capitalize } from "lodash";
import { TextSearchIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

type TableData = Transacao;

interface TransacaoTableProps {
  data: TableData[];
  pageCount: number;
}

export function TransacaoTable(props: TransacaoTableProps) {
  const { data, pageCount } = props;

  const columns = React.useMemo(() => getColumns(), []);
  const filters = React.useMemo(() => getFilters(), []);

  const { table } = useDataTable({
    columns,
    data,
    defaultPerPage: 10,
    defaultSort: "data_hora.desc",
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
      cell: ({ row }) => (
        <Button
          asChild
          size="sm"
          title="Visualizar registro"
          aria-label="Visualizar registro"
        >
          <Link href={`./transacoes/${row.original.num_transacao}`}>
            <TextSearchIcon className="mr-2 size-4" />
            Visualizar
          </Link>
        </Button>
      ),
      enableHiding: false,
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader title="" column={column} />
      ),
      id: "access",
    },
    {
      accessorKey: "num_transacao",
      enableHiding: false,
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="N. Transação" />
      ),
    },
    {
      accessorKey: "contas_num_conta_origem",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Conta (Origem)" />
      ),
    },
    {
      accessorKey: "tipo",
      cell: ({ getValue }) => capitalize(getValue<string>()),
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tipo Transação" />
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
        <DataTableColumnHeader column={column} title="Conta Destino" />
      ),
    },
  ];
}

function getFilters(): DataTableFilterField<TableData>[] {
  return [
    {
      label: "Tipo Transação",
      placeholder: "Filtrar Tipo Transação...",
      type: "text",
      value: "tipo",
    },
  ];
}
