type StatusMessageProps = {
  error?: string;
  success?: string;
};

export function StatusMessage({ error, success }: StatusMessageProps) {
  const message = error ?? success;

  if (!message) {
    return null;
  }

  const isError = Boolean(error);

  return (
    <div
      className={
        isError
          ? "rounded-md border border-warning/25 bg-warning/10 px-4 py-3 text-sm font-semibold text-warning"
          : "rounded-md border border-success/25 bg-success/10 px-4 py-3 text-sm font-semibold text-success"
      }
    >
      {message}
    </div>
  );
}
