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
import { FuncionarioTable } from "./_components/funcionarios-table";

export const metadata: Metadata = { title: "Funcionarios" };

interface PageProps {
  searchParams: Promise<unknown>;
}

export default async function Funcionarios(props: PageProps) {
  const { searchParams } = props;

  const usuario = await Permission.safeGetAuthUser(["dba"]);
  const canCreate = Permission.temPermissaoDeAcesso(["dba"], usuario);

  const search = schemas.funcionario.searchParams.parse(await searchParams);
  const { count, funcionarios } =
    await db.queries.funcionarios.getFilteredPage(search);

  const pageCount = Math.ceil(count / search.take);

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <PageHeader>Funcionarios</PageHeader>
        {canCreate && (
          <Button asChild>
            <Link href="./funcionarios/novo">
              <PlusIcon className="mr-2 size-4" />
              Novo Funcionário
            </Link>
          </Button>
        )}
      </div>
      <Separator />
      <FuncionarioTable data={funcionarios} pageCount={pageCount} />
    </PageContainer>
  );
}
