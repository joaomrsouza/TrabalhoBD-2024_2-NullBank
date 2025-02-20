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
import { ArrowLeftIcon } from "lucide-react";
import { type Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShowTransacaoActions } from "./_components/show-transacoes-actions";

interface PageProps {
  params: Promise<{ numero: string }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { numero } = await props.params;

  const notFound = { title: "Transação não encontrada" };

  const numTransacaoValida = schemas.number.safeParse(numero);
  if (!numTransacaoValida.success) return notFound;

  return { title: `Transação #${numTransacaoValida.data.toString()}` };
}

export default async function ExibirTransacao(props: PageProps) {
  const { numero } = await props.params;

  const user = await Permission.safeGetAuthUser(["dba"]);

  const numTransacaoValida = schemas.number.safeParse(numero);
  if (!numTransacaoValida.success) return notFound();

  const transacao = await db.queries.transacoes.getByNumero(
    numTransacaoValida.data,
  );

  if (!transacao) return notFound();

  const canEdit = Permission.temPermissaoDeAcesso(["dba"], user);
  const canDelete = Permission.temPermissaoDeAcesso(["dba"], user);

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <PageHeader>
          Transação #{transacao.num_transacao}
        </PageHeader>
        <Button asChild variant="ghost">
          <Link href="./">
            <ArrowLeftIcon className="mr-2 size-4" />
            Transações
          </Link>
        </Button>
      </div>
      <Separator />

      <ShowTransacaoActions
        canEdit={canEdit}
        canDelete={canDelete}
        num_transacao={numTransacaoValida.data}
      />
      <ShowSection title="Cadastro">
        <ShowGroup>
          <ShowField label="Número">{transacao.num_transacao}</ShowField>
          <ShowField label="Conta Origem">{transacao.contas_num_conta_origem}</ShowField>
          <ShowField label="Conta Destino">{transacao.contas_num_conta_destino}</ShowField>
          <ShowField label="Data">
            {/* // TODO: Formatar data-hora */}
            {formatData(transacao.data_hora)}
          </ShowField>
        </ShowGroup>

        <ShowGroup>
          <ShowField label="Tipo">
            {transacao.tipo}
          </ShowField>
          <ShowField label="Valor">{formatCurrency(transacao.valor)}</ShowField>
        </ShowGroup>
      </ShowSection>
      <ShowTransacaoActions
        canEdit={canEdit}
        canDelete={canDelete}
        num_transacao={numTransacaoValida.data}
      />
    </PageContainer>
  );
}
