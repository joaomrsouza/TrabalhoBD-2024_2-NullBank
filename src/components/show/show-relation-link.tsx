import { type CargoUser } from "@/server/auth/config";
import { Permission } from "@/server/services/permission";
import Link from "next/link";

interface ShowRelationLinkProps {
  cargoRequerido?: CargoUser | CargoUser[];
  children: React.ReactNode;
  href: string;
}

export async function ShowRelationLink(props: ShowRelationLinkProps) {
  const { cargoRequerido, children, href } = props;

  const usuario = await Permission.safeGetAuthUser();

  const temPermissao = Permission.temPermissaoDeAcesso(
    cargoRequerido ?? [],
    usuario,
  );

  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (!temPermissao) return <>{children}</>;

  return (
    <Link
      href={href}
      className="font-bold text-primary underline-offset-4 hover:underline"
    >
      {children}
    </Link>
  );
}
