"use client";

import { ShowActions } from "@/components/show/show-actions";
import { api } from "@/trpc/react";

interface ShowTransacaoActionsProps {
  canDelete: boolean;
  canEdit: boolean;
  num_transacao: number;
}

export function ShowTransacaoActions(props: ShowTransacaoActionsProps) {
  const { canDelete, canEdit, num_transacao } = props;

  return (
    <ShowActions
      canEdit={canEdit}
      canDelete={canDelete}
      registryId={num_transacao}
      deleteParams={{ num_transacao }}
      deleteMutationCall={api.transacoes.delete}
    />
  );
}
