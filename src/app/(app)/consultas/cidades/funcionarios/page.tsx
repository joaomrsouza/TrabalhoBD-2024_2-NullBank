import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Separator } from "@/components/ui/separator";
import { schemas } from "@/schemas";
import { db } from "@/server/database";
import { Permission } from "@/server/services/permission";
import { CidadeFuncionarioTable } from "./_components/cidade-funcionario-table";

export const metadata = { title: "Funcionários por cidade" };

interface PageProps {
  searchParams: Promise<unknown>;
}

export default async function ConsultaCidadeFuncionarioPage(props: PageProps) {
  const searchParams = await props.searchParams;

  await Permission.safeGetAuthUser(["dba"]);

  const search = schemas.consultas.cidades.cidadesParams.parse(searchParams);

  const { count, data } =
    await db.queries.consultas.cidades.funcionarios(search);

  const pageCount = Math.ceil(count / search.take);

  return (
    <PageContainer>
      <PageHeader>Funcionários por cidade</PageHeader>
      <Separator />
      <CidadeFuncionarioTable data={data} pageCount={pageCount} />
    </PageContainer>
  );
}
