import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Separator } from "@/components/ui/separator";
import { schemas } from "@/schemas";
import { db } from "@/server/database";
import { Permission } from "@/server/services/permission";
import { ContasPorGerenteTable } from "./_components/conta-gerente-table";

export const metadata = { title: "Contas por gerente" };

interface PageProps {
  searchParams: Promise<unknown>;
}

export default async function ConsultaClienteContaConjuntaPage(
  props: PageProps,
) {
  const searchParams = await props.searchParams;

  await Permission.safeGetAuthUser(["dba"]);

  const search =
    schemas.consultas.contasPorGerente.gerenteParams.parse(searchParams);

  const { count, data } =
    await db.queries.consultas.contasPorGerente.query(search);

  const pageCount = Math.ceil(count / search.take);

  return (
    <PageContainer>
      <PageHeader>Contas por gerente</PageHeader>
      <Separator />
      <ContasPorGerenteTable data={data} pageCount={pageCount} />
    </PageContainer>
  );
}
