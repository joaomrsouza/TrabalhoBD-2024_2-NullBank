import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Separator } from "@/components/ui/separator";
import { schemas } from "@/schemas";
import { db } from "@/server/database";
import { Permission } from "@/server/services/permission";
import { CidadeClienteTable } from "./_components/cidade-cliente-table";

export const metadata = { title: "Clientes por cidade" };

interface PageProps {
  searchParams: Promise<unknown>;
}

export default async function ConsultaCidadeClientePage(props: PageProps) {
  const searchParams = await props.searchParams;

  await Permission.safeGetAuthUser(["dba"]);

  const search = schemas.consultas.cidades.cidadesParams.parse(searchParams);

  const { count, data } = await db.queries.consultas.cidades.clientes(search);

  const pageCount = Math.ceil(count / search.take);

  return (
    <PageContainer>
      <PageHeader>Clientes por cidade</PageHeader>
      <Separator />
      <CidadeClienteTable data={data} pageCount={pageCount} />
    </PageContainer>
  );
}
