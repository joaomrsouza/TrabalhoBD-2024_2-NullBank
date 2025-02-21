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
import { TiposTransacao } from "@/utils/enums";
import { zodResolver } from "@hookform/resolvers/zod";
import { capitalize } from "lodash";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type FormData = z.infer<typeof schemas.transacao.form>;

interface TransacoesFormProps {
  data?: Partial<FormData>;
  num_transacao?: number;
}

export function TransacoesForm(props: TransacoesFormProps) {
  const { data, num_transacao } = props;

  const editando = num_transacao !== undefined;

  const form = useForm<FormData>({
    defaultValues: {
      contas_num_conta_destino: null,
      contas_num_conta_origem: "",
      valor: 0,
      ...data,
      num_transacao,
    },
    resolver: zodResolver(schemas.transacao.form),
  });

  const { handleSubmit } = useHandleSubmitMutation({
    form,
    mutationCall: api.transacoes.upsert,
    async onSuccess(data, router) {
      toast.success(
        `Transação ${data?.num_transacao} ${editando ? "atualizada" : "criada"} com sucesso!`,
      );
      router.push(`/transacoes${editando ? "/" + num_transacao : ""}`);
    },
  });

  const [watchTipo] = form.watch(["tipo"]);

  const temDestino = watchTipo === "transferência" || watchTipo === "PIX";
  const contaDestinoSelectProps = useSearchQuery("conta").selectProps;

  return (
    <FormContainer form={form} handleSubmit={handleSubmit}>
      <FormGroup>
        <FormSelect<FormData>
          required
          name="tipo"
          label="Tipo Transação"
          options={TiposTransacao.map(tt => ({
            label: capitalize(tt),
            value: tt,
          }))}
        />
        <FormSelect<FormData>
          required
          name="contas_num_conta_origem"
          label={temDestino ? "Conta Origem" : "Conta"}
          {...useSearchQuery("conta").selectProps}
        />
      </FormGroup>

      <FormGroup>
        <FormInput<FormData>
          required
          min={0}
          step="0.01"
          name="valor"
          label="Valor"
          type="number"
        />
        {temDestino && (
          <FormSelect<FormData>
            label="Conta Destino"
            name="contas_num_conta_destino"
            {...contaDestinoSelectProps}
          />
        )}
      </FormGroup>

      <FormActions />
    </FormContainer>
  );
}
