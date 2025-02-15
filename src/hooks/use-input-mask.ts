import { useEffect } from "react";
import {
  FieldPath,
  FieldValues,
  PathValue,
  UseFormReturn,
} from "react-hook-form";

export function useInputMask<
  T extends FieldValues,
  U extends FieldPath<T> = FieldPath<T>,
>(
  form: UseFormReturn<T>,
  field: U,
  mask: (value: PathValue<T, U>) => PathValue<T, U>,
) {
  const { watch, setValue } = form;

  const value = watch(field);

  useEffect(() => {
    if (value === mask(value)) return; // Previne loop infinito
    setValue(field, mask(value));
  }, [field, mask, setValue, value]);
}
