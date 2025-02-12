import { type ActionResponse } from "@/server/utils/actions";
import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import {
  type FieldValues,
  type Path,
  type UseFormReturn,
} from "react-hook-form";

type UseHandleSubmitActionParams<
  TFieldValues extends FieldValues,
  ActionReturnData,
> = {
  form: UseFormReturn<TFieldValues>;
  onError?: (error: string, router: AppRouterInstance) => void;
  action: (
    formData: TFieldValues,
  ) => ActionResponse<TFieldValues, ActionReturnData>;
  onSuccess?: (
    data: ActionReturnData,
    router: AppRouterInstance,
  ) => Promise<void> | void;
};

export function useHandleSubmitAction<
  TFieldValues extends FieldValues,
  ActionReturnData,
>({
  action,
  form,
  onError,
  onSuccess,
}: UseHandleSubmitActionParams<TFieldValues, ActionReturnData>) {
  const { clearErrors, handleSubmit, setError } = form;

  const router = useRouter();

  const onSubmit = useCallback(
    async (formData: TFieldValues) => {
      const result = await action(formData);

      if (result.error) {
        setError("root", { message: result.message });

        const { zodErrors } = result;
        if (!zodErrors) {
          onError?.(result.message, router);
          return;
        }

        (
          Object.entries(zodErrors) as [
            "_errors" | Path<TFieldValues>,
            { _errors: string[] },
          ][]
        ).forEach(([key, messages]) => {
          if (key === "_errors") return;
          setError(key, {
            message: messages ? messages._errors.join(". ") : undefined,
          });
        });

        onError?.(result.message, router);
        return;
      }
      clearErrors();
      await onSuccess?.(result.data, router);
    },
    [action, clearErrors, onError, onSuccess, router, setError],
  );

  return {
    handleSubmit: handleSubmit(onSubmit),
  };
}
