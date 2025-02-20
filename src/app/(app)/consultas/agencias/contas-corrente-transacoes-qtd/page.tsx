import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Separator } from "@/components/ui/separator";
import { schemas } from "@/schemas";
import { db } from "@/server/database";
import { Permission } from "@/server/services/permission";
import { AgenciaContasCorrenteTransacoesQtdTable } from "./_components/agencias-contas-transacoes-qtd-table";

export const metadata = {
  title: "Qtd. transações contas corrente por agência",
};

interface PageProps {
  searchParams: Promise<unknown>;
}

export default async function ConsultaAgenciaContasCorrenteTransacoesQtdPage(
  props: PageProps,
) {
  const searchParams = await props.searchParams;

  await Permission.safeGetAuthUser(["dba"]);

  const search =
    schemas.consultas.agencias.agenciaLastXDaysParams.parse(searchParams);

  const { count, data } =
    await db.queries.consultas.agencias.contasCorrenteTransacoesQtd(search);

  const pageCount = Math.ceil(count / search.take);

  return (
    <PageContainer>
      <PageHeader>Qtd. transações contas corrente por agência</PageHeader>
      <Separator />
      <AgenciaContasCorrenteTransacoesQtdTable
        data={data}
        pageCount={pageCount}
      />
    </PageContainer>
  );
}
