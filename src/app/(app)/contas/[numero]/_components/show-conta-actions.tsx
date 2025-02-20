"use client";

import { ShowActions } from "@/components/show/show-actions";
import { api } from "@/trpc/react";

interface ShowContaActionsProps {
  canDelete: boolean;
  canEdit: boolean;
  numero: number;
}

export function ShowContaActions(props: ShowContaActionsProps) {
  const { canDelete, canEdit, numero } = props;

  return (
    <ShowActions
      canEdit={canEdit}
      registryId={numero}
      canDelete={canDelete}
      deleteParams={{ num_conta: numero }}
      deleteMutationCall={api.contas.delete}
    />
  );
}
