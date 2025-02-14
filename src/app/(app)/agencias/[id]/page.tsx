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
import { formatCurrency } from "@/server/utils/formaters";
import { ArrowLeftIcon } from "lucide-react";
import { type Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShowAgenciaActions } from "./_components/show-agencia-actions";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { id } = await props.params;

  const notFound = { title: "Agência não encontrada" };

  const idValido = schemas.id.safeParse(id);
  if (!idValido.success) return notFound;

  const agencia = await db.queries.agencias.getNomeByNumero(idValido.data);

  if (!agencia) return notFound;

  return { title: agencia.nome_ag };
}

export default async function ExibirAgencia(props: PageProps) {
  const { id } = await props.params;

  const user = await Permission.safeGetAuthUser(["dba"]);

  const idValido = schemas.id.safeParse(id);
  if (!idValido.success) return notFound();

  const agencia = await db.queries.agencias.getByNumero(idValido.data);

  if (!agencia) return notFound();

  const canEdit = Permission.temPermissaoDeAcesso(["dba"], user);
  const canDelete = Permission.temPermissaoDeAcesso(["dba"], user);

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <PageHeader>
          {agencia.nome_ag} ({agencia.num_ag})
        </PageHeader>
        <Button asChild variant="ghost">
          <Link href="./">
            <ArrowLeftIcon className="mr-2 size-4" />
            Agências
          </Link>
        </Button>
      </div>
      <Separator />

      <ShowAgenciaActions
        canEdit={canEdit}
        id={idValido.data}
        canDelete={canDelete}
      />
      <ShowSection title="Cadastro">
        <ShowGroup>
          <ShowField label="Número">{agencia.num_ag}</ShowField>
          <ShowField label="Nome">{agencia.nome_ag}</ShowField>
        </ShowGroup>

        <ShowGroup>
          <ShowField label="Cidade">{agencia.cidade_ag}</ShowField>
          <ShowField label="Sal. Total">
            {formatCurrency(agencia.sal_total)}
          </ShowField>
        </ShowGroup>
      </ShowSection>
      <ShowAgenciaActions
        canEdit={canEdit}
        id={idValido.data}
        canDelete={canDelete}
      />
    </PageContainer>
  );
}
