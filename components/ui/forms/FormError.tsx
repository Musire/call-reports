import { FieldError, FieldErrors, FieldValues } from "react-hook-form";

type FormErrorProps = {
  showError: boolean;
  errors: FieldErrors<FieldValues>;
};

function flattenErrors(errors: FieldErrors<FieldValues>): FieldError[] {
  const result: FieldError[] = [];

  const walk = (value: unknown) => {
    if (!value || typeof value !== "object") return;

    // RHF FieldError shape
    if ("message" in value && typeof (value as any).message === "string") {
      result.push(value as FieldError);
      return;
    }

    for (const child of Object.values(value as Record<string, unknown>)) {
      walk(child);
    }
  };

  walk(errors);
  return result;
}

export default function FormError({ showError, errors }: FormErrorProps) {
  if (!showError) return null;

  const list = flattenErrors(errors);

  if (list.length === 0) return null;

  return (
    <div className="space-y-1 text-sm text-error-dark">
      {list.map((err, i) => (
        <p key={i}>{err.message}</p>
      ))}
    </div>
  );
}
