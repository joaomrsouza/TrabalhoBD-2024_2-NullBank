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
import { Textarea } from "../ui/textarea";

interface FormTextareaProps<TFieldValues extends FieldValues>
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  description?: React.ReactNode;
  label: React.ReactNode;
  name: FieldPath<TFieldValues>;
}

export function FormTextarea<TFieldValues extends FieldValues>(
  props: FormTextareaProps<TFieldValues>,
) {
  const {
    className,
    description,
    disabled,
    label,
    name,
    required,
    ...textareaProps
  } = props;

  const { control } = useFormContext<TFieldValues>();

  const handleChange = React.useCallback(
    (onChange: ControllerRenderProps<TFieldValues>["onChange"]) =>
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value === "" ? null : e.target.value);
      },
    [],
  );

  return (
    <FormField
      name={name}
      control={control}
      disabled={disabled}
      render={({ field: { onChange, value, ...field } }) => (
        <FormItem className={cn("my-4 w-full", className)}>
          <FormLabel className="flex gap-1">
            {label}
            {required && <AsteriskIcon className="size-4 text-destructive" />}
          </FormLabel>
          <FormControl>
            <Textarea
              {...textareaProps}
              {...field}
              value={value ?? ""}
              onChange={handleChange(onChange)}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
