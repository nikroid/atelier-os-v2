interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <header className="page-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p className="subtitle">{subtitle}</p>}
      </div>
      {action}
    </header>
  );
}
