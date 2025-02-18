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
import { ShowFuncionarioActions } from "./_components/show-funcionarios-actions";

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

  return { title: funcionario.nome };
}

export default async function ExibirFuncionario(props: PageProps) {
  const { matricula } = await props.params;

  const user = await Permission.safeGetAuthUser(["dba"]);

  const matriculaValida = schemas.number.safeParse(matricula);
  if (!matriculaValida.success) return notFound();

  const funcionario = await db.queries.funcionarios.getByMatricula(
    matriculaValida.data,
  );

  if (!funcionario) return notFound();

  const canEdit = Permission.temPermissaoDeAcesso(["dba"], user);
  const canDelete = Permission.temPermissaoDeAcesso(["dba"], user);

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <PageHeader>
          {funcionario.nome} ({funcionario.matricula})
        </PageHeader>
        <Button asChild variant="ghost">
          <Link href="./">
            <ArrowLeftIcon className="mr-2 size-4" />
            Funcionários
          </Link>
        </Button>
      </div>
      <Separator />

      <ShowFuncionarioActions
        canEdit={canEdit}
        canDelete={canDelete}
        matricula={matriculaValida.data}
      />
      <ShowSection title="Cadastro">
        <ShowGroup>
          <ShowField label="Nome">{funcionario.nome}</ShowField>
          <ShowField label="Data Nascimento">
            {formatData(funcionario.data_nasc)}
          </ShowField>
          <ShowField label="Gênero">{funcionario.genero}</ShowField>
        </ShowGroup>

        <ShowGroup>
          <ShowField label="Número da Agência">
            {funcionario.agencias_num_ag}
          </ShowField>
          <ShowField label="Matrícula">{funcionario.matricula}</ShowField>
          <ShowField label="Cargo">{funcionario.cargo}</ShowField>
          <ShowField label="Salário">{funcionario.salario}</ShowField>
        </ShowGroup>

        <ShowGroup>
          <ShowField label="Endereço">{funcionario.endereco}</ShowField>
          <ShowField label="Cidade">{funcionario.cidade}</ShowField>
        </ShowGroup>
      </ShowSection>
      <ShowFuncionarioActions
        canEdit={canEdit}
        canDelete={canDelete}
        matricula={matriculaValida.data}
      />
    </PageContainer>
  );
}
