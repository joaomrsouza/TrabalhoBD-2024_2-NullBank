import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Separator } from "@/components/ui/separator";
import { schemas } from "@/schemas";
import { db } from "@/server/database";
import { Permission } from "@/server/services/permission";
import { AgenciaFuncionarioTable } from "./_components/agencia-funcionario-table";

export const metadata = { title: "Funcionários por agência" };

interface PageProps {
  searchParams: Promise<unknown>;
}

export default async function ConsultaAgenciaFuncionariosPage(
  props: PageProps,
) {
  const searchParams = await props.searchParams;

  await Permission.safeGetAuthUser(["dba"]);

  const search =
    schemas.consultas.agencias.funcionariosParams.parse(searchParams);

  const data = await db.queries.consultas.agencias.funcionarios(search);

  return (
    <PageContainer>
      <PageHeader>Funcionários por agência</PageHeader>
      <Separator />
      <AgenciaFuncionarioTable data={data} pageCount={1} />
    </PageContainer>
  );
}
