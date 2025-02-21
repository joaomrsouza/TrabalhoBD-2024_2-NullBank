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
import { formatCurrency, formatData } from "@/utils/formaters";
import { capitalize } from "lodash";
import { ArrowLeftIcon } from "lucide-react";
import { type Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShowContaActions } from "./_components/show-conta-actions";

interface PageProps {
  params: Promise<{ numero: string }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { numero } = await props.params;

  const notFound = { title: "Conta não encontrada" };

  const numeroValido = schemas.number.safeParse(numero);
  if (!numeroValido.success) return notFound;

  return { title: `Conta #${numeroValido.data}` };
}

export default async function ExibirConta(props: PageProps) {
  const { numero } = await props.params;

  const user = await Permission.safeGetAuthUser(["dba"]);

  const numeroValido = schemas.number.safeParse(numero);
  if (!numeroValido.success) return notFound();

  const [conta, clientes] = await Promise.all([
    db.queries.contas.getByNumero(numeroValido.data),
    db.queries.clientes.getByNumeroConta(numeroValido.data),
  ]);

  if (!conta) return notFound();

  const canEdit = Permission.temPermissaoDeAcesso(["dba"], user);
  const canDelete = Permission.temPermissaoDeAcesso(["dba"], user);

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <PageHeader>Conta #{conta.num_conta}</PageHeader>
        <Button asChild variant="ghost">
          <Link href="./">
            <ArrowLeftIcon className="mr-2 size-4" />
            Contas
          </Link>
        </Button>
      </div>
      <Separator />

      <ShowContaActions
        canEdit={canEdit}
        canDelete={canDelete}
        numero={numeroValido.data}
      />

      <ShowSection title="Cadastro">
        <ShowGroup>
          <ShowField label="Número da Agência">
            {conta.agencias_num_ag}
          </ShowField>
          <ShowField label="Matrícula Gerente">
            {conta.funcionarios_matricula_gerente}
          </ShowField>
        </ShowGroup>

        <ShowGroup>
          <ShowField label="Saldo">{formatCurrency(conta.saldo)}</ShowField>
          <ShowField label="Tipo Conta">{capitalize(conta.tipo)}</ShowField>
          {conta.tipo === "corrente" && (
            <ShowField label="Data Aniversário">
              {conta.data_aniversario
                ? formatData(conta.data_aniversario)
                : "-"}
            </ShowField>
          )}
          {conta.tipo === "especial" && (
            <ShowField label="Limite de Crédito">
              {conta.limite_credito
                ? formatCurrency(conta.limite_credito)
                : "-"}
            </ShowField>
          )}
          {conta.tipo === "poupança" && (
            <ShowField label="Taxa de Juros">{conta.taxa_juros}%</ShowField>
          )}
        </ShowGroup>
      </ShowSection>

      <ShowSection title="Cliente(s)">
        {clientes.map((c, index) => (
          <ShowGroup key={c.cpf}>
            <ShowField label={`CPF do cliente #${index + 1}`}>
              {c.cpf}
            </ShowField>
            <ShowField label={`Nome do cliente #${index + 1}`}>
              {c.nome}
            </ShowField>
          </ShowGroup>
        ))}
      </ShowSection>

      <ShowContaActions
        canEdit={canEdit}
        canDelete={canDelete}
        numero={numeroValido.data}
      />
    </PageContainer>
  );
}
