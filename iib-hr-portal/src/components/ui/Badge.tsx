import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "navy"
  | "gold"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  navy: "bg-[#0B2545] text-white",
  gold: "bg-amber-100 text-amber-800 border border-amber-300",
  success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border border-amber-200",
  danger: "bg-red-50 text-red-700 border border-red-200",
  info: "bg-sky-50 text-sky-700 border border-sky-200",
  neutral: "bg-slate-100 text-slate-600 border border-slate-200",
};

export function Badge({ className, variant = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}

/** Maps domain statuses to badge variants. */
export function statusVariant(status: string): BadgeVariant {
  switch (status) {
    case "APPROVED":
    case "RESOLVED":
    case "PRESENT":
      return "success";
    case "PENDING":
    case "IN_PROGRESS":
    case "LATE":
    case "OPEN":
      return "warning";
    case "REJECTED":
    case "ABSENT":
    case "CANCELLED":
      return "danger";
    case "CLOSED":
      return "neutral";
    default:
      return "navy";
  }
}

export function roleVariant(role: string): BadgeVariant {
  switch (role) {
    case "SUPER_ADMIN":
    case "ADMIN":
      return "gold";
    case "HR":
      return "info";
    case "MANAGER":
      return "navy";
    default:
      return "neutral";
  }
}
