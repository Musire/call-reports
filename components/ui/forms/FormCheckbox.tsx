'use client';
import { useFormContext } from "react-hook-form";

type FormToggleProps = {
  name: string;
  label: string;
  description?: string;
};

export default function FormCheckbox({
  name,
  label,
  description,
}: FormToggleProps) {
  const { register } = useFormContext();
  
  return (
    <label className="flex items-center gap-4 cursor-pointer select-none">
      <p className="text-sm font-medium capitalize w-24">{label}</p>
      <input
        type="checkbox"
        {...register(name)}
        className="sr-only peer"
      />

      {/* Track */}
      <div
        className="
          relative w-11 h-6 rounded-full
          bg-darker transition-colors duration-150
          peer-checked:bg-whitesmoke/87
          [&>span]:absolute
          [&>span]:top-0.5
          [&>span]:left-0.5
          [&>span]:w-5
          [&>span]:h-5
          [&>span]:rounded-full
          [&>span]:bg-white
          [&>span]:transition-transform
          peer-checked:[&>span]:translate-x-5
          peer-checked:[&>span]:bg-darker
        "
      >
        <span />
      </div>

      <div>
        {description && (
          <p className="text-xs text-white/60">{description}</p>
        )}
      </div>
    </label>

  );
}
