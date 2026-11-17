
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import {
    DefaultValues,
    FormProvider,
    SubmitHandler,
    useForm
} from "react-hook-form";
import z from "zod";
import StatusButton from "./StatusButton";

export type FormState = {
    success: boolean;
    error: string | null;
};

interface FormProps<S extends z.ZodObject<z.ZodRawShape>> {
    schema: S;
    initialValues: DefaultValues<z.input<S>>;
    children: React.ReactNode;
    actionFn: (
        prevState: FormState,
        formData: FormData
    ) => FormState | Promise<FormState>;
    onSuccess?: () => void;
}

export default function ActionForm<S extends z.ZodObject<z.ZodRawShape>>({
    initialValues,
    schema,
    actionFn,
    onSuccess,
    children
}: FormProps<S>) {

    // 1. Server state
    const [state, action, pending] = useActionState(actionFn, {
        success: false,
        error: null
    });

    // 2. RHF setup
    const form = useForm<z.input<S>, unknown, z.output<S>>({
        resolver: zodResolver(schema),
        defaultValues: initialValues,
        mode: "onBlur"
    });

    // 3. Bridge RHF → server action
    const onSubmit: SubmitHandler<z.output<S>> = async (values) => {
        const formData = new FormData();

        for (const [key, value] of Object.entries(values)) {
            if (value instanceof File) {
                formData.append(key, value);
            } else if (value !== undefined && value !== null) {
                formData.append(key, String(value));
            }
        }

        startTransition(() => {
            action(formData);
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
                className="flex flex-col min-w-72 max-w-lg w-full xs:w-dvw p-6 bg-darker space-y-4"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                {children}

                <p>{state.error}</p>

                <StatusButton
                    isPending={pending}
                    state={state}
                />
            </form>
        </FormProvider>
    );
}
