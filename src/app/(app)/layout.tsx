import { Navbar } from "../_components/navbar";

export default async function RootLayout(
  props: Readonly<{ children: React.ReactNode }>,
) {
  const { children } = props;

  return (
    <>
      <Navbar />
      <main className="m-3">{children}</main>
    </>
  );
}
