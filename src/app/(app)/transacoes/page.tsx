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
import { TransacaoTable } from "./_components/transacoes-table";

export const metadata: Metadata = { title: "Trasanções" };

interface PageProps {
  searchParams: Promise<unknown>;
}

export default async function Transacoes(props: PageProps) {
  const searchParams = await props.searchParams;

  const usuario = await Permission.safeGetAuthUser(["dba"]);
  const canCreate = Permission.temPermissaoDeAcesso(["dba"], usuario);

  const search = schemas.transacao.searchParams.parse(searchParams);
  const { count, transacoes } =
    await db.queries.transacoes.getFilteredPage(search);

  const pageCount = Math.ceil(count / search.take);

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <PageHeader>Transações</PageHeader>
        {canCreate && (
          <Button asChild>
            <Link href="./transacoes/novo">
              <PlusIcon className="mr-2 size-4" />
              Nova Transação
            </Link>
          </Button>
        )}
      </div>
      <Separator />
      <TransacaoTable data={transacoes} pageCount={pageCount} />
    </PageContainer>
  );
}
