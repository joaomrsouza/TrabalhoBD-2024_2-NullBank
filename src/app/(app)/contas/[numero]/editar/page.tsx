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
import { ContasForm } from "../../_components/contas-form";

interface PageProps {
  params: Promise<{ numero: string }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { numero } = await props.params;

  const notFound = { title: "Conta não encontrada" };

  const numeroValido = schemas.number.safeParse(numero);
  if (!numeroValido.success) return notFound;

  return { title: `Editar conta #${numeroValido.data}` };
}

export default async function EditarConta(props: PageProps) {
  const { numero } = await props.params;

  await Permission.safeGetAuthUser(["dba"]);

  const numeroValido = schemas.number.safeParse(numero);
  if (!numeroValido.success) return notFound();

  const [conta, clientes] = await Promise.all([
    db.queries.contas.getByNumero(numeroValido.data),
    db.queries.clientesHasContas.getByNumero(numeroValido.data),
  ]);

  const parsed = schemas.conta.prune.safeParse({
    ...conta,
    clientes_cpf: clientes.map(c => c.clientes_cpf),
    data_aniversario: conta?.data_aniversario ?? "",
    limite_credito: conta?.limite_credito ?? 0,
    taxa_juros: conta?.taxa_juros ?? 0,
  });

  if (!parsed.success) notFound();

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <PageHeader>Editar Conta #{conta?.num_conta}</PageHeader>
        <Button asChild variant="ghost">
          <Link href="./">
            <ArrowLeftIcon className="mr-2 size-4" />
            Voltar
          </Link>
        </Button>
      </div>
      <Separator />
      <section className="container">
        <ContasForm data={parsed.data} num_conta={numeroValido.data} />
      </section>
    </PageContainer>
  );
}
