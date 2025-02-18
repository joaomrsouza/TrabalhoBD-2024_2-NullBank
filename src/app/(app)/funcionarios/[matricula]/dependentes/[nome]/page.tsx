import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { ShowField } from "@/components/show/show-field";
import { ShowGroup } from "@/components/show/show-group";
import { ShowSection } from "@/components/show/show-section";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { schemas } from "@/schemas";
import { db } from "@/server/database";
import { Permission } from "@/server/services/permission";
import { formatData } from "@/utils/formaters";
import { ArrowLeftIcon } from "lucide-react";
import { type Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShowDependenteActions } from "./_components/show-dependentes-actions";

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
    title: `${dependente.nome_dependente} dependente de ${funcionario.nome}`,
  };
}

export default async function ExibirDependente(props: PageProps) {
  const { matricula, nome } = await props.params;

  const usuario = await Permission.safeGetAuthUser(["dba"]);

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

  const canEdit = Permission.temPermissaoDeAcesso(["dba"], usuario);
  const canDelete = Permission.temPermissaoDeAcesso(["dba"], usuario);

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <PageHeader>
          {dependente.nome_dependente} dependente de {funcionario.nome}
        </PageHeader>
        <Button asChild variant="ghost">
          <Link href="./">
            <ArrowLeftIcon className="mr-2 size-4" />
            Dependentes
          </Link>
        </Button>
      </div>
      <Separator />

      <ShowDependenteActions
        canEdit={canEdit}
        canDelete={canDelete}
        nome={nomeValido.data}
        matricula={matriculaValida.data}
      />
      <ShowSection title="Cadastro">
        <ShowGroup>
          <ShowField label="Nome Dependente">
            {dependente.nome_dependente}
          </ShowField>
          <ShowField label="Data Nascimento">
            {formatData(dependente.data_nasc)}
          </ShowField>
          <ShowField label="Idade">{dependente.idade} Anos</ShowField>
        </ShowGroup>

        <ShowGroup>
          <ShowField label="Funcionário Responsável">
            {funcionario.nome} ({dependente.funcionarios_matricula})
          </ShowField>
          <ShowField label="Parentesco">{dependente.parentesco}</ShowField>
        </ShowGroup>
      </ShowSection>
      <ShowDependenteActions
        canEdit={canEdit}
        canDelete={canDelete}
        nome={nomeValido.data}
        matricula={matriculaValida.data}
      />
    </PageContainer>
  );
}
