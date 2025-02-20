import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Permission } from "@/server/services/permission";
import { ArrowLeftIcon } from "lucide-react";
import { type Metadata } from "next";
import Link from "next/link";
import { TransacoesForm } from "../_components/transacoes-form";

export const metadata: Metadata = { title: "Nova Transação" };

export default async function NovaTransacao() {
  await Permission.safeGetAuthUser(["dba"]);

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <PageHeader>Nova Transação</PageHeader>
        <Button asChild variant="ghost">
          <Link href="./">
            <ArrowLeftIcon className="mr-2 size-4" />
            Transações
          </Link>
        </Button>
      </div>
      <Separator />
      <section className="container">
        <TransacoesForm />
      </section>
    </PageContainer>
  );
}
