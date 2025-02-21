import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Separator } from "@/components/ui/separator";
import { schemas } from "@/schemas";
import { db } from "@/server/database";
import { Permission } from "@/server/services/permission";
import { ClienteContaConjuntaTable } from "./_components/cliente-conta-conjunta-table";

export const metadata = { title: "Contas por cliente" };

interface PageProps {
  searchParams: Promise<unknown>;
}

export default async function ConsultaClienteContaConjuntaPage(
  props: PageProps,
) {
  const searchParams = await props.searchParams;

  await Permission.safeGetAuthUser(["dba"]);

  const search = schemas.consultas.clientes.clienteParams.parse(searchParams);

  const { count, data } =
    await db.queries.consultas.clientes.contasConjunta(search);

  const pageCount = Math.ceil(count / search.take);

  return (
    <PageContainer>
      <PageHeader>Contas conjunta por cliente</PageHeader>
      <Separator />
      <ClienteContaConjuntaTable data={data} pageCount={pageCount} />
    </PageContainer>
  );
}
