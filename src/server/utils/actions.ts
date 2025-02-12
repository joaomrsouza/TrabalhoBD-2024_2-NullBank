import "server-only";

import { AccessDenied, CallbackRouteError } from "@auth/core/errors";
import { ZodError, type ZodFormattedError } from "zod";

export type ActionResponseOk<T = undefined> = {
  data: T;
  error: false;
};

export type ActionResponseError<T = undefined> = {
  error: true;
  message: string;
  zodErrors?: ZodFormattedError<T, string>;
};

export type ActionResponse<
  FormData = undefined,
  OutputData = undefined,
> = Promise<ActionResponseError<FormData> | ActionResponseOk<OutputData>>;

export async function sendInvalidFormError<FormData>(
  zodErrors: ZodError<FormData>,
): Promise<ActionResponseError<FormData>> {
  return {
    error: true,
    message: "Informações inválidas.",
    zodErrors: zodErrors.format(),
  };
}

export async function handleErrors<FormData>(
  error: unknown,
): Promise<ActionResponseError<FormData>> {
  if (error instanceof AccessDenied || error instanceof CallbackRouteError) {
    const { cause } = error;

    return {
      error: true,
      message: cause?.err?.message ?? "Acesso negado.",
    };
  }

  if (error instanceof ZodError) {
    return sendInvalidFormError(error);
  }

  if (error instanceof Error) {
    if (error.message === "NEXT_REDIRECT") {
      throw error;
    }

    return {
      error: true,
      message: error.message,
    };
  }

  return {
    error: true,
    message: "Erro desconhecido ao salvar os dados.",
  };
}
