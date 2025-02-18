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
import { DependentesForm } from "../../_components/dependentes-form";

interface PageProps {
  params: Promise<{ matricula: string; nome: string }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { matricula, nome } = await props.params;

  const notFoundFuncionario = { title: "Funcionário não encontrado" };

  const matriculaValida = schemas.number.safeParse(matricula);
  if (!matriculaValida.success) return notFoundFuncionario;

  const funcionario = await db.queries.funcionarios.getNomeByMatricula(
    matriculaValida.data,
  );

  if (!funcionario) return notFoundFuncionario;

  const notFound = { title: "Dependente não encontrado" };

  const nomeValido = schemas.string.transform(decodeURI).safeParse(nome);
  if (!nomeValido.success) return notFound;

  const dependente = await db.queries.dependentes.getByNomeDependente(
    matriculaValida.data,
    nomeValido.data,
  );

  if (!dependente) return notFound;

  return {
    title: `Editar ${dependente.nome_dependente} dependente de ${funcionario.nome}`,
  };
}

export default async function EditarDependente(props: PageProps) {
  const { matricula, nome } = await props.params;

  await Permission.safeGetAuthUser(["dba"]);

  const matriculaValida = schemas.number.safeParse(matricula);
  if (!matriculaValida.success) return notFound();

  const nomeValido = schemas.string.transform(decodeURI).safeParse(nome);
  if (!nomeValido.success) return notFound();

  const [dependente, funcionario] = await Promise.all([
    db.queries.dependentes.getByNomeDependente(
      matriculaValida.data,
      nomeValido.data,
    ),
    db.queries.funcionarios.getNomeByMatricula(matriculaValida.data),
  ]);

  if (!dependente || !funcionario) return notFound();

  const parsed = schemas.dependente.prune.safeParse(dependente);
  if (!parsed.success) notFound();

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <PageHeader>Editar Dependente</PageHeader>
        <Button asChild variant="ghost">
          <Link href="./">
            <ArrowLeftIcon className="mr-2 size-4" />
            Voltar
          </Link>
        </Button>
      </div>
      <Separator />
      <section className="container">
        <DependentesForm
          data={parsed.data}
          matricula={matriculaValida.data}
          nome_dependente={nomeValido.data}
        />
      </section>
    </PageContainer>
  );
}
