import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Separator } from "@/components/ui/separator";
import { schemas } from "@/schemas";
import { db } from "@/server/database";
import { Permission } from "@/server/services/permission";
import { AgenciaContasCorrenteTransacoesValorTable } from "./_components/agencias-contas-transacoes-valor-table";

export const metadata = {
  title: "Valor transações contas corrente por agência",
};

interface PageProps {
  searchParams: Promise<unknown>;
}

export default async function ConsultaAgenciaContasCorrenteTransacoesValorPage(
  props: PageProps,
) {
  const searchParams = await props.searchParams;

  await Permission.safeGetAuthUser(["dba"]);

  const search =
    schemas.consultas.agencias.agenciaLastXDaysParams.parse(searchParams);

  const { count, data } =
    await db.queries.consultas.agencias.contasCorrenteTransacoesValor(search);

  const pageCount = Math.ceil(count / search.take);

  return (
    <PageContainer>
      <PageHeader>Qtd. transações contas corrente por agência</PageHeader>
      <Separator />
      <AgenciaContasCorrenteTransacoesValorTable
        data={data}
        pageCount={pageCount}
      />
    </PageContainer>
  );
}
