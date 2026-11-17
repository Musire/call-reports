
import { FieldError, FieldErrors, FieldValues } from "react-hook-form";

type FormErrorProps = {
    showError: boolean;
    errors: FieldErrors<FieldValues>;
};

function isFieldError(value: unknown): value is FieldError {
    return (
        typeof value === "object" &&
        value !== null &&
        "message" in value &&
        typeof value.message === "string"
    );
}

function flattenErrors(errors: FieldErrors<FieldValues>): FieldError[] {
    const result: FieldError[] = [];

    const walk = (value: unknown): void => {
        if (!value || typeof value !== "object") return;

        if (isFieldError(value)) {
            result.push(value);
            return;
        }

        for (const child of Object.values(value)) {
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
