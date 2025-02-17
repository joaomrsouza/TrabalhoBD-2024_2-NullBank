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
import { DependentesForm } from "../../_components/dependentes-form";

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

  return { title: `Editar ${dependente.nome}` };
}

export default async function EditarDependente(props: PageProps) {
  const { id } = await props.params;

  await Permission.safeGetAuthUser(["dba"]);

  const idValido = schemas.string.safeParse(id);
  if (!idValido.success) return notFound();

  const dependente = await db.queries.dependentes.getByNomeDependente(
    idValido.data,
  );
  const parsed = schemas.dependente.prune.safeParse(dependente);

  if (!parsed.success) notFound();

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <PageHeader>Editar Dependente</PageHeader>
        <Button asChild variant="ghost">
          <Link href="./">
            <ArrowLeftIcon className="mr-2 size-4" />
            Voltar
          </Link>
        </Button>
      </div>
      <Separator />
      <section className="container">
        <DependentesForm data={parsed.data} nome_dependente={idValido.data} />
      </section>
    </PageContainer>
  );
}
