
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { Check, LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import {
  DefaultValues,
  FormProvider,
  SubmitHandler,
  useForm
} from "react-hook-form";
import { z } from "zod";

interface FormProps<S extends z.ZodObject<z.ZodRawShape>> {
    schema: S;
    initialValues: DefaultValues<z.input<S>>;
    onSubmit: SubmitHandler<z.output<S>>;
    children: React.ReactNode;
    error?: string | null;
}

export default function Form<S extends z.ZodObject<z.ZodRawShape>>({
    initialValues,
    onSubmit,
    schema,
    children,
    error
}: FormProps<S>) {

    const methods = useForm<z.input<S>, unknown, z.output<S>>({
        resolver: zodResolver(schema),
        defaultValues: initialValues,
        mode: "onBlur"
    });

    const {
        handleSubmit,
        setError,
        clearErrors,
        reset,
        formState: { isSubmitting, isSubmitSuccessful, errors }
    } = methods;

    // Status logic
    const hasErrors = Object.keys(errors).length > 0;
    const showError = !isSubmitting && hasErrors;
    const showSuccess = !isSubmitting && isSubmitSuccessful && !hasErrors;

    // Server error handling
    useEffect(() => {
        if (error) {
            setError("root.server", {
                type: "server",
                message: error
            });
        }
    }, [error, setError]);

    // Reset after successful submission
    useEffect(() => {
        if (!isSubmitSuccessful) return;

        const timeoutId = setTimeout(() => {
            reset();
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [isSubmitSuccessful, reset]);

    // Submit handler
    const wrappedSubmit: SubmitHandler<z.output<S>> = async (data, e) => {
        clearErrors("root.server");

        e?.preventDefault();

        try {
            await onSubmit(data, e);
        } catch (err: unknown) {
            const message = err instanceof Error
                ? err.message
                : "Unexpected error";

            setError("root.server", {
                type: "server",
                message
            });
        }
    };

    return (
        <FormProvider {...methods}>
            <form
                method="POST"
                className="flex flex-col min-w-72 max-w-lg w-full grow h-full space-y-4"
                onSubmit={handleSubmit(wrappedSubmit)}
            >
                {children}

                <button
                    type="submit"
                    disabled={isSubmitting || showSuccess}
                    className={clsx(
                        "normal-space rounded-lg snappy font-medium flex items-center justify-center gap-x-2 text-lg mt-6 disabled:cursor-not-allowed",
                        {
                            "bg-transparent hover:bg-whitesmoke text-whitesmoke/87 border-2 border-whitesmoke/40 hover:text-deep active:bg-whitesmoke active:text-deep":
                                !showError && !showSuccess && !isSubmitting,
                            "bg-error-dark border-error-dark text-deep": showError,
                            "bg-success-dark border-success-dark text-deep": showSuccess,
                        }
                    )}
                >
                    {isSubmitting && (
                        <LoaderCircle size={15} className="w-4 h-4 animate-spin" />
                    )}

                    {showSuccess && !isSubmitting && (
                        <Check className="w-6 h-6" />
                    )}

                    {isSubmitting
                        ? "Submitting..."
                        : showError
                        ? "Retry"
                        : showSuccess
                        ? "Success"
                        : "Submit"}
                </button>
            </form>
        </FormProvider>
    );
}
