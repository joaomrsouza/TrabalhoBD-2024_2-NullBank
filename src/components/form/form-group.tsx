interface FormGroupProps {
  children: React.ReactNode;
}

export function FormGroup(props: FormGroupProps) {
  const { children } = props;

  return <div className="flex gap-2">{children}</div>;
}
