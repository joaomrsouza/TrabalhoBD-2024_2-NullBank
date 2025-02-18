"use client";

import { ShowActions } from "@/components/show/show-actions";
import { api } from "@/trpc/react";

interface ShowDependenteActionsProps {
  canDelete: boolean;
  canEdit: boolean;
  matricula: number;
  nome: string;
}

export function ShowDependenteActions(props: ShowDependenteActionsProps) {
  const { canDelete, canEdit, matricula, nome } = props;

  return (
    <ShowActions
      registryId={nome}
      canEdit={canEdit}
      canDelete={canDelete}
      deleteMutationCall={api.dependentes.delete}
      deleteParams={{ matricula, nome_dependente: nome }}
    />
  );
}
