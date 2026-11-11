import { forwardRef, type InputHTMLAttributes, type LabelHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <Label htmlFor={inputId} className="block text-sm font-medium text-slate-700">
            {label}
          </Label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm",
            "placeholder:text-slate-400",
            "transition-colors focus:outline-none focus:ring-2 focus:ring-[#0B2545]/20 focus:border-[#0B2545]",
            "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60",
            error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-slate-300",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs font-medium text-red-600">{error}</p>}
        {!error && hint && <p className="text-xs text-slate-400">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export const Label = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label ref={ref} className={cn("text-sm font-medium text-slate-700", className)} {...props} />
  )
);
Label.displayName = "Label";
