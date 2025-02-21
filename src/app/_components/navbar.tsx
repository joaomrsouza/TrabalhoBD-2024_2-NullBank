import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { ChevronDownIcon } from "lucide-react";
import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";
import { type CargoUser } from "@/server/auth/config";
import { Permission } from "@/server/services/permission";

type MenuItem = {
  titulo: string;
} & (
  | {
      cargo?: CargoUser | CargoUser[];
      href: string;
      tipo: "link";
    }
  | {
      tipo: "dropdown";
      itens: (
        | {
            cargo?: CargoUser | CargoUser[];
            href: string;
            tipo: "link";
            titulo: string;
          }
        | { tipo: "divisor" }
      )[];
    }
);

const menus: MenuItem[] = [
  {
    href: "/",
    tipo: "link",
    titulo: "Página inicial",
  },
  {
    itens: [
      {
        cargo: ["dba"],
        href: "/agencias",
        tipo: "link",
        titulo: "Agências",
      },
      {
        cargo: ["dba"],
        href: "/agencias/novo",
        tipo: "link",
        titulo: "Cadastrar agência",
      },
    ],
    tipo: "dropdown",
    titulo: "Agências",
  },
  {
    itens: [
      {
        cargo: ["dba"],
        href: "/clientes",
        tipo: "link",
        titulo: "Clientes",
      },
      {
        cargo: ["dba"],
        href: "/clientes/novo",
        tipo: "link",
        titulo: "Cadastrar clientes",
      },
    ],
    tipo: "dropdown",
    titulo: "Clientes",
  },
  {
    itens: [
      {
        cargo: ["dba"],
        href: "/contas",
        tipo: "link",
        titulo: "Contas",
      },
      {
        cargo: ["dba"],
        href: "/contas/novo",
        tipo: "link",
        titulo: "Cadastrar contas",
      },
    ],
    tipo: "dropdown",
    titulo: "Contas",
  },
  {
    itens: [
      {
        cargo: ["dba"],
        href: "/funcionarios",
        tipo: "link",
        titulo: "Funcionários",
      },
      {
        cargo: ["dba"],
        href: "/funcionarios/novo",
        tipo: "link",
        titulo: "Cadastrar funcionário",
      },
    ],
    tipo: "dropdown",
    titulo: "Funcionários",
  },
  {
    itens: [
      {
        cargo: ["dba"],
        href: "/consultas/agencias/funcionarios",
        tipo: "link",
        titulo: "Funcionários por agência",
      },
      {
        cargo: ["dba"],
        href: "/consultas/agencias/clientes",
        tipo: "link",
        titulo: "Clientes por agência",
      },
      {
        cargo: ["dba"],
        href: "/consultas/agencias/contas-especiais",
        tipo: "link",
        titulo: "Contas especiais por agência",
      },
      {
        cargo: ["dba"],
        href: "/consultas/agencias/contas-poupanca",
        tipo: "link",
        titulo: "Contas poupança por agência",
      },
      {
        cargo: ["dba"],
        href: "/consultas/agencias/contas-corrente-transacoes-qtd",
        tipo: "link",
        titulo: "Qtd. transações contas corrente por agência",
      },
      {
        cargo: ["dba"],
        href: "/consultas/agencias/contas-corrente-transacoes-valor",
        tipo: "link",
        titulo: "Valor transações contas corrente por agência",
      },
      { tipo: "divisor" },
      {
        cargo: ["dba"],
        href: "/consultas/clientes/contas",
        tipo: "link",
        titulo: "Contas por cliente",
      },
      {
        cargo: ["dba"],
        href: "/consultas/clientes/contas-conjunta",
        tipo: "link",
        titulo: "Contas conjunta por cliente",
      },
      {
        cargo: ["dba"],
        href: "/consultas/clientes/contas-transacoes-qtd",
        tipo: "link",
        titulo: "Qtd. transações contas por cliente",
      },
      {
        cargo: ["dba"],
        href: "/consultas/clientes/contas-transacoes-valor",
        tipo: "link",
        titulo: "Valor de transações por cliente",
      },
      { tipo: "divisor" },
      {
        cargo: ["dba"],
        href: "/consultas/cidade/clientes",
        tipo: "link",
        titulo: "Clientes por cidade",
      },
      {
        cargo: ["dba"],
        href: "/consultas/cidade/funcionarios",
        tipo: "link",
        titulo: "Funcionários por cidade",
      },
      {
        cargo: ["dba"],
        href: "/consultas/cidade/agencias",
        tipo: "link",
        titulo: "Agências por cidade",
      },
    ],
    tipo: "dropdown",
    titulo: "Consultar",
  },
];

const rightMenus: MenuItem[] = [
  {
    itens: [
      {
        href: "/logout",
        tipo: "link",
        titulo: "Sair",
      },
    ],
    tipo: "dropdown",
    titulo: "",
  },
];

export async function Navbar() {
  return (
    <nav className="flex flex-row items-center justify-between border-b">
      <div className="flex items-center gap-2">
        {/* <Link href="/" className="p-1">
          <BrandBlackTextCompactIcon className="h-12 w-fit dark:hidden" />
          <BrandColoredTextCompactIcon className="hidden h-12 w-fit dark:block" />
        </Link> */}

        <NavMenu menus={menus} />
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <NavMenu menus={rightMenus} />
      </div>
    </nav>
  );
}

interface NavMenuProps {
  menus: MenuItem[];
}

async function NavMenu(props: NavMenuProps) {
  const { menus } = props;

  const usuario = await Permission.safeGetAuthUser();

  const menusFiltrados = menus.flatMap(menu => {
    if (menu.tipo === "link")
      return Permission.temPermissaoDeAcesso(menu.cargo || [], usuario)
        ? menu
        : [];

    const itensFiltrados = menu.itens
      .filter(item => {
        if (item.tipo === "divisor") return true;

        return Permission.temPermissaoDeAcesso(item.cargo || [], usuario);
      })
      // Remove divisores que estão no começo, no final e duplicados
      .filter(
        (item, index, array) =>
          !(
            item.tipo === "divisor" &&
            (index === 0 ||
              index === array.length - 1 ||
              array[index - 1]?.tipo === "divisor")
          ),
      );

    if (itensFiltrados.length === 0) return [];

    return {
      ...menu,
      itens: itensFiltrados,
    };
  });

  return (
    <Menubar className="h-12 rounded-none border-0">
      {menusFiltrados.map((menu, index) => (
        <MenubarMenu key={index}>
          {menu.tipo === "link" && (
            <MenubarTrigger asChild className="cursor-pointer text-base">
              <Link href={menu.href}>{menu.titulo}</Link>
            </MenubarTrigger>
          )}
          {menu.tipo === "dropdown" && (
            <>
              <MenubarTrigger className="cursor-pointer text-base">
                {menu.titulo}
                {menu.titulo.length ? (
                  <ChevronDownIcon className="ml-2 size-4" />
                ) : (
                  <ChevronDownIcon className="size-4" />
                )}
              </MenubarTrigger>
              <MenubarContent>
                {menu.itens.map((item, index) => {
                  if (item.tipo === "link") {
                    return (
                      <MenubarItem
                        asChild
                        key={index}
                        className="cursor-pointer text-base"
                      >
                        <Link href={item.href}>{item.titulo}</Link>
                      </MenubarItem>
                    );
                  }

                  return <MenubarSeparator key={index} />;
                })}
              </MenubarContent>
            </>
          )}
        </MenubarMenu>
      ))}
    </Menubar>
  );
}
