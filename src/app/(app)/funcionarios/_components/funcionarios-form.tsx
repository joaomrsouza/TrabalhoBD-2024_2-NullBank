"use client";

import { FormActions } from "@/components/form/form-actions";
import { FormContainer } from "@/components/form/form-container";
import { FormGroup } from "@/components/form/form-group";
import { FormInput } from "@/components/form/form-input";
import { FormSelect } from "@/components/form/form-select";
import { useHandleSubmitMutation, useSearchQuery } from "@/hooks";
import { z } from "@/lib/zod";
import { schemas } from "@/schemas";
import { api } from "@/trpc/react";
import { Cargos, Generos } from "@/utils/enums";
import { zodResolver } from "@hookform/resolvers/zod";
import { capitalize } from "lodash";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type FormData = z.infer<typeof schemas.funcionario.form>;

interface FuncionariosFormProps {
  data?: Partial<FormData>;
  matricula?: number;
}

export function FuncionariosForm(props: FuncionariosFormProps) {
  const { data, matricula } = props;

  const editando = matricula !== undefined;

  const form = useForm<FormData>({
    defaultValues: {
      cidade: "",
      data_nasc: "",
      endereco: "",
      nome: "",
      salario: 0,
      senha: "",
      ...data,
      matricula,
    },
    resolver: zodResolver(
      editando
        ? schemas.funcionario.form
        : schemas.funcionario.form.extend({
            senha: z.string().trim().min(1, "Senha é obrigatória"),
          }),
    ),
  });

  const { handleSubmit } = useHandleSubmitMutation({
    form,
    mutationCall: api.funcionarios.upsert,
    async onSuccess(data, router) {
      toast.success(
        `Funcionário ${data?.matricula} ${editando ? "atualizado" : "criado"} com sucesso!`,
      );
      router.push(`/funcionarios${editando ? "/" + matricula : ""}`);
    },
  });

  return (
    <FormContainer form={form} handleSubmit={handleSubmit}>
      <FormGroup>
        <FormInput<FormData> required name="nome" label="Nome" maxLength={80} />
        <FormInput<FormData>
          required
          type="date"
          name="data_nasc"
          label="Data Nascimento"
        />
        <FormSelect<FormData>
          required
          name="genero"
          label="Gênero"
          options={Generos.map(g => ({
            label: capitalize(g),
            value: g,
          }))}
        />
      </FormGroup>

      <FormGroup>
        <FormSelect<FormData>
          required
          label="Agência"
          name="agencias_num_ag"
          {...useSearchQuery("agencia").selectProps}
        />
        <FormSelect<FormData>
          required
          name="cargo"
          label="Cargo"
          options={Cargos.map(c => ({
            label: capitalize(c),
            value: c,
          }))}
        />
        <FormInput<FormData>
          required
          min={0}
          step="0.01"
          type="number"
          name="salario"
          label="Salário"
        />
      </FormGroup>

      <FormGroup>
        <FormInput<FormData>
          required
          maxLength={80}
          name="endereco"
          label="Endereço"
        />
        <FormInput<FormData>
          required
          name="cidade"
          label="Cidade"
          maxLength={80}
        />
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
