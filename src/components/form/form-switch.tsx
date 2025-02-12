import { cn } from "@/lib/utils";
import { AsteriskIcon } from "lucide-react";
import React from "react";
import {
  useFormContext,
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Switch } from "../ui/switch";

interface SwitchProps<TFieldValues extends FieldValues> {
  className?: string;
  defaultChecked?: boolean;
  description?: React.ReactNode;
  disabled?: boolean;
  label: React.ReactNode;
  name: FieldPath<TFieldValues>;
  required?: boolean;
}

export function FormSwitch<TFieldValues extends FieldValues>(
  props: SwitchProps<TFieldValues>,
) {
  const {
    className,
    defaultChecked,
    description,
    disabled,
    label,
    name,
    required,
  } = props;

  const { control } = useFormContext<TFieldValues>();

  const handleChange = React.useCallback(
    (onChange: ControllerRenderProps<TFieldValues>["onChange"]) =>
      (checked: boolean) => {
        onChange(checked);
      },
    [],
  );

  return (
    <FormField
      name={name}
      control={control}
      disabled={disabled}
      render={({ field: { onChange, value, ...field } }) => (
        <FormItem className={cn("my-4 flex w-full flex-col", className)}>
          <FormLabel className="flex gap-1">
            {label}
            {required && <AsteriskIcon className="size-4 text-destructive" />}
          </FormLabel>
          <FormControl>
            <Switch
              className="!mt-4"
              {...field}
              checked={value}
              defaultChecked={defaultChecked}
              onCheckedChange={handleChange(onChange)}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
