"use client";

import { Eye, EyeOff } from "lucide-react";
import { InputHTMLAttributes, TextareaHTMLAttributes, useState } from "react";
import { FieldValues, Path, useFormContext } from "react-hook-form";

type BaseProps<T extends FieldValues> = {
  label?: string;
  name: Path<T>;
  as?: "input" | "textarea";
};

type FormFieldProps<T extends FieldValues> = BaseProps<T> &
  InputHTMLAttributes<HTMLInputElement> &
  TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function FormField<T extends FieldValues>({
  label,
  name,
  as = "input",
  type = "text",
  className = "",
  ...props
}: FormFieldProps<T>) {
  const [showPassword, setShowPassword] = useState(false);
  const { register, formState: { errors } } = useFormContext<T>();

  const error = errors[name];
  const isHidden = type === "hidden";
  const isPassword = type === "password";
  const Tag = as;

  // Final type logic for password toggling
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  const baseClasses = `w-full bg-transparent border rounded-lg focus:ring-2 focus:outline-none transition-all
    ${error ? "border-red-500 focus:ring-red-500/20" : "border-white/40 focus:ring-white/20"}
    ${as === "textarea" ? "min-h-[128px] py-2 px-3" : "h-10 px-3"} 
    ${isPassword ? "pr-10" : ""} ${className}`;

  if (isHidden) return <input type="hidden" {...register(name)} />;

  return (
    <div className="flex flex-col space-y-1.5 w-full">
      {label && (
        <label htmlFor={name} className="w-fit text-sm font-medium text-white/80 capitalize">
          {label}
        </label>
      )}

      <div className="relative">
        <Tag
          id={name}
          type={as === "input" ? inputType : undefined}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          {...register(name, { valueAsNumber: type === "number" })}
          {...props}
          className={baseClasses}
          onWheel={(e) => type === "number" && e.currentTarget.blur()}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      <div id={`${name}-error`} role="alert" className="min-h-5">
        {error && (
          <span className="text-xs text-red-400 animate-in fade-in slide-in-from-top-1">
            {String(error.message)}
          </span>
        )}
      </div>
    </div>
  );
}
