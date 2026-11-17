
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import {
    DefaultValues,
    FieldValues,
    SubmitHandler,
    useForm
} from "react-hook-form";
import { z } from "zod";

export default function useMultiForm<
    S extends z.ZodType<FieldValues, FieldValues>
>(
    schema: S,
    initialValues: DefaultValues<z.input<S>>,
    onSubmit: (data: z.output<S>) => void | Promise<void>,
    error?: string | null
) {
    const methods = useForm<z.input<S>, unknown, z.output<S>>({
        resolver: zodResolver(schema),
        defaultValues: initialValues,
        mode: "onBlur",
        shouldUnregister: false
    });

    const {
        trigger,
        handleSubmit,
        setError,
        clearErrors,
        reset,
        formState: { isSubmitting, isSubmitSuccessful, errors }
    } = methods;

    const hasErrors = Object.keys(errors).length > 0;
    const showError = !isSubmitting && hasErrors;
    const showSuccess = !isSubmitting && isSubmitSuccessful && !hasErrors;

    const wrappedSubmit: SubmitHandler<z.output<S>> = async (data) => {
        clearErrors("root.server");

        try {
            await onSubmit(data);
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

    // Set form error to the global error passed
    useEffect(() => {
        if (error) {
            setError("root.server", {
                type: "server",
                message: error
            });
        }
    }, [error, setError]);

    return {
        trigger,
        handleSubmit,
        setError,
        clearErrors,
        reset,
        isSubmitting,
        isSubmitSuccessful,
        errors,
        showError,
        showSuccess,
        methods,
        wrappedSubmit
    };
}
