"use client";

import { type ReactNode } from "react";
import type { Session } from "next-auth";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export interface DashboardLayoutProps {
  session: Session;
  children: ReactNode;
}

export function DashboardLayout({ session, children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar role={session.user.role} />
      <div className="pl-64">
        <Header session={session} />
        <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
