import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Separator } from "@/components/ui/separator";
import { schemas } from "@/schemas";
import { db } from "@/server/database";
import { Permission } from "@/server/services/permission";
import { AgenciaClienteTable } from "./_components/agencia-cliente-table";

export const metadata = { title: "Clientes por agência" };

interface PageProps {
  searchParams: Promise<unknown>;
}

export default async function ConsultaAgenciaClientesPage(props: PageProps) {
  const searchParams = await props.searchParams;

  await Permission.safeGetAuthUser(["dba"]);

  const search = schemas.consultas.agencias.agenciaParams.parse(searchParams);

  const { count, data } = await db.queries.consultas.agencias.clientes(search);

  const pageCount = Math.ceil(count / search.take);

  return (
    <PageContainer>
      <PageHeader>Clientes por agência</PageHeader>
      <Separator />
      <AgenciaClienteTable data={data} pageCount={pageCount} />
    </PageContainer>
  );
}
