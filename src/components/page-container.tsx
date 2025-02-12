import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer(props: PageContainerProps) {
  const { children, className } = props;

  return (
    <div className="flex w-full items-center justify-center">
      <div className="w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "flex w-full flex-col gap-2 rounded-lg border p-2",
            className,
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
