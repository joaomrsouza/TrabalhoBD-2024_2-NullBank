"use client";

import { FormActions } from "@/components/form/form-actions";
import { FormContainer } from "@/components/form/form-container";
import { FormGroup } from "@/components/form/form-group";
import { FormInput } from "@/components/form/form-input";
import { FormSelect } from "@/components/form/form-select";
import { useHandleSubmitMutation, useInputMask } from "@/hooks";
import { type z } from "@/lib/zod";
import { schemas } from "@/schemas";
import { ufs } from "@/server/utils/enums";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type FormData = z.infer<typeof schemas.cliente.form>;

interface ClientesFormProps {
  data?: Partial<FormData>;
  cpf?: string;
}

export function ClientesForm(props: ClientesFormProps) {
  const { data, cpf } = props;

  const editando = cpf !== undefined;

  const form = useForm<FormData>({
    defaultValues: {
     cpf: "",
     data_nasc: "",
     end_bairro: "",
     end_cep: "",
     end_cidade: "",
     end_estado: "",
     end_logradouro: "",
     end_numero: 0,
     end_tipo: "",
     nome: "",
     rg_num: "",
     rg_orgao_emissor: "",
     rg_uf: "",
      ...data,
    },
    resolver: zodResolver(schemas.cliente.form),
  });

  const { handleSubmit } = useHandleSubmitMutation({
    form,
    mutationCall: api.clientes.upsert, // TODO: Ajeitar esse upsert
    async onSuccess(data, router) {
      toast.success(
        `Cliente ${data?.cpf} ${editando ? "atualizado" : "criado"} com sucesso!`,
      );
      // TODO: invalidade search query
      // await getQueryClient().invalidateQueries({
      //   queryKey: ["/api/auth/temPermissao"],
      // });
      router.push(`/clientes${editando ? "/" + cpf : ""}`);
    },
  });

  useInputMask(form, "cpf", value => value ? value.replace(/\D/g, "") : value)
  useInputMask(form, "end_cep", value => value ? value.replace(/\D/g, "") : value)

  return (
    <FormContainer form={form} handleSubmit={handleSubmit}>

      <FormGroup>
        <FormInput<FormData> required label="CPF (Somente Números)" name="cpf" maxLength={11} />
        <FormInput<FormData> required label="Nome" name="nome" maxLength={80}/>
        <FormInput<FormData> required label="Data Nascimento" name="data_nasc" type="date" />
      </FormGroup>

      <FormGroup>
        <FormInput<FormData> required label="Número do RG" name="rg_num" maxLength={15}/>
        <FormInput<FormData> required label="Orgão Emissor" name="rg_orgao_emissor" maxLength={80}/>
        <FormSelect<FormData> required label="UF" name="rg_uf" options={ufs.map(uf =>({label:uf, value: uf}))} />
      </FormGroup>

      <FormGroup>
        <FormInput<FormData> required label="Tipo de Endereço" name="end_tipo" maxLength={80} />
        <FormInput<FormData> required label="Logradouro" name="end_logradouro" maxLength={80} />
        <FormInput<FormData> required label="Número" name="end_numero" type="number" />
        <FormInput<FormData> required label="Bairro" name="end_bairro" maxLength={80}/>
      </FormGroup>

      <FormGroup>
        <FormInput<FormData> required label="Cidade" name="end_cidade" maxLength={80} />
        <FormSelect<FormData> required label="Estado" name="end_estado" options={ufs.map(uf =>({label:uf, value: uf}))} />
        <FormInput<FormData> required label="CEP (Somente Números)" name="end_cep" maxLength={8}/>
      </FormGroup>

      <FormActions />
    </FormContainer>
  );
}
