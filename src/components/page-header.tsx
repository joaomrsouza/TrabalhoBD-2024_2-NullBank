interface PageHeaderProps {
  children: React.ReactNode;
}

export function PageHeader(props: PageHeaderProps) {
  const { children } = props;

  return <h2 className="text-3xl font-semibold">{children}</h2>;
}
