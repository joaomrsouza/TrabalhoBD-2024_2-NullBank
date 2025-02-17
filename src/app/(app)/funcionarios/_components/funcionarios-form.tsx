"use client";

import { FormActions } from "@/components/form/form-actions";
import { FormContainer } from "@/components/form/form-container";
import { FormGroup } from "@/components/form/form-group";
import { FormInput } from "@/components/form/form-input";
import { FormSelect } from "@/components/form/form-select";
import { useHandleSubmitMutation } from "@/hooks";
import { type z } from "@/lib/zod";
import { schemas } from "@/schemas";
import { Cargos, Generos } from "@/server/database/queries/funcionarios";
import { api } from "@/trpc/react";
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
      agencias_num_ag: 0,
      cidade: "",
      data_nasc: "",
      endereco: "",
      nome: "",
      salario: 0,
      senha: "",
      ...data,
    },
    resolver: zodResolver(schemas.funcionario.form),
  });

  const { handleSubmit } = useHandleSubmitMutation({
    form,
    mutationCall: api.funcionarios.upsert, // TODO: Ajeitar esse upsert
    async onSuccess(data, router) {
      toast.success(
        `Funcionário ${data?.matricula} ${editando ? "atualizado" : "criado"} com sucesso!`,
      );
      // TODO: invalidade search query
      // await getQueryClient().invalidateQueries({
      //   queryKey: ["/api/auth/temPermissao"],
      // });
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
        <FormInput<FormData>
          required
          name="agencias_num_ag"
          label="Número da Agência"
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

      <FormActions />
    </FormContainer>
  );
}
