"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  CheckSquare,
  FolderKanban,
  LogOut,
  Clock,
  FileText,
  Settings,
} from "lucide-react";
import { cn, canApprove, roleRank } from "@/lib/utils";

export interface SidebarProps {
  role: string;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  visible: (role: string) => boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, visible: () => true },
  { label: "Employees", href: "/employees", icon: Users, visible: () => true },
  { label: "Leave", href: "/leave", icon: CalendarDays, visible: () => true },
  { label: "Approvals", href: "/leave/approvals", icon: CheckSquare, visible: (r) => canApprove(r) },
  { label: "Attendance", href: "/attendance", icon: Clock, visible: () => true },
  { label: "Documents", href: "/documents", icon: FileText, visible: () => true },
  { label: "Cases", href: "/cases", icon: FolderKanban, visible: () => true },
  { label: "Settings", href: "/settings", icon: Settings, visible: (r) => roleRank(r) >= roleRank("HR") },
];

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-[#0B2545] text-slate-200">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 font-black text-[#0B2545]">
          iib
        </div>
        <div className="leading-tight">
          <p className="text-base font-bold text-white">iib Group</p>
          <p className="text-xs font-semibold tracking-wide text-amber-500">HR Portal</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.filter((item) => item.visible(role)).map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md border-l-2 border-transparent px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-white/10 text-white border-l-2 border-amber-500"
                  : "text-slate-200 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="h-4.5 w-4.5 h-[18px] w-[18px]" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer / logout */}
      <div className="border-t border-white/10 p-3">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Sign out
        </button>
        <p className="mt-2 px-3 text-[10px] uppercase tracking-widest text-slate-400/60">
          © {new Date().getFullYear()} iib Group · iibanks.com
        </p>
      </div>
    </aside>
  );
}
