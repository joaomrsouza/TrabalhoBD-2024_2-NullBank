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
import { DependenteTable } from "./_components/dependentes-table";

export const metadata: Metadata = { title: "Dependentes" };

interface PageProps {
  searchParams: Promise<unknown>;
}

export default async function Dependentes(props: PageProps) {
  const { searchParams } = props;

  const usuario = await Permission.safeGetAuthUser(["dba"]);
  const canCreate = Permission.temPermissaoDeAcesso(["dba"], usuario);

  const search = schemas.dependente.searchParams.parse(await searchParams);
  const { count, dependentes } =
    await db.queries.dependentes.getFilteredPage(search);

  const pageCount = Math.ceil(count / search.take);

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <PageHeader>Dependentes</PageHeader>
        {canCreate && (
          <Button asChild>
            <Link href="./dependentes/novo">
              <PlusIcon className="mr-2 size-4" />
              Novo Dependente
            </Link>
          </Button>
        )}
      </div>
      <Separator />
      <DependenteTable data={dependentes} pageCount={pageCount} />
    </PageContainer>
  );
}
