import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Permission } from "@/server/services/permission";
import { ArrowLeftIcon } from "lucide-react";
import { type Metadata } from "next";
import Link from "next/link";
import { ContasForm } from "../_components/contas-form";

export const metadata: Metadata = { title: "Nova Conta" };

export default async function NovaConta() {
  await Permission.safeGetAuthUser(["dba"]);

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <PageHeader>Nova Conta</PageHeader>
        <Button asChild variant="ghost">
          <Link href="./">
            <ArrowLeftIcon className="mr-2 size-4" />
            Contas
          </Link>
        </Button>
      </div>
      <Separator />
      <section className="container">
        <ContasForm />
      </section>
    </PageContainer>
  );
}
