import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Separator } from "@/components/ui/separator";
import { schemas } from "@/schemas";
import { db } from "@/server/database";
import { Permission } from "@/server/services/permission";
import { ClienteContaTransacoesQtdTable } from "./_components/cliente-conta-transacoes-qtd-table";

export const metadata = { title: "Qtd. transações contas por cliente" };

interface PageProps {
  searchParams: Promise<unknown>;
}

export default async function ConsultaClienteContaTransacoesQtdPage(
  props: PageProps,
) {
  const searchParams = await props.searchParams;

  await Permission.safeGetAuthUser(["dba"]);

  const search =
    schemas.consultas.clientes.clienteLastXDaysParams.parse(searchParams);

  const { count, data } =
    await db.queries.consultas.clientes.contasTransacoesQtd(search);

  const pageCount = Math.ceil(count / search.take);

  return (
    <PageContainer>
      <PageHeader>Qtd. transações contas conjunta por cliente</PageHeader>
      <Separator />
      <ClienteContaTransacoesQtdTable data={data} pageCount={pageCount} />
    </PageContainer>
  );
}
