"use client";

import { ShowActions } from "@/components/show/show-actions";
import { api } from "@/trpc/react";

interface ShowDependenteActionsProps {
  canDelete: boolean;
  canEdit: boolean;
  id: string;
}

export function ShowDependenteActions(props: ShowDependenteActionsProps) {
  const { canDelete, canEdit, id } = props;

  return (
    <ShowActions
      registryId={id}
      canEdit={canEdit}
      canDelete={canDelete}
      deleteParams={{ nome_dependente: id }}
      deleteMutationCall={api.dependentes.delete}
    />
  );
}
