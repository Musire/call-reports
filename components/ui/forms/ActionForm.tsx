'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import StatusButton from "./StatusButton";


export type FormState = { success: boolean, error: string | null }


interface FormProps<S extends z.ZodObject<any>> {
    schema: S;
    initialValues: z.infer<S>;
    children: React.ReactNode;
    actionFn: (prevState: FormState, formData: FormData) => FormState | Promise<FormState>;
    onSuccess?: () => void;
}


export default function ActionForm<S extends z.ZodObject<any>> ({ 
    initialValues, 
    schema,
    actionFn,
    onSuccess,
    children 
}: FormProps<S>) {
    // 1. server state
    const [state, action, pending] = useActionState(actionFn, { 
        success: false, 
        error: null
    })

    // 2. RHF setup
    const form = useForm<z.infer<S>>({
      resolver: zodResolver(schema as any),
      defaultValues: initialValues as any,
      mode: "onBlur"
    });


    // 3. bridge RHF → server action
    const onSubmit: SubmitHandler<z.infer<S>> = async (values) => {
        const formData = new FormData();

        const data = values as Record<string, any>;

        for (const key in data) {
            formData.append(key, String(data[key]));
        }

        startTransition(() => {
            (action as (data: FormData) => void)(formData);
        });
    };

    useEffect(() => {
        if (state.success && onSuccess) {
            onSuccess();
        }
    }, [state.success, onSuccess]);

    return (
      <FormProvider {...form}>
        <form
          className="flex flex-col min-w-72 max-w-lg w-full xs:w-dvw p-6 bg-darker  space-y-4 "
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {children}
          <p className="">{state.error}</p>
          <StatusButton 
            isPending={pending}
            state={state}
          />
        </form>
      </FormProvider>
    );
}