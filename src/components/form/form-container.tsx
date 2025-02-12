import { type FieldValues, type UseFormReturn } from "react-hook-form";
import { Form } from "../ui/form";

interface FormContainerProps<TFieldValues extends FieldValues> {
  children: React.ReactNode;
  form: UseFormReturn<TFieldValues>;
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

export function FormContainer<TFieldValues extends FieldValues>(
  props: FormContainerProps<TFieldValues>,
) {
  const { children, form, handleSubmit } = props;

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}>{children}</form>
    </Form>
  );
}
