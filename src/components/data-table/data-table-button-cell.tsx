import { type CargoUser } from "@/server/auth/config";
import Link from "next/link";
import { PermissionLink } from "../permission-link";
import { Button } from "../ui/button";

interface DataTableLinkCellProps {
  cargoUsuario?: CargoUser;
  children: React.ReactNode;
  href: string;
}

export function DataTableLinkCell(props: DataTableLinkCellProps) {
  const { cargoUsuario, children, href } = props;

  const innerComponent = (
    <div className="inline-flex space-x-2">
      <span className="max-w-[31.25rem] truncate font-bold">{children}</span>
    </div>
  );

  return (
    <Button asChild size="xs" variant="link" className="p-0">
      {cargoUsuario ? (
        <PermissionLink href={href} cargo={cargoUsuario}>
          {innerComponent}
        </PermissionLink>
      ) : (
        <Link href={href}>{innerComponent}</Link>
      )}
    </Button>
  );
}
