import { useEffect } from "react";
import {
  type FieldPath,
  type FieldValues,
  type PathValue,
  type UseFormReturn,
} from "react-hook-form";

export function useInputMask<
  T extends FieldValues,
  U extends FieldPath<T> = FieldPath<T>,
>(
  form: UseFormReturn<T>,
  field: U,
  mask: (value: PathValue<T, U>) => PathValue<T, U>,
) {
  const { setValue, watch } = form;

  const value = watch(field);

  useEffect(() => {
    if (value === mask(value)) return; // Previne loop infinito
    setValue(field, mask(value));
  }, [field, mask, setValue, value]);
}
