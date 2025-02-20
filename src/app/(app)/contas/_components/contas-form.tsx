"use client";

import { FormActions } from "@/components/form/form-actions";
import { FormContainer } from "@/components/form/form-container";
import { FormGroup } from "@/components/form/form-group";
import { FormInput } from "@/components/form/form-input";
import { FormSelect } from "@/components/form/form-select";
import { useHandleSubmitMutation, useSearchQuery } from "@/hooks";
import { type z } from "@/lib/zod";
import { schemas } from "@/schemas";
import { api } from "@/trpc/react";
import { TiposConta } from "@/utils/enums";
import { zodResolver } from "@hookform/resolvers/zod";
import { capitalize } from "lodash";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type FormData = z.infer<typeof schemas.conta.form>;

interface ContasFormProps {
  data?: Partial<FormData>;
  num_conta?: number;
}

export function ContasForm(props: ContasFormProps) {
  const { data, num_conta } = props;

  const editando = num_conta !== undefined;

  const form = useForm<FormData>({
    defaultValues: {
      agencias_num_ag: "",
      funcionarios_matricula_gerente: "",
      senha: "",
      ...data,
      num_conta,
    },
    resolver: zodResolver(schemas.conta.form),
  });

  const { handleSubmit } = useHandleSubmitMutation({
    form,
    mutationCall: api.contas.upsert,
    async onSuccess(data, router) {
      toast.success(
        `Conta ${data?.num_conta} ${editando ? "atualizada" : "criada"} com sucesso!`,
      );
      router.push(`/contas${editando ? "/" + num_conta : ""}`);
    },
  });

  return (
    <FormContainer form={form} handleSubmit={handleSubmit}>
      <FormGroup>
        <FormSelect<FormData>
          required
          label="Agência"
          name="agencias_num_ag"
          {...useSearchQuery("agencia").selectProps}
        />
        <FormInput<FormData> required label="Gerente" name="funcionarios_matricula_gerente" />
      </FormGroup>

      <FormGroup>
        <FormSelect<FormData> required name="tipo" label="Tipo Conta" options={TiposConta.map(tc => ({ label: capitalize(tc), value: tc }))} />
        <FormInput<FormData> name="senha" label="Senha"
        type="password"
        required={!editando} />
      </FormGroup>
      <FormActions />
    </FormContainer>
  );
}
