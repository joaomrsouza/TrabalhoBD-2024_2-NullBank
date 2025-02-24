"use client";

import { ShowActions } from "@/components/show/show-actions";
import { api } from "@/trpc/react";

interface ShowClienteActionsProps {
  canDelete: boolean;
  canEdit: boolean;
  cpf: string;
}

export function ShowClienteActions(props: ShowClienteActionsProps) {
  const { canDelete, canEdit, cpf } = props;

  return (
    <ShowActions
      registryId={cpf}
      canEdit={canEdit}
      canDelete={canDelete}
      deleteParams={{ cpf }}
      deleteMutationCall={api.clientes.delete}
    />
  );
}
