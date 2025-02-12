import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { cn } from "@/lib/utils";
import { TRPCReactProvider } from "@/trpc/react";
import { Inter as FontSans } from "next/font/google";
import QueryProvider from "./_components/query-provider";
import { ThemeProvider } from "./_components/theme-provider";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  description: "Nunca te deixa na mão!",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  title: {
    default: "NullBank",
    template: "%s | NullBank",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <TRPCReactProvider>
          <QueryProvider>
            <ThemeProvider enableSystem attribute="class" defaultTheme="system">
              {children}
            </ThemeProvider>
          </QueryProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
