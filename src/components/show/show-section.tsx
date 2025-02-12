interface ShowSectionProps {
  children: React.ReactNode;
  title: string;
}

export function ShowSection(props: ShowSectionProps) {
  const { children, title } = props;

  return (
    <div className="rounded-md bg-gray-500/5 p-4">
      <h3 className="text-xl font-semibold">{title}</h3>
      {children}
    </div>
  );
}
