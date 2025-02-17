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
import { formatData } from "@/server/utils/formaters";
import { ArrowLeftIcon } from "lucide-react";
import { type Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShowDependenteActions } from "./_components/show-dependentes-actions";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { id } = await props.params;

  const notFound = { title: "Dependente não encontrado" };

  const idValido = schemas.string.safeParse(id);
  if (!idValido.success) return notFound;

  const dependente = await db.queries.dependentes.getNomeByNomeDependente(
    idValido.data,
  );

  if (!dependente) return notFound;

  return { title: dependente.nome };
}

export default async function ExibirDependente(props: PageProps) {
  const { id } = await props.params;

  const user = await Permission.safeGetAuthUser(["dba"]);

  const idValido = schemas.string.safeParse(id);
  if (!idValido.success) return notFound();

  const dependente = await db.queries.dependentes.getNomeByNomeDependente(
    idValido.data,
  );

  if (!dependente) return notFound();

  const canEdit = Permission.temPermissaoDeAcesso(["dba"], user);
  const canDelete = Permission.temPermissaoDeAcesso(["dba"], user);

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <PageHeader>{depedente.nome_dependente}</PageHeader>
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
        id={idValido.data}
        canDelete={canDelete}
      />
      <ShowSection title="Cadastro">
        <ShowGroup>
          <ShowField label="Nome Dependente">
            {dependente.nome_dependente}
          </ShowField>
          <ShowField label="Data Nascimento">
            {formatData(dependente.data_nasc)}
          </ShowField>
          <ShowField label="Idade">{dependente.idade}</ShowField>
        </ShowGroup>

        <ShowGroup>
          <ShowField label="Funcionário Responsável">
            {dependente.funcionarios_matricula}
          </ShowField>
          <ShowField label="Parentesco">{dependente.parentesco}</ShowField>
        </ShowGroup>
      </ShowSection>
      <ShowDependenteActions
        canEdit={canEdit}
        id={idValido.data}
        canDelete={canDelete}
      />
    </PageContainer>
  );
}
