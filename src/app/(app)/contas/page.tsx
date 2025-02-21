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
import { ContaTable } from "./_components/contas-table";

export const metadata: Metadata = { title: "Contas" };

interface PageProps {
  searchParams: Promise<unknown>;
}

export default async function Contas(props: PageProps) {
  const { searchParams } = props;

  const usuario = await Permission.safeGetAuthUser(["dba"]);
  const canCreate = Permission.temPermissaoDeAcesso(["dba"], usuario);

  const search = schemas.conta.searchParams.parse(await searchParams);
  const { contas, count } = await db.queries.contas.getFilteredPage(search);

  const pageCount = Math.ceil(count / search.take);

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <PageHeader>Contas</PageHeader>
        {canCreate && (
          <Button asChild>
            <Link href="./contas/novo">
              <PlusIcon className="mr-2 size-4" />
              Nova Conta
            </Link>
          </Button>
        )}
      </div>
      <Separator />
      <ContaTable data={contas} pageCount={pageCount} />
    </PageContainer>
  );
}
