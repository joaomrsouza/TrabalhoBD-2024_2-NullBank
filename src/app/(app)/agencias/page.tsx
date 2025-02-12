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
import { AgenciaTable } from "./_components/agencias-table";

export const metadata: Metadata = { title: "Agências" };

interface PageProps {
  searchParams: Promise<unknown>;
}

export default async function Agencias(props: PageProps) {
  const { searchParams } = props;

  const usuario = await Permission.safeGetAuthUser(["dba"]);
  const canCreate = Permission.temPermissaoDeAcesso(["dba"], usuario);

  const search = schemas.agencia.searchParams.parse(await searchParams);
  const { agencias, count } = await db.queries.agencias.getFilteredPage(search);

  const pageCount = Math.ceil(count / search.take);

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <PageHeader>Agências</PageHeader>
        {canCreate && (
          <Button asChild>
            <Link href="./agencias/novo">
              <PlusIcon className="mr-2 size-4" />
              Nova Agência
            </Link>
          </Button>
        )}
      </div>
      <Separator />
      <AgenciaTable data={agencias} pageCount={pageCount} />
    </PageContainer>
  );
}
