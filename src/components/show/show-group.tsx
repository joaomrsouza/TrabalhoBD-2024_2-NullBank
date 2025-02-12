interface ShowGroupProps {
  children: React.ReactNode;
}

export function ShowGroup(props: ShowGroupProps) {
  const { children } = props;

  return <div className="flex">{children}</div>;
}
