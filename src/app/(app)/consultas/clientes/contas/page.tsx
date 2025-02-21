import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Separator } from "@/components/ui/separator";
import { schemas } from "@/schemas";
import { db } from "@/server/database";
import { Permission } from "@/server/services/permission";
import { ClienteContaTable } from "./_components/cliente-conta-table";

export const metadata = { title: "Contas por cliente" };

interface PageProps {
  searchParams: Promise<unknown>;
}

export default async function ConsultaClienteContaPage(props: PageProps) {
  const searchParams = await props.searchParams;

  await Permission.safeGetAuthUser(["dba"]);

  const search = schemas.consultas.clientes.clienteParams.parse(searchParams);

  const { count, data } = await db.queries.consultas.clientes.contas(search);

  const pageCount = Math.ceil(count / search.take);

  return (
    <PageContainer>
      <PageHeader>Contas por cliente</PageHeader>
      <Separator />
      <ClienteContaTable data={data} pageCount={pageCount} />
    </PageContainer>
  );
}
