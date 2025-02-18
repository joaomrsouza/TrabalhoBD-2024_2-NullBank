"use client";

import { FormActions } from "@/components/form/form-actions";
import { FormContainer } from "@/components/form/form-container";
import { FormGroup } from "@/components/form/form-group";
import { FormInput } from "@/components/form/form-input";
import { FormSelect } from "@/components/form/form-select";
import { useHandleSubmitMutation } from "@/hooks";
import { type z } from "@/lib/zod";
import { schemas } from "@/schemas";
import { api } from "@/trpc/react";
import { Parentescos } from "@/utils/enums";
import { zodResolver } from "@hookform/resolvers/zod";
import { capitalize } from "lodash";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type FormData = z.infer<typeof schemas.dependente.form>;

interface DependentesFormProps {
  data?: Partial<FormData>;
  matricula: number;
  nome_dependente?: string;
}

export function DependentesForm(props: DependentesFormProps) {
  const { data, matricula, nome_dependente } = props;

  const editando = nome_dependente !== undefined;

  const form = useForm<FormData>({
    defaultValues: {
      data_nasc: "",
      ...data,
      create: !editando,
      matricula,
      nome_dependente: editando ? nome_dependente : "",
    },
    resolver: zodResolver(schemas.dependente.form),
  });

  const { handleSubmit } = useHandleSubmitMutation({
    form,
    mutationCall: api.dependentes.upsert,
    async onSuccess(data, router) {
      toast.success(
        `Dependente ${data?.nome_dependente} ${editando ? "atualizado" : "criado"} com sucesso!`,
      );
      router.push(editando ? "./" : "./" + data?.nome_dependente);
    },
  });

  return (
    <FormContainer form={form} handleSubmit={handleSubmit}>
      {!editando && (
        <FormInput<FormData>
          required
          maxLength={80}
          name="nome_dependente"
          label="Nome Dependente"
        />
      )}

      <FormGroup>
        <FormInput<FormData>
          required
          type="date"
          name="data_nasc"
          label="Data Nascimento"
        />
        <FormSelect<FormData>
          required
          name="parentesco"
          label="Parentesco"
          options={Parentescos.map(p => ({
            label: capitalize(p),
            value: p,
          }))}
        />
      </FormGroup>

      <FormActions />
    </FormContainer>
  );
}
