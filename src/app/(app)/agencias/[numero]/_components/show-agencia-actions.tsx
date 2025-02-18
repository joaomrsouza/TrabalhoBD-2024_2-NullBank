"use client";

import { ShowActions } from "@/components/show/show-actions";
import { api } from "@/trpc/react";

interface ShowAgenciaActionsProps {
  canDelete: boolean;
  canEdit: boolean;
  numero: number;
}

export function ShowAgenciaActions(props: ShowAgenciaActionsProps) {
  const { canDelete, canEdit, numero } = props;

  return (
    <ShowActions
      canEdit={canEdit}
      registryId={numero}
      canDelete={canDelete}
      deleteParams={{ num_ag: numero }}
      deleteMutationCall={api.agencias.delete}
    />
  );
}
