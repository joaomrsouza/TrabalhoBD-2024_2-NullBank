import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Permission } from "@/server/services/permission";
import { ArrowLeftIcon } from "lucide-react";
import { type Metadata } from "next";
import Link from "next/link";
import { ClientesForm } from "../_components/clientes-form";

export const metadata: Metadata = { title: "Novo Cliente" };

export default async function NovoCliente() {
  await Permission.safeGetAuthUser(["dba"]);

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <PageHeader>Novo Cliente</PageHeader>
        <Button asChild variant="ghost">
          <Link href="./">
            <ArrowLeftIcon className="mr-2 size-4" />
            Clientes
          </Link>
        </Button>
      </div>
      <Separator />
      <section className="container">
        <ClientesForm />
      </section>
    </PageContainer>
  );
}
