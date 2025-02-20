import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Separator } from "@/components/ui/separator";
import { schemas } from "@/schemas";
import { db } from "@/server/database";
import { Permission } from "@/server/services/permission";
import { AgenciaContasEspeciaisTable } from "./_components/agencias-contas-especiais-table";

export const metadata = { title: "Contas especiais por agência" };

interface PageProps {
  searchParams: Promise<unknown>;
}

export default async function ConsultaAgenciaContasEspeciaisPage(
  props: PageProps,
) {
  const searchParams = await props.searchParams;

  await Permission.safeGetAuthUser(["dba"]);

  const search = schemas.consultas.agencias.agenciaParams.parse(searchParams);

  const { count, data } =
    await db.queries.consultas.agencias.contasEspeciais(search);

  const pageCount = Math.ceil(count / search.take);

  return (
    <PageContainer>
      <PageHeader>Contas especiais por agência</PageHeader>
      <Separator />
      <AgenciaContasEspeciaisTable data={data} pageCount={pageCount} />
    </PageContainer>
  );
}
