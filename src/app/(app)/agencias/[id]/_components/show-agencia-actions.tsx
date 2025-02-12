"use client";

import { ShowActions } from "@/components/show/show-actions";
import { api } from "@/trpc/react";

interface ShowAgenciaActionsProps {
  canDelete: boolean;
  canEdit: boolean;
  id: number;
}

export function ShowAgenciaActions(props: ShowAgenciaActionsProps) {
  const { canDelete, canEdit, id } = props;

  return (
    <ShowActions
      registryId={id}
      canEdit={canEdit}
      canDelete={canDelete}
      deleteParams={{ num_ag: id }}
      deleteMutationCall={api.agencias.delete}
    />
  );
}
