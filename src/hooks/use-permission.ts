import { type CargoUser } from "@/server/auth/config";
import { api } from "@/trpc/react";

export function usePermission(cargo: CargoUser | CargoUser[]) {
  const { data } = api.auth.temPermissao.useQuery({ cargo });

  return data?.temPermissao ?? false;
}
