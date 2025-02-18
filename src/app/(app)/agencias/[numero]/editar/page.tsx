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
import { AgenciasForm } from "../../_components/agencias-form";

interface PageProps {
  params: Promise<{ numero: string }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { numero } = await props.params;

  const notFound = { title: "Agência não encontrada" };

  const numeroValido = schemas.number.safeParse(numero);
  if (!numeroValido.success) return notFound;

  const agencia = await db.queries.agencias.getNomeByNumero(numeroValido.data);

  if (!agencia) return notFound;

  return { title: `Editar ${agencia.nome_ag}` };
}

export default async function EditarAgencia(props: PageProps) {
  const { numero } = await props.params;

  await Permission.safeGetAuthUser(["dba"]);

  const numeroValido = schemas.number.safeParse(numero);
  if (!numeroValido.success) return notFound();

  const agencia = await db.queries.agencias.getByNumero(numeroValido.data);
  const parsed = schemas.agencia.prune.safeParse(agencia);

  if (!parsed.success) notFound();

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <PageHeader>Editar Agência</PageHeader>
        <Button asChild variant="ghost">
          <Link href="./">
            <ArrowLeftIcon className="mr-2 size-4" />
            Voltar
          </Link>
        </Button>
      </div>
      <Separator />
      <section className="container">
        <AgenciasForm data={parsed.data} num_ag={numeroValido.data} />
      </section>
    </PageContainer>
  );
}
