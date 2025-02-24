"use client";

import { FormActions } from "@/components/form/form-actions";
import { FormContainer } from "@/components/form/form-container";
import { FormGroup } from "@/components/form/form-group";
import { FormInput } from "@/components/form/form-input";
import { useHandleSubmitMutation } from "@/hooks";
import { type z } from "@/lib/zod";
import { schemas } from "@/schemas";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type FormData = z.infer<typeof schemas.agencia.form>;

interface AgenciasFormProps {
  data?: Partial<FormData>;
  num_ag?: number;
}

export function AgenciasForm(props: AgenciasFormProps) {
  const { data, num_ag } = props;

  const editando = num_ag !== undefined;

  const form = useForm<FormData>({
    defaultValues: {
      cidade_ag: "",
      nome_ag: "",
      num_ag,
      ...data,
    },
    resolver: zodResolver(schemas.agencia.form),
  });

  const { handleSubmit } = useHandleSubmitMutation({
    form,
    mutationCall: api.agencias.upsert,
    async onSuccess(data, router) {
      toast.success(
        `Agência ${data?.nome_ag} ${editando ? "atualizada" : "criada"} com sucesso!`,
      );
      router.push(`/agencias${data?.num_ag ? "/" + data.num_ag : ""}`);
    },
  });

  return (
    <FormContainer form={form} handleSubmit={handleSubmit}>
      <FormGroup>
        <FormInput<FormData> required label="Nome" name="nome_ag" />
        <FormInput<FormData> required label="Cidade" name="cidade_ag" />
      </FormGroup>

      <FormActions />
    </FormContainer>
  );
}
