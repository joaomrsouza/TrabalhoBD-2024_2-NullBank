"use client";

import { FormActions } from "@/components/form/form-actions";
import { FormContainer } from "@/components/form/form-container";
import { FormGroup } from "@/components/form/form-group";
import { FormInput } from "@/components/form/form-input";
import { FormMultiSelect } from "@/components/form/form-multi-select";
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
      clientes_cpf: [],
      data_aniversario: "",
      funcionarios_matricula_gerente: "",
      limite_credito: 0,
      senha: "",
      taxa_juros: 0,
      ...data,
      num_conta,
    },
    resolver: zodResolver(schemas.conta.form),
  });

  const [watchTipo] = form.watch(["tipo"]);

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
        <FormSelect<FormData>
          required
          label="Gerente"
          name="funcionarios_matricula_gerente"
          {...useSearchQuery("gerente").selectProps}
        />
        <FormMultiSelect<FormData>
          label="Cliente(s)"
          name="clientes_cpf"
          {...useSearchQuery("cliente").selectProps}
        />
      </FormGroup>

      <FormGroup>
        <FormSelect<FormData>
          required
          name="tipo"
          label="Tipo Conta"
          options={TiposConta.map(tc => ({ label: capitalize(tc), value: tc }))}
        />
        {watchTipo === "corrente" && (
          <FormInput<FormData>
            required
            type="date"
            name="data_aniversario"
            label="Data aniversário da conta"
          />
        )}
        {watchTipo === "especial" && (
          <FormInput<FormData>
            required
            min={0}
            step="0.01"
            type="number"
            name="limite_credito"
            label="Limite de crédito"
          />
        )}
        {watchTipo === "poupança" && (
          <FormInput<FormData>
            required
            min={0}
            step="0.01"
            type="number"
            name="taxa_juros"
            label="Taxa de juros"
          />
        )}
      </FormGroup>

      <FormInput<FormData>
        name="senha"
        label="Senha"
        type="password"
        required={!editando}
      />

      <FormActions />
    </FormContainer>
  );
}
