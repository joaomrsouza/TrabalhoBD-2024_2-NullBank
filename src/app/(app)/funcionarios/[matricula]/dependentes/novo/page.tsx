import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { schemas } from "@/schemas";
import { db } from "@/server/database";
import { Permission } from "@/server/services/permission";
import { ArrowLeftIcon } from "lucide-react";
import { type Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DependentesForm } from "../_components/dependentes-form";

interface PageProps {
  params: Promise<{ matricula: string }>;
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

  return { title: `Novo dependente de ${funcionario.nome}` };
}

export default async function NovoDependente(props: PageProps) {
  const { matricula } = await props.params;

  await Permission.safeGetAuthUser(["dba"]);

  const matriculaValida = schemas.number.safeParse(matricula);
  if (!matriculaValida.success) return notFound();

  const funcionario = await db.queries.funcionarios.getNomeByMatricula(
    matriculaValida.data,
  );

  if (!funcionario) return notFound();

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <PageHeader>Novo dependente de {funcionario.nome}</PageHeader>
        <Button asChild variant="ghost">
          <Link href="./">
            <ArrowLeftIcon className="mr-2 size-4" />
            Dependentes
          </Link>
        </Button>
      </div>
      <Separator />
      <section className="container">
        <DependentesForm matricula={matriculaValida.data} />
      </section>
    </PageContainer>
  );
}
