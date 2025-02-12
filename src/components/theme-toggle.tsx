"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React from "react";
import { flushSync } from "react-dom";

export function ThemeToggle() {
  const { setTheme } = useTheme();

  const ref = React.useRef<HTMLButtonElement>(null);

  const getHandleChangeTheme = React.useCallback(
    (theme: "dark" | "light" | "system") => async () => {
      // Não executa animação se o usuário está com redução de movimento ativada, ou se o navegador não suporta a animação
      if (
        !ref.current ||
        !document.startViewTransition ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        setTheme(theme);
        return;
      }

      // Executa a animação pela api do browser
      await document.startViewTransition(() => {
        flushSync(() => {
          setTheme(theme);
        });
      }).ready;

      // Calcula as coordenadas para o circulo centrado no botão
      const { height, left, top, width } = ref.current.getBoundingClientRect();
      const x = left + width / 2;
      const y = top + height / 2;
      const right = window.innerWidth - left;
      const bottom = window.innerHeight - top;

      // Calcula o raio do circulo para cobrir a tela inteira
      const maxRadius = Math.hypot(
        Math.max(left, right),
        Math.max(top, bottom),
      );

      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 300,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    },
    [setTheme],
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button ref={ref} size="icon" variant="ghost">
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Trocar tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={getHandleChangeTheme("light")}>
          Claro
        </DropdownMenuItem>
        <DropdownMenuItem onClick={getHandleChangeTheme("dark")}>
          Escuro
        </DropdownMenuItem>
        <DropdownMenuItem onClick={getHandleChangeTheme("system")}>
          Sistema
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
