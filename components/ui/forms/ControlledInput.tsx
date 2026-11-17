
"use client";

import React from "react";
import {
  Controller,
  ControllerRenderProps,
  FieldError,
  FieldValues,
  get,
  Path,
  useFormContext,
} from "react-hook-form";

type ControlledInputProps<T extends FieldValues> = {
    name: Path<T>;
    label?: string;
    children: (field: ControllerRenderProps<T, Path<T>>) => React.ReactElement;
};

export default function ControlledInput<T extends FieldValues>({
    label,
    name,
    children,
}: ControlledInputProps<T>) {
    const {
        control,
        formState: { errors },
    } = useFormContext<T>();

    const error = get(errors, name) as FieldError | undefined;

    return (
        <div className="flex flex-col w-full gap-y-1">
            {label && (
                <legend className="w-full text-lg capitalize mb-1">
                    {label}
                </legend>
            )}

            <Controller
                name={name}
                control={control}
                render={({ field }) => children(field)}
            />

            <p
                className={`text-sm relative text-error-dark snappy h-4 ${
                    error ? "visible animate-ghostIn" : "invisible"
                }`}
            >
                {error?.message}
            </p>
        </div>
    );
}
