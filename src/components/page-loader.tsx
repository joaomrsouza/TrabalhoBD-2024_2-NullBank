import { LoaderCircleIcon } from "lucide-react";
import { PageContainer } from "./page-container";

export function PageLoader() {
  return (
    <PageContainer>
      <div className="flex h-[50dvh] w-full items-center justify-center">
        <LoaderCircleIcon className="size-8 animate-spin" />
      </div>
    </PageContainer>
  );
}
