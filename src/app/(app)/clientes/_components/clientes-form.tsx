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
  cpf?: string;
  data?: Partial<FormData>;
}

export function ClientesForm(props: ClientesFormProps) {
  const { cpf, data } = props;

  const editando = cpf !== undefined;

  const form = useForm<FormData>({
    defaultValues: {
      cpf: editando ? cpf : "",
      create: !editando,
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
    mutationCall: api.clientes.upsert,
    async onSuccess(data, router) {
      toast.success(
        `Cliente ${data?.cpf} ${editando ? "atualizado" : "criado"} com sucesso!`,
      );
      router.push(`/clientes${editando ? "/" + cpf : ""}`);
    },
  });

  useInputMask(form, "cpf", value =>
    value ? value.replace(/\D/g, "") : value,
  );
  useInputMask(form, "rg_num", value =>
    value ? value.replace(/\D/g, "") : value,
  );
  useInputMask(form, "end_cep", value =>
    value ? value.replace(/\D/g, "") : value,
  );

  return (
    <FormContainer form={form} handleSubmit={handleSubmit}>
      <FormGroup>
        {!editando && (
          <FormInput<FormData>
            required
            name="cpf"
            maxLength={11}
            label="CPF (Somente Números)"
          />
        )}
        <FormInput<FormData> required name="nome" label="Nome" maxLength={80} />
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
          name="rg_num"
          maxLength={15}
          label="Número do RG (Somente Números)"
        />
        <FormInput<FormData>
          required
          maxLength={80}
          label="Orgão Emissor"
          name="rg_orgao_emissor"
        />
        <FormSelect<FormData>
          required
          label="UF"
          name="rg_uf"
          options={ufs.map(uf => ({ label: uf, value: uf }))}
        />
      </FormGroup>

      <FormGroup>
        <FormInput<FormData>
          required
          maxLength={80}
          name="end_tipo"
          label="Tipo de Endereço"
        />
        <FormInput<FormData>
          required
          maxLength={80}
          label="Logradouro"
          name="end_logradouro"
        />
        <FormInput<FormData>
          required
          type="number"
          label="Número"
          name="end_numero"
        />
        <FormInput<FormData>
          required
          label="Bairro"
          maxLength={80}
          name="end_bairro"
        />
      </FormGroup>

      <FormGroup>
        <FormInput<FormData>
          required
          label="Cidade"
          maxLength={80}
          name="end_cidade"
        />
        <FormSelect<FormData>
          required
          label="Estado"
          name="end_estado"
          options={ufs.map(uf => ({ label: uf, value: uf }))}
        />
        <FormInput<FormData>
          required
          maxLength={8}
          name="end_cep"
          label="CEP (Somente Números)"
        />
      </FormGroup>

      <FormActions />
    </FormContainer>
  );
}
