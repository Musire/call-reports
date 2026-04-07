'use client'; 

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import z, { output } from "zod";

export default function useMultiForm <T extends FieldValues, S extends z.ZodType<T>> (
    schema: S,
    initialValues: z.infer<S>,
    onSubmit: (x: output<S>) => void,
    error?: string | null
) {
    const methods = useForm<T>({
        resolver: zodResolver(schema as any),
        defaultValues: initialValues as any,
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

    const wrappedSubmit: SubmitHandler<z.infer<S>> = (data) => {
        clearErrors("root.server"); // clear previous server errors
        try {
            onSubmit(data);
        } catch (err: any) {
            const message = err?.message || "Unexpected error";
            setError("root.server", { type: "server", message });
        }
    };

    // set form error to the global error passed
    useEffect(() => {
          if(error) setError("root.server", { type: "server", message: error })
    }, [error])

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