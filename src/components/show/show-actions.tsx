"use client";

import { useConfirmDialog } from "@/hooks";
import { type ResolverDef } from "@/trpc/react";
import { EllipsisIcon, SquarePenIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type DecoratedMutation } from "node_modules/@trpc/react-query/dist/createTRPCReact";
import React from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "../confirm-dialog";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface ShowActionsProps<ReturnData extends ResolverDef> {
  canDelete: boolean;
  canEdit: boolean;
  children?: React.ReactNode;
  deleteMutationCall: DecoratedMutation<ReturnData>;
  deleteParams: ReturnData["input"];
  registryId: number | string;
}

export function ShowActions<ReturnData extends ResolverDef>(
  props: ShowActionsProps<ReturnData>,
) {
  const {
    canDelete,
    canEdit,
    children,
    deleteMutationCall,
    deleteParams,
    registryId,
  } = props;

  const router = useRouter();

  const {
    close: handleDeleteDialogClose,
    isOpen: isDeleteDialogOpen,
    open: handleDeleteDialogOpen,
  } = useConfirmDialog();

  const mutation = deleteMutationCall.useMutation({
    onError({ message }) {
      toast.error("Ocorreu um erro ao excluir o registro.", {
        description: message,
      });
      handleDeleteDialogClose();
    },
    async onSuccess() {
      toast.success("Registro excluído com sucesso.");
      handleDeleteDialogClose();
      router.replace("./");
    },
  });

  const handleDeleteDialogConfirm = React.useCallback(async () => {
    await mutation.mutateAsync(deleteParams);
  }, [deleteParams, mutation]);

  if (!canDelete && !canEdit && !children) return null;

  return (
    <div className="flex flex-row-reverse flex-wrap gap-2">
      {canDelete && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              aria-label="Abrir menu"
              className="data-[state=open]:bg-muted"
            >
              <EllipsisIcon className="size-4" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="text-destructive"
              onClick={handleDeleteDialogOpen}
            >
              <TrashIcon className="mr-2 size-4" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      {canEdit && (
        <Button asChild variant="secondary">
          <Link href={`./${registryId}/editar`}>
            <SquarePenIcon className="mr-2 size-4" />
            Editar
          </Link>
        </Button>
      )}
      {children}
      {canDelete && (
        <ConfirmDialog
          open={isDeleteDialogOpen}
          onCancel={handleDeleteDialogClose}
          onConfirm={handleDeleteDialogConfirm}
        >
          Você tem certeza que deseja excluir este registro?{" "}
          <span className="font-bold">Está ação não pode ser desfeita.</span>
        </ConfirmDialog>
      )}
    </div>
  );
}
