type FormErrorProps = {
  message?: string;
};

export function FormError({ message }: FormErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <div className="rounded-md border border-warning/25 bg-warning/10 px-4 py-3 text-sm font-semibold text-warning">
      {message}
    </div>
  );
}
