"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import type { Session } from "next-auth";
import { Avatar } from "@/components/ui/Avatar";
import { Badge, roleVariant } from "@/components/ui/Badge";
import { getGreeting } from "@/lib/utils";
import { GlobalSearch } from "@/components/layout/GlobalSearch";

export interface HeaderProps {
  session: Session;
}

export function Header({ session }: HeaderProps) {
  const [greeting, setGreeting] = useState(() => getGreeting());
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-4 px-6">
        <div>
          <p className="text-sm text-slate-500">
            {greeting}, <span className="font-semibold text-[#0B2545]">{session.user.name}</span> 👋
          </p>
          <p className="text-xs text-slate-400">{session.user.email}</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Global search trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden items-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-500 transition-colors hover:border-[#0B2545]/40 hover:bg-white md:inline-flex"
          >
            <Search className="h-4 w-4" />
            <span>Search employees, leave, documents…</span>
            <kbd className="rounded border border-slate-300 bg-white px-1.5 text-[10px] font-semibold text-slate-400">
              ⌘K
            </kbd>
          </button>
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Open search"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 text-slate-500 hover:bg-slate-50 md:hidden"
          >
            <Search className="h-4 w-4" />
          </button>

          <Badge variant={roleVariant(session.user.role)}>{session.user.role.replace("_", " ")}</Badge>
          <Avatar name={session.user.name ?? "User"} size="sm" />
        </div>
      </div>

      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
