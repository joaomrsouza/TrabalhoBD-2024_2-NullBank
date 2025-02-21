import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { schemas } from "@/schemas";
import { db } from "@/server/database";
import { Permission } from "@/server/services/permission";
import { AlertCircleIcon, ArrowLeftIcon } from "lucide-react";
import { type Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TransacoesForm } from "../../_components/transacoes-form";

interface PageProps {
  params: Promise<{ numero: string }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { numero } = await props.params;

  const notFound = { title: "Transação não encontrada" };

  const numTrasacaoValida = schemas.number.safeParse(numero);
  if (!numTrasacaoValida.success) return notFound;

  return { title: `Editar transação #${numTrasacaoValida.data}` };
}

export default async function EditarTransacao(props: PageProps) {
  const { numero } = await props.params;

  await Permission.safeGetAuthUser(["dba"]);

  const numTransacaoValida = schemas.number.safeParse(numero);
  if (!numTransacaoValida.success) return notFound();

  const transacao = await db.queries.transacoes.getByNumero(
    numTransacaoValida.data,
  );
  const parsed = schemas.transacao.prune.safeParse(transacao);

  if (!parsed.success) notFound();

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <PageHeader>Editar Transação #{transacao?.num_transacao}</PageHeader>
        <Button asChild variant="ghost">
          <Link href="./">
            <ArrowLeftIcon className="mr-2 size-4" />
            Voltar
          </Link>
        </Button>
      </div>
      <Separator />
      <section className="container">
        <Alert variant="destructive">
          <AlertCircleIcon className="size-4" />
          <AlertTitle>Cuidado!</AlertTitle>
          <AlertDescription>
            Editar uma transação{" "}
            <span className="font-bold">não alterará os valores em contas</span>
            , apenas o registro da transação em si.
          </AlertDescription>
        </Alert>
        <TransacoesForm
          data={parsed.data}
          num_transacao={numTransacaoValida.data}
        />
      </section>
    </PageContainer>
  );
}
