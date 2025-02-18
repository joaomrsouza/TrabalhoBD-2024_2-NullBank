"use client";

import { ShowActions } from "@/components/show/show-actions";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { UsersIcon } from "lucide-react";
import Link from "next/link";

interface ShowFuncionarioActionsProps {
  canDelete: boolean;
  canEdit: boolean;
  matricula: number;
}

export function ShowFuncionarioActions(props: ShowFuncionarioActionsProps) {
  const { canDelete, canEdit, matricula } = props;

  return (
    <ShowActions
      canEdit={canEdit}
      canDelete={canDelete}
      registryId={matricula}
      deleteParams={{ matricula: matricula }}
      deleteMutationCall={api.funcionarios.delete}
    >
      <Button asChild variant="secondary">
        <Link href={`./${matricula}/dependentes`}>
          <UsersIcon className="mr-2 size-4" />
          Dependentes
        </Link>
      </Button>
    </ShowActions>
  );
}
