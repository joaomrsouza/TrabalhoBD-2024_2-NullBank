"use client";

import { ShowActions } from "@/components/show/show-actions";
import { api } from "@/trpc/react";

interface ShowFuncionarioActionsProps {
  canDelete: boolean;
  canEdit: boolean;
  id: number;
}

export function ShowFuncionarioActions(props: ShowFuncionarioActionsProps) {
  const { canDelete, canEdit, id } = props;

  return (
    <ShowActions
      registryId={id}
      canEdit={canEdit}
      canDelete={canDelete}
      deleteParams={{ matricula: id }}
      deleteMutationCall={api.funcionarios.delete}
    />
  );
}
