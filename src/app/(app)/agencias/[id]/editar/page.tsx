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
  params: { id: string };
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { id } = props.params;

  const notFound = { title: "Agência não encontrada" };

  const idValido = schemas.id.safeParse(id);
  if (!idValido.success) return notFound;

  const agencia = await db.queries.agencias.getNomeByNumero(idValido.data);

  if (!agencia) return notFound;

  return { title: `Editar ${agencia.nome_ag}` };
}

export default async function EditarAgencia(props: PageProps) {
  const { id } = props.params;

  await Permission.safeGetAuthUser(["dba"]);

  const idValido = schemas.id.safeParse(id);
  if (!idValido.success) return notFound();

  const agencia = await db.queries.agencias.getByNumero(idValido.data);
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
        <AgenciasForm data={parsed.data} num_ag={idValido.data} />
      </section>
    </PageContainer>
  );
}
