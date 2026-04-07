'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { Check, LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

interface FormProps<S extends z.ZodObject<any>> {
  schema: S;
  initialValues: z.infer<S>;
  onSubmit: SubmitHandler<z.infer<S>>;
  children: React.ReactNode;
  error?: string | null | undefined;
}


export default function Form<S extends z.ZodObject<any>> ({ initialValues, onSubmit, schema, children, error }: FormProps<S>) {
    const methods = useForm<z.infer<S>>({
      resolver: zodResolver(schema as any),
      defaultValues: initialValues as any,
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

    useEffect(() => {
      if(error) setError("root.server", { type: "server", message: error })
    }, [error])

    useEffect(() => {
      if (!isSubmitSuccessful) return;

      const timeoutId = setTimeout(() => {
        reset();
    }, 1000)

      return () => clearTimeout(timeoutId);
    }, [isSubmitSuccessful, reset]);
    
    const wrappedSubmit: SubmitHandler<z.infer<S>> = async (data, e) => {
      clearErrors("root.server"); // clear previous server errors
      try {
        await onSubmit(data, e);
      } catch (err: any) {
        const message = err?.message || "Unexpected error";
        setError("root.server", { type: "server", message });
      }
    };
  
    return (
      <FormProvider {...methods}>
        <form
          className="flex flex-col min-w-72 max-w-lg w-full grow h-full space-y-4 "
          onSubmit={handleSubmit(wrappedSubmit)}
        >
          {children}
          <button
            type="submit"
            disabled={isSubmitting || showSuccess} // disable while submitting or after success
            className={clsx(
              "normal-space   rounded-lg snappy  font-medium flex items-center justify-center gap-x-2 text-lg mt-6 disabled:cursor-not-allowed",
              {
                "bg-transparent hover:bg-whitesmoke text-whitesmoke/87 border-2 border-whitesmoke/40 hover:text-deep active:bg-whitesmoke active:text-deep ": !showError && !showSuccess && !isSubmitting,
                "bg-error-dark border-error-dark text-deep": showError,
                "bg-success-dark border-success-dark text-deep": showSuccess,
              }
            )}
          >
            {isSubmitting && <LoaderCircle size={15} className="w-4 h-4 animate-spin" />}
            {showSuccess && !isSubmitting && <Check   className="w-6 h-6" />}
  
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