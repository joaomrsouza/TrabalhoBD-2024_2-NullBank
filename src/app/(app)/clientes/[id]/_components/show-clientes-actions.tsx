"use client";

import { ShowActions } from "@/components/show/show-actions";
import { api } from "@/trpc/react";

interface ShowClienteActionsProps {
  canDelete: boolean;
  canEdit: boolean;
  id: string;
}

export function ShowClienteActions(props: ShowClienteActionsProps) {
  const { canDelete, canEdit, id } = props;

  return (
    <ShowActions
      registryId={id}
      canEdit={canEdit}
      canDelete={canDelete}
      deleteParams={{ cpf: id }}
      deleteMutationCall={api.clientes.delete}
    />
  );
}
