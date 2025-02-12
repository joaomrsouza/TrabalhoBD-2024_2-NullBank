import { Button } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";
import Link from "next/link";
import { Navbar } from "./_components/navbar";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="m-3">
        <div className="flex w-full items-center justify-center">
          <div className="w-full max-w-screen-2xl px-16 sm:px-24 lg:px-32">
            <div className="flex w-full flex-col items-center justify-center gap-4 rounded-lg border p-16">
              <h1 className="text-3xl font-bold">
                Oops! Parece que você se perdeu!
              </h1>
              <div className="flex items-center gap-2">
                <Button asChild>
                  <Link href="/">
                    <HomeIcon className="mr-2 size-4" />
                    Página Inicial
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
