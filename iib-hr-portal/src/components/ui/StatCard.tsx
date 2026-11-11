import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
  accent?: "navy" | "gold" | "emerald" | "red";
  className?: string;
}

const accentClasses: Record<NonNullable<StatCardProps["accent"]>, string> = {
  navy: "bg-[#0B2545] text-white",
  gold: "bg-amber-500 text-[#0B2545]",
  emerald: "bg-emerald-600 text-white",
  red: "bg-red-600 text-white",
};

export function StatCard({ title, value, icon: Icon, hint, accent = "navy", className }: StatCardProps) {
  return (
    <div
      className={cn(
        "flex items-start justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-card",
        className
      )}
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
        <p className="mt-1.5 text-2xl font-bold tracking-tight text-[#0B2545]">{value}</p>
        {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
      </div>
      <div className={cn("rounded-lg p-2.5", accentClasses[accent])}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  );
}
