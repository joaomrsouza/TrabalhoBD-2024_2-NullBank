"use client";

import { usePermission } from "@/hooks";
import { type CargoUser } from "@/server/auth/config";
import Link from "next/link";
import React from "react";

interface PermissionLinkProps {
  cargo: Array<CargoUser> | CargoUser;
  children: React.ReactNode;
  href: string;
}

export function PermissionLink(props: PermissionLinkProps) {
  const { cargo, children, href } = props;

  const temPermissao = usePermission(cargo);

  return temPermissao ? (
    <Link
      href={href}
      className="font-bold text-primary underline-offset-4 hover:underline"
    >
      {children}
    </Link>
  ) : (
    <span>{children}</span>
  );
}
