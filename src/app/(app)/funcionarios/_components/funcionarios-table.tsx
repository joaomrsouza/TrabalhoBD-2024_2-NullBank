"use client";

import { DataTable } from "@/components/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { Button } from "@/components/ui/button";
import { useDataTable } from "@/hooks";
import { type DataTableFilterField } from "@/hooks/use-data-table";
import { type Funcionario } from "@/server/database/queries/funcionarios";
import { formatCurrency, formatData } from "@/utils/formaters";
import { type ColumnDef } from "@tanstack/react-table";
import { TextSearchIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

type TableData = Funcionario;

interface FuncionarioTableProps {
  data: TableData[];
  pageCount: number;
}

export function FuncionarioTable(props: FuncionarioTableProps) {
  const { data, pageCount } = props;

  const columns = React.useMemo(() => getColumns(), []);
  const filters = React.useMemo(() => getFilters(), []);

  const { table } = useDataTable({
    columns,
    data,
    defaultPerPage: 10,
    defaultSort: "matricula.asc",
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
          <Link href={`./funcionarios/${row.original.matricula}`}>
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
      accessorKey: "matricula",
      enableHiding: false,
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Matrícula" />
      ),
    },
    {
      accessorKey: "nome",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader title="Nome" column={column} />
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
      accessorKey: "genero",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader title="Gênero" column={column} />
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
      accessorKey: "agencias_num_ag",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader title="Número" column={column} />
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
  ];
}

function getFilters(): DataTableFilterField<TableData>[] {
  return [
    {
      label: "Matrícula",
      placeholder: "Filtrar Matrícula...",
      type: "text",
      value: "matricula",
    },
    {
      label: "Nome",
      placeholder: "Filtrar nome...",
      type: "text",
      value: "nome",
    },
  ];
}
