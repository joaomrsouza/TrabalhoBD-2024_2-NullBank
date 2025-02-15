import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { schemas } from "@/schemas";
import { db } from "@/server/database";
import { Permission } from "@/server/services/permission";
import { PlusIcon } from "lucide-react";
import { type Metadata } from "next";
import Link from "next/link";
import { ClienteTable } from "./_components/clientes-table";

export const metadata: Metadata = { title: "Clientes" };

interface PageProps {
  searchParams: Promise<unknown>;
}

export default async function Clientes(props: PageProps) {
  const { searchParams } = props;

  const usuario = await Permission.safeGetAuthUser(["dba"]);
  const canCreate = Permission.temPermissaoDeAcesso(["dba"], usuario);

  const search = schemas.cliente.searchParams.parse(await searchParams);
  const { clientes, count } = await db.queries.clientes.getFilteredPage(search);

  const pageCount = Math.ceil(count / search.take);

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <PageHeader>Clientes</PageHeader>
        {canCreate && (
          <Button asChild>
            <Link href="./clientes/novo">
              <PlusIcon className="mr-2 size-4" />
              Novo Cliente
            </Link>
          </Button>
        )}
      </div>
      <Separator />
      <ClienteTable data={clientes} pageCount={pageCount} />
    </PageContainer>
  );
}
