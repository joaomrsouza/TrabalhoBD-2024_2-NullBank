import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Separator } from "@/components/ui/separator";
import { schemas } from "@/schemas";
import { db } from "@/server/database";
import { Permission } from "@/server/services/permission";
import { AgenciaContasPoupancaTable } from "./_components/agencias-contas-poupanca-table";

export const metadata = { title: "Contas poupança por agência" };

interface PageProps {
  searchParams: Promise<unknown>;
}

export default async function ConsultaAgenciaContasPoupancaPage(
  props: PageProps,
) {
  const searchParams = await props.searchParams;

  await Permission.safeGetAuthUser(["dba"]);

  const search = schemas.consultas.agencias.agenciaParams.parse(searchParams);

  const { count, data } =
    await db.queries.consultas.agencias.contasPoupanca(search);

  const pageCount = Math.ceil(count / search.take);

  return (
    <PageContainer>
      <PageHeader>Contas poupança por agência</PageHeader>
      <Separator />
      <AgenciaContasPoupancaTable data={data} pageCount={pageCount} />
    </PageContainer>
  );
}
