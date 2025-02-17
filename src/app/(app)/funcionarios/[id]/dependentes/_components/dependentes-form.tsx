"use client";

import { FormActions } from "@/components/form/form-actions";
import { FormContainer } from "@/components/form/form-container";
import { FormGroup } from "@/components/form/form-group";
import { FormInput } from "@/components/form/form-input";
import { FormSelect } from "@/components/form/form-select";
import { useHandleSubmitMutation } from "@/hooks";
import { type z } from "@/lib/zod";
import { schemas } from "@/schemas";
import { Parentescos } from "@/server/database/queries/dependentes";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { capitalize } from "lodash";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type FormData = z.infer<typeof schemas.dependente.form>;

interface DependentesFormProps {
  data?: Partial<FormData>;
  nome_dependente?: string;
}

export function DependentesForm(props: DependentesFormProps) {
  const { data, nome_dependente } = props;

  const editando = nome_dependente !== undefined;

  const form = useForm<FormData>({
    defaultValues: {
      data_nasc: "",
      funcionarios_matricula: "",
      nome_dependente: "",
      parentesco: "",
      ...data,
    },
    resolver: zodResolver(schemas.dependente.form),
  });

  const { handleSubmit } = useHandleSubmitMutation({
    form,
    mutationCall: api.dependentes.upsert, // TODO: Ajeitar esse upsert
    async onSuccess(data, router) {
      toast.success(
        `Dependente ${data?.nome_dependente} ${editando ? "atualizado" : "criado"} com sucesso!`,
      );
      // TODO: invalidade search query
      // await getQueryClient().invalidateQueries({
      //   queryKey: ["/api/auth/temPermissao"],
      // });
      router.push(`/dependentes${editando ? "/" + nome_dependente : ""}`);
    },
  });

  return (
    <FormContainer form={form} handleSubmit={handleSubmit}>
      <FormGroup>
        <FormInput<FormData>
          required
          maxLength={80}
          name="nome_dependente"
          label="Nome Dependente"
        />
        <FormInput<FormData>
          required
          type="date"
          name="data_nasc"
          label="Data Nascimento"
        />
      </FormGroup>

      <FormGroup>
        <FormInput<FormData>
          required
          name="funcionarios_matricula"
          label="Funcionário Responsável"
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
