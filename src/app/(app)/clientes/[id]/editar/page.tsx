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
import { ClientesForm } from "../../_components/clientes-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { id } = await props.params;

  const notFound = { title: "Cliente não encontrado" };

  const idValido = schemas.string.safeParse(id);
  if (!idValido.success) return notFound;

  const cliente = await db.queries.clientes.getNomeByCpf(idValido.data);

  if (!cliente) return notFound;

  return { title: `Editar ${cliente.nome}` };
}

export default async function EditarCliente(props: PageProps) {
  const { id } = await props.params;

  await Permission.safeGetAuthUser(["dba"]);

  const idValido = schemas.string.safeParse(id);
  if (!idValido.success) return notFound();

  const cliente = await db.queries.clientes.getByCpf(idValido.data);
  const parsed = schemas.cliente.prune.safeParse(cliente);

  if (!parsed.success) notFound();

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <PageHeader>Editar Cliente</PageHeader>
        <Button asChild variant="ghost">
          <Link href="./">
            <ArrowLeftIcon className="mr-2 size-4" />
            Voltar
          </Link>
        </Button>
      </div>
      <Separator />
      <section className="container">
        <ClientesForm data={parsed.data} cpf={idValido.data} />
      </section>
    </PageContainer>
  );
}
