interface EmptyStateProps {
  message: string;
  action?: React.ReactNode;
}

export function EmptyState({ message, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <p>{message}</p>
      {action}
    </div>
  );
}
