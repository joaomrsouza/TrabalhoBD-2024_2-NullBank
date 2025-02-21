import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Separator } from "@/components/ui/separator";
import { schemas } from "@/schemas";
import { db } from "@/server/database";
import { Permission } from "@/server/services/permission";
import { ClienteContaTransacoesValorTable } from "./_components/cliente-conta-transacoes-valor-table";

export const metadata = { title: "Valor transações contas por cliente" };

interface PageProps {
  searchParams: Promise<unknown>;
}

export default async function ConsultaClienteContaTransacoesValorPage(
  props: PageProps,
) {
  const searchParams = await props.searchParams;

  await Permission.safeGetAuthUser(["dba"]);

  const search =
    schemas.consultas.clientes.clienteLastXDaysParams.parse(searchParams);

  const { count, data } =
    await db.queries.consultas.clientes.contasTransacoesValor(search);

  const pageCount = Math.ceil(count / search.take);

  return (
    <PageContainer>
      <PageHeader>Valor transações contas conjunta por cliente</PageHeader>
      <Separator />
      <ClienteContaTransacoesValorTable data={data} pageCount={pageCount} />
    </PageContainer>
  );
}
