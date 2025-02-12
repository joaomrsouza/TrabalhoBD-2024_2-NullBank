import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/server/auth";
import { type Metadata } from "next";

export const metadata: Metadata = { title: "Página inicial" };

export default async function HomePage() {
  const session = await auth();

  return (
    <PageContainer>
      <PageHeader>Bem-vindo ao NullBank, {session?.user.nome}!</PageHeader>
      <Separator />
      {session?.user.cargo === "cliente" && (
        <>
          <p>
            Acessando conta{" "}
            <span className="font-bold">
              {session?.user.conta?.num_conta} ({session?.user.conta?.tipo})
            </span>
          </p>
          <p>
            Agência:{" "}
            <span className="font-bold">
              {session.user.agencia?.nome_ag} (N° {session.user.agencia?.num_ag}
              )
            </span>
          </p>
        </>
      )}
      {session?.user.cargo === "dba" && (
        <p className="font-bold">Acesso de DBA</p>
      )}
      {session?.user.cargo &&
        !["cliente", "dba"].includes(session.user.cargo as string) && (
          <>
            <p className="font-bold">
              Acesso de funcionário {session.user.cargo}
            </p>
            <p>
              Agência:{" "}
              <span className="font-bold">
                {session.user.agencia?.nome_ag} (N°{" "}
                {session.user.agencia?.num_ag})
              </span>
            </p>
          </>
        )}
    </PageContainer>
  );
}
