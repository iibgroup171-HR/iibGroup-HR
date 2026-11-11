import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge conditional Tailwind classes safely.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Calculate the number of business days (Mon–Fri) between two dates inclusive.
 */
export function calculateBusinessDays(start: Date, end: Date): number {
  if (!(start instanceof Date) || !(end instanceof Date) || isNaN(start.getTime()) || isNaN(end.getTime())) {
    return 0;
  }
  if (end < start) return 0;

  const s = new Date(Date.UTC(start.getFullYear(), start.getMonth(), start.getDate()));
  const e = new Date(Date.UTC(end.getFullYear(), end.getMonth(), end.getDate()));

  let count = 0;
  const cur = new Date(s);
  while (cur <= e) {
    const day = cur.getUTCDay();
    if (day !== 0 && day !== 6) count += 1;
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return count;
}

/**
 * Time-based greeting for the header.
 */
export function getGreeting(date: Date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

/**
 * Role hierarchy helper: returns a numeric rank for a role.
 */
const ROLE_RANK: Record<string, number> = {
  EMPLOYEE: 1,
  MANAGER: 2,
  HR: 3,
  ADMIN: 4,
  SUPER_ADMIN: 5,
};

export function roleRank(role?: string | null): number {
  if (!role) return 0;
  return ROLE_RANK[role] ?? 0;
}

/**
 * True when the role can view approvals (MANAGER and above).
 */
export function canApprove(role?: string | null): boolean {
  return roleRank(role) >= roleRank("MANAGER");
}
