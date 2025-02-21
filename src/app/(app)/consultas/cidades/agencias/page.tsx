import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Separator } from "@/components/ui/separator";
import { schemas } from "@/schemas";
import { db } from "@/server/database";
import { Permission } from "@/server/services/permission";
import { CidadeAgenciaTable } from "./_components/cidade-agencia-table";

export const metadata = { title: "Agências por cidade" };

interface PageProps {
  searchParams: Promise<unknown>;
}

export default async function ConsultaCidadeAgenciaPage(props: PageProps) {
  const searchParams = await props.searchParams;

  await Permission.safeGetAuthUser(["dba"]);

  const search = schemas.consultas.cidades.cidadesParams.parse(searchParams);

  const { count, data } = await db.queries.consultas.cidades.agencias(search);

  const pageCount = Math.ceil(count / search.take);

  return (
    <PageContainer>
      <PageHeader>Agências por cidade</PageHeader>
      <Separator />
      <CidadeAgenciaTable data={data} pageCount={pageCount} />
    </PageContainer>
  );
}
