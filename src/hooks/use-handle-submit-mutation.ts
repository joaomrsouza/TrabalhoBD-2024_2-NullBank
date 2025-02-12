import { type ResolverDef } from "@/trpc/react";
import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { type DecoratedMutation } from "node_modules/@trpc/react-query/dist/createTRPCReact";
import { useCallback } from "react";
import {
  type FieldValues,
  type Path,
  type UseFormReturn,
} from "react-hook-form";
import { type ZodError } from "zod";

type UseHandleSubmitMutationParams<
  TFieldValues extends FieldValues,
  ReturnData extends ResolverDef,
> = {
  form: UseFormReturn<TFieldValues>;
  mutationCall: DecoratedMutation<ReturnData>;
  onError?: (error: string, router: AppRouterInstance) => void;
  onSuccess?: (
    data: ReturnData["output"],
    router: AppRouterInstance,
  ) => Promise<void> | void;
};

export function useHandleSubmitMutation<
  TFieldValues extends FieldValues,
  ReturnData extends ResolverDef,
>({
  form,
  mutationCall,
  onError,
  onSuccess,
}: UseHandleSubmitMutationParams<TFieldValues, ReturnData>) {
  const { clearErrors, handleSubmit, setError } = form;

  const router = useRouter();

  const mutation = mutationCall.useMutation({
    onError({ data, message }) {
      const { zodError } = data as { zodError: ZodError };

      setError("root", {
        message: zodError !== null ? "Informações inválidas." : message,
      });

      if (!zodError) {
        onError?.(message, router);
        return;
      }

      (
        Object.entries(zodError) as [
          "_errors" | Path<TFieldValues>,
          { _errors: string[] },
        ][]
      ).forEach(([key, messages]) => {
        if (key === "_errors") return;
        setError(key, {
          message: messages ? messages._errors.join(". ") : undefined,
        });
      });

      onError?.(message, router);
    },
    async onSuccess(data) {
      clearErrors();
      await onSuccess?.(data, router);
    },
  });

  const onSubmit = useCallback(
    async (formData: TFieldValues) => {
      await mutation.mutateAsync(formData);
    },
    [mutation],
  );

  return {
    handleSubmit: handleSubmit(onSubmit),
  };
}
