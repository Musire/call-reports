'use client';

import { Step } from "@/components/forms/steps/AvailabilitySteps";
import { useMultiForm, useStepper } from "@/hooks";
import { useEffect } from "react";
import { FieldValues, FormProvider, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { FormError, MultiActionTray } from ".";

interface FormProps<
    Ctx,
    T extends FieldValues,
    S extends z.ZodType<T>
  > {
    schema: S;
    initialValues: z.infer<S>;
    onSubmit: (x: z.infer<S>) => void;
    steps: Step<Ctx, T>[];
    ctx: Ctx;
    error?: string | null;
}

export default function MultiForm<
  Ctx,
  T extends FieldValues,
  S extends z.ZodType<T>
>({
  initialValues,
  onSubmit,
  schema,
  steps,
  ctx,
  error,
}: FormProps<Ctx, T, S>) {
    const {
        handleSubmit,
        isSubmitting,
        errors,
        showError,
        showSuccess,
        isSubmitSuccessful,
        trigger,
        reset,
        methods,
        wrappedSubmit
    } = useMultiForm<T, S>(schema, initialValues, onSubmit, error)

    const { controls, currentStep } = useStepper<Ctx, T>(steps, trigger)

    // reset form after 1s if successful
    useEffect(() => {
          if (!isSubmitSuccessful) return;

          const timeoutId = setTimeout(() => {
              reset();
              controls.resetStepper()
          }, 1000)

          return () => clearTimeout(timeoutId);
    }, [isSubmitSuccessful, reset, controls.resetStepper]);
   
    return (
      <FormProvider {...methods}>
        <form
          className="flex flex-col min-w-72 max-w-lg w-full grow h-full space-y-4 "
          onSubmit={handleSubmit(wrappedSubmit as SubmitHandler<FieldValues>)}
        >
          {currentStep.render(ctx)}
          <MultiActionTray
            controls={controls}
            formState={{
              isSubmitting,
              showError,
              showSuccess
            }}
          />
        </form>
        <FormError
          showError={showError}
          errors={errors}
        />
      </FormProvider>
    );
}