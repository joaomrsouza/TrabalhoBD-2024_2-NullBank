import { Separator } from "@/components/ui/separator";

interface ShowFieldProps {
  children: React.ReactNode;
  label: string;
}
export function ShowField(props: ShowFieldProps) {
  const { children, label } = props;

  return (
    <div className="mx-1 my-4 w-full">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg">{children}</p>
      <Separator className="h-0.5" />
    </div>
  );
}
