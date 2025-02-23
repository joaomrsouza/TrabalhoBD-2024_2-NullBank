"use client";

import { FormInput } from "@/components/form/form-input";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useHandleSubmitAction } from "@/hooks";
import { cn } from "@/lib/utils";
import { type z } from "@/lib/zod";
import { schemas } from "@/schemas";
import { actions } from "@/server/actions";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon, LoaderCircleIcon, LogInIcon } from "lucide-react";
import React, { useEffect, useMemo } from "react";
import { useForm, useFormContext } from "react-hook-form";

type Step = "conta" | "identificacao" | "senha";

type FormData = z.infer<typeof schemas.login.form>;

export function ClienteLoginForm() {
  const [step, setStep] = React.useState<Step>("identificacao");

  const form = useForm<FormData>({
    defaultValues: { conta: null, login: "", senha: "" },
    resolver: zodResolver(schemas.login.form),
  });

  const [watchLogin, watchConta] = form.watch(["login", "conta"]);

  const cleanedCpf = React.useMemo(
    () => (watchLogin ? watchLogin.replace(/\D/g, "").trim() : ""),
    [watchLogin],
  );

  const { data } = api.contas.getContasClienteBasic.useQuery(
    { cpf: cleanedCpf },
    {
      enabled: cleanedCpf.length === 11,
    },
  );

  useEffect(() => {
    if (step === "conta" && data?.length === 0) {
      form.setError("root", { message: "Não existem contas neste CPF" });
      setStep("identificacao");
    }
  }, [data, form, step]);

  const handleClickContaCard = React.useCallback(
    (conta: number) => {
      form.setValue("conta", String(conta));
    },
    [form],
  );

  const handleClickNextStep = React.useCallback(() => {
    setStep(st => {
      if (st === "identificacao") return "conta";
      if (st === "conta") return "senha";
      return st;
    });
  }, []);

  const nextStepReady = useMemo(
    () =>
      (step === "identificacao" && cleanedCpf.length === 11) ||
      (step === "conta" && watchConta !== null),
    [cleanedCpf.length, step, watchConta],
  );

  const { handleSubmit } = useHandleSubmitAction({
    action: actions.auth.login,
    form,
    onSuccess(_, router) {
      router.push("/");
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Acesso de Clientes
              <ThemeToggle />
            </CardTitle>
          </CardHeader>

          <CardContent>
            {step === "identificacao" && (
              <FormInput<FormData> name="login" label="CPF (somente números)" />
            )}

            {step === "conta" && (
              <>
                <p>
                  <span className="font-bold">Contas do cliente:</span>{" "}
                  {cleanedCpf}
                </p>
                {data?.map(conta => (
                  <ContaCard
                    key={conta.num_conta}
                    conta={conta.num_conta}
                    onClick={handleClickContaCard}
                    agencia={conta.agencias_num_ag}
                    selected={Number(watchConta) === conta.num_conta}
                  />
                ))}
              </>
            )}

            {step === "senha" && (
              <>
                <p>
                  <span className="font-bold">Cliente:</span> {cleanedCpf}
                </p>
                <p>
                  <span className="font-bold">Conta:</span> {watchConta}
                </p>

                <FormInput<FormData>
                  name="senha"
                  type="password"
                  label="Senha da conta"
                />
              </>
            )}
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.root?.message}
            </p>

            <div className="flex w-full flex-row-reverse">
              {step !== "senha" && (
                <NextStepButton
                  disabled={!nextStepReady}
                  onClick={handleClickNextStep}
                />
              )}
              {step === "senha" && <FormSubmitButton />}
            </div>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

interface ContaCardProps {
  agencia: number;
  conta: number;
  onClick: (conta: number) => void;
  selected?: boolean;
}

function ContaCard(props: ContaCardProps) {
  const { agencia, conta, onClick, selected } = props;

  const handleClick = React.useCallback(() => {
    onClick(conta);
  }, [conta, onClick]);

  return (
    <Card
      onClick={handleClick}
      className={cn(
        "my-2 cursor-pointer p-4 hover:bg-primary/10 active:bg-primary/20",
        selected && "bg-primary/20",
      )}
    >
      <p>
        <span className="font-bold">Conta:</span> {conta}
      </p>
      <p>
        <span className="font-bold">Agência:</span> {agencia}
      </p>
    </Card>
  );
}

interface NextStepButtonProps {
  disabled?: boolean;
  onClick: () => void;
}

function NextStepButton(props: NextStepButtonProps) {
  const { disabled, onClick } = props;

  return (
    <Button type="button" onClick={onClick} disabled={disabled}>
      Continuar
      <ArrowRightIcon className="ml-2 size-4" />
    </Button>
  );
}

function FormSubmitButton() {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  return (
    <Button type="submit" disabled={isSubmitting}>
      {isSubmitting ? (
        <LoaderCircleIcon className="mr-2 size-4 animate-spin" />
      ) : (
        <LogInIcon className="mr-2 size-4" />
      )}
      Login
    </Button>
  );
}
