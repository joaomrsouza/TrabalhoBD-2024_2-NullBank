"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import {
  useFieldArray,
  useFormContext,
  type ArrayPath,
  type FieldArray,
  type FieldValues,
} from "react-hook-form";
import { Button } from "../ui/button";

interface FormInputArrayProps<TFieldValues extends FieldValues> {
  defaultValue: FieldArray<TFieldValues, ArrayPath<TFieldValues>>;
  name: ArrayPath<TFieldValues>;
  render: (index: number) => React.ReactNode;
}

export function FormInputArray<TFieldValues extends FieldValues>(
  props: FormInputArrayProps<TFieldValues>,
) {
  const { defaultValue, name, render } = props;

  const { control } = useFormContext<TFieldValues>();

  const { append, fields, remove } = useFieldArray({ control, name });

  return (
    <div className="my-3 flex w-full flex-col">
      {fields.map(({ id }, index) => (
        <div
          key={id}
          className="-my-3 grid w-full grid-cols-[1fr,auto] items-end gap-2"
        >
          {render(index)}
          <span className="flex items-end gap-2">
            <Button
              size="icon"
              type="button"
              className="my-4"
              variant="outline"
              onClick={() => append(defaultValue)}
            >
              <PlusIcon className="size-4" />
            </Button>
            {index > 0 && (
              <Button
                size="icon"
                type="button"
                className="my-4"
                variant="outline"
                onClick={() => remove(index)}
              >
                <MinusIcon className="size-4" />
              </Button>
            )}
          </span>
        </div>
      ))}
    </div>
  );
}
