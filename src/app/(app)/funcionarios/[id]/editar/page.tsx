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
import { FuncionariosForm } from "../../_components/funcionarios-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { id } = await props.params;

  const notFound = { title: "Funcionário não encontrado" };

  const idValido = schemas.id.safeParse(id);
  if (!idValido.success) return notFound;

  const funcionario = await db.queries.funcionarios.getNomeByMatricula(
    idValido.data,
  );

  if (!funcionario) return notFound;

  return { title: `Editar ${funcionario.nome}` };
}

export default async function EditarFuncionario(props: PageProps) {
  const { id } = await props.params;

  await Permission.safeGetAuthUser(["dba"]);

  const idValido = schemas.id.safeParse(id);
  if (!idValido.success) return notFound();

  const funcionario = await db.queries.funcionarios.getByMatricula(
    idValido.data,
  );
  const parsed = schemas.funcionario.prune.safeParse(funcionario);

  if (!parsed.success) notFound();

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <PageHeader>Editar Funcionário</PageHeader>
        <Button asChild variant="ghost">
          <Link href="./">
            <ArrowLeftIcon className="mr-2 size-4" />
            Voltar
          </Link>
        </Button>
      </div>
      <Separator />
      <section className="container">
        <FuncionariosForm data={parsed.data} matricula={idValido.data} />
      </section>
    </PageContainer>
  );
}
