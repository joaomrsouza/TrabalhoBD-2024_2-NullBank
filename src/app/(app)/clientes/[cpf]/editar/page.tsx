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
  params: Promise<{ cpf: string }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { cpf } = await props.params;

  const notFound = { title: "Cliente não encontrado" };

  const cpfValido = schemas.string.safeParse(cpf);
  if (!cpfValido.success) return notFound;

  const cliente = await db.queries.clientes.getNomeByCpf(cpfValido.data);

  if (!cliente) return notFound;

  return { title: `Editar ${cliente.nome}` };
}

export default async function EditarCliente(props: PageProps) {
  const { cpf } = await props.params;

  await Permission.safeGetAuthUser(["dba"]);

  const cpfValido = schemas.string.safeParse(cpf);
  if (!cpfValido.success) return notFound();

  const [cliente, emails, telefones] = await Promise.all([
    db.queries.clientes.getByCpf(cpfValido.data),
    db.queries.clientes.getEmailsByCPF(cpfValido.data),
    db.queries.clientes.getTelefonesByCPF(cpfValido.data),
  ]);
  const parsed = schemas.cliente.prune.safeParse({
    ...cliente,
    emails,
    telefones,
  });

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
        <ClientesForm data={parsed.data} cpf={cpfValido.data} />
      </section>
    </PageContainer>
  );
}
