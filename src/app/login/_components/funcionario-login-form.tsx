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
import { type z } from "@/lib/zod";
import { schemas } from "@/schemas";
import { actions } from "@/server/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircleIcon, LogInIcon } from "lucide-react";
import { useForm, useFormContext } from "react-hook-form";

type FormData = z.infer<typeof schemas.login.form>;

export function FuncionarioLoginForm() {
  const form = useForm<FormData>({
    defaultValues: { conta: null, login: "", senha: "" },
    resolver: zodResolver(schemas.login.form),
  });

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
              Acesso de Funcionários
              <ThemeToggle />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormInput<FormData> name="login" type="login" label="Login" />
            <FormInput<FormData> name="senha" label="Senha" type="password" />
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <FormSubmitButton />
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

function FormSubmitButton() {
  const {
    formState: { errors, isSubmitting },
  } = useFormContext();

  return (
    <>
      <p className="text-sm font-medium text-destructive">
        {errors.root?.message}
      </p>

      <div className="flex w-full flex-row-reverse">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <LoaderCircleIcon className="mr-2 size-4 animate-spin" />
          ) : (
            <LogInIcon className="mr-2 size-4" />
          )}
          Login
        </Button>
      </div>
    </>
  );
}
