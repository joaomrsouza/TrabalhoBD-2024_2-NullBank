import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Separator } from "@/components/ui/separator";
import { schemas } from "@/schemas";
import { db } from "@/server/database";
import { Permission } from "@/server/services/permission";
import { TransacoesPorContaTable } from "./_components/transacao-conta-table";

export const metadata = { title: "Transações por conta" };

interface PageProps {
  searchParams: Promise<unknown>;
}

export default async function ConsultaClienteContaConjuntaPage(
  props: PageProps,
) {
  const searchParams = await props.searchParams;

  await Permission.safeGetAuthUser(["dba"]);

  const search =
    schemas.consultas.transacoesPorConta.contaLastXDaysParams.parse(
      searchParams,
    );

  const { count, data } =
    await db.queries.consultas.transacoesPorConta.query(search);

  const pageCount = Math.ceil(count / search.take);

  return (
    <PageContainer>
      <PageHeader>Transações por conta</PageHeader>
      <Separator />
      <TransacoesPorContaTable data={data} pageCount={pageCount} />
    </PageContainer>
  );
}
