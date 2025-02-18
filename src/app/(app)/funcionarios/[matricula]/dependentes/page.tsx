import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { schemas } from "@/schemas";
import { db } from "@/server/database";
import { Permission } from "@/server/services/permission";
import { ArrowLeftIcon, PlusIcon } from "lucide-react";
import { type Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DependenteTable } from "./_components/dependentes-table";

interface PageProps {
  params: Promise<{ matricula: string }>;
  searchParams: Promise<unknown>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { matricula } = await props.params;

  const notFound = { title: "Funcionário não encontrado" };

  const matriculaValida = schemas.number.safeParse(matricula);
  if (!matriculaValida.success) return notFound;

  const funcionario = await db.queries.funcionarios.getNomeByMatricula(
    matriculaValida.data,
  );

  if (!funcionario) return notFound;

  return { title: `Dependentes de ${funcionario.nome}` };
}

export default async function Dependentes(props: PageProps) {
  const [{ matricula }, searchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ]);

  const usuario = await Permission.safeGetAuthUser(["dba"]);
  const canCreate = Permission.temPermissaoDeAcesso(["dba"], usuario);

  const matriculaValida = schemas.number.safeParse(matricula);
  if (!matriculaValida.success) return notFound();

  const search = schemas.dependente.searchParams.parse(searchParams);
  const [{ count, dependentes }, funcionario] = await Promise.all([
    db.queries.dependentes.getFilteredPage(matriculaValida.data, search),
    db.queries.funcionarios.getNomeByMatricula(matriculaValida.data),
  ]);

  const pageCount = Math.ceil(count / search.take);

  if (!funcionario) return notFound();

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <PageHeader>Dependentes de {funcionario.nome}</PageHeader>
        <div className="flex gap-2">
          <Button asChild variant="ghost">
            <Link href="./">
              <ArrowLeftIcon className="mr-2 size-4" />
              Funcionário
            </Link>
          </Button>
          {canCreate && (
            <Button asChild>
              <Link href="./dependentes/novo">
                <PlusIcon className="mr-2 size-4" />
                Novo Dependente
              </Link>
            </Button>
          )}
        </div>
      </div>
      <Separator />
      <DependenteTable data={dependentes} pageCount={pageCount} />
    </PageContainer>
  );
}
