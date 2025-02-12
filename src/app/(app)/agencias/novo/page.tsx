import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Permission } from "@/server/services/permission";
import { ArrowLeftIcon } from "lucide-react";
import { type Metadata } from "next";
import Link from "next/link";
import { AgenciasForm } from "../_components/agencias-form";

export const metadata: Metadata = { title: "Novo Agência" };

export default async function NovaAgencia() {
  await Permission.safeGetAuthUser(["dba"]);

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <PageHeader>Nova Agência</PageHeader>
        <Button asChild variant="ghost">
          <Link href="./">
            <ArrowLeftIcon className="mr-2 size-4" />
            Agências
          </Link>
        </Button>
      </div>
      <Separator />
      <section className="container">
        <AgenciasForm />
      </section>
    </PageContainer>
  );
}
