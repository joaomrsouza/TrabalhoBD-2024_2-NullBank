import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { ShowField } from "@/components/show/show-field";
import { ShowGroup } from "@/components/show/show-group";
import { ShowSection } from "@/components/show/show-section";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { schemas } from "@/schemas";
import { db } from "@/server/database";
import { Permission } from "@/server/services/permission";
import { formatData } from "@/utils/formaters";
import { ArrowLeftIcon } from "lucide-react";
import { type Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShowClienteActions } from "./_components/show-clientes-actions";

interface PageProps {
  params: Promise<{ cpf: string }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { cpf } = await props.params;

  const notFound = { title: "Cliente não encontrado" };

  const cpfValido = schemas.string.safeParse(cpf);
  if (!cpfValido.success) return notFound;

  const cliente = await db.queries.clientes.getNomeByCpf(cpfValido.data);

  if (!cliente) return notFound;

  return { title: cliente.nome };
}

export default async function ExibirCliente(props: PageProps) {
  const { cpf } = await props.params;

  const user = await Permission.safeGetAuthUser(["dba"]);

  const cpfValido = schemas.string.safeParse(cpf);
  if (!cpfValido.success) return notFound();

  const cliente = await db.queries.clientes.getByCpf(cpfValido.data);

  if (!cliente) return notFound();

  const [emails, telefones] = await Promise.all([
    db.queries.clientes.getEmailsByCPF(cpfValido.data),
    db.queries.clientes.getTelefonesByCPF(cpfValido.data),
  ]);

  const canEdit = Permission.temPermissaoDeAcesso(["dba"], user);
  const canDelete = Permission.temPermissaoDeAcesso(["dba"], user);

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <PageHeader>
          {cliente.nome} ({cliente.cpf})
        </PageHeader>
        <Button asChild variant="ghost">
          <Link href="./">
            <ArrowLeftIcon className="mr-2 size-4" />
            Clientes
          </Link>
        </Button>
      </div>
      <Separator />

      <ShowClienteActions
        canEdit={canEdit}
        cpf={cpfValido.data}
        canDelete={canDelete}
      />
      <ShowSection title="Cadastro">
        <ShowGroup>
          <ShowField label="CPF">{cliente.cpf}</ShowField>
          <ShowField label="Nome">{cliente.nome}</ShowField>
          <ShowField label="Data Nascimento">
            {formatData(cliente.data_nasc)}
          </ShowField>
        </ShowGroup>

        <ShowGroup>
          <ShowField label="Número do RG">{cliente.rg_num}</ShowField>
          <ShowField label="Órgão Emissor">
            {cliente.rg_orgao_emissor}
          </ShowField>
          <ShowField label="UF">{cliente.rg_uf}</ShowField>
        </ShowGroup>
      </ShowSection>

      <ShowSection title="Endereço">
        <ShowGroup>
          <ShowField label="Tipo de Endereço">{cliente.end_tipo}</ShowField>
          <ShowField label="Logradouro">{cliente.end_logradouro}</ShowField>
          <ShowField label="Número">{cliente.end_numero}</ShowField>
          <ShowField label="Bairro">{cliente.end_bairro}</ShowField>
        </ShowGroup>

        <ShowGroup>
          <ShowField label="Cidade">{cliente.end_cidade}</ShowField>
          <ShowField label="Estado">{cliente.end_estado}</ShowField>
          <ShowField label="CEP">{cliente.end_cep}</ShowField>
        </ShowGroup>
      </ShowSection>

      {!!emails.length && (
        <ShowSection title="E-mails">
          {emails.map(({ email, tipo }, index) => (
            <ShowGroup key={email}>
              <ShowField label={`Tipo de E-mail ${index + 1}`}>
                {tipo}
              </ShowField>
              <ShowField label={`E-mail ${index + 1}`}>{email}</ShowField>
            </ShowGroup>
          ))}
        </ShowSection>
      )}

      {!!telefones.length && (
        <ShowSection title="Telefones">
          {telefones.map(({ telefone, tipo }, index) => (
            <ShowGroup key={telefone}>
              <ShowField label={`Tipo de Telefone ${index + 1}`}>
                {tipo}
              </ShowField>
              <ShowField label={`Telefone ${index + 1}`}>{telefone}</ShowField>
            </ShowGroup>
          ))}
        </ShowSection>
      )}

      <ShowClienteActions
        canEdit={canEdit}
        cpf={cpfValido.data}
        canDelete={canDelete}
      />
    </PageContainer>
  );
}
