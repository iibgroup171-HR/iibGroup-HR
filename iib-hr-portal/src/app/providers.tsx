"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#0B2545",
            color: "#F8FAFC",
            fontSize: "14px",
            borderRadius: "8px",
          },
          success: { iconTheme: { primary: "#F59E0B", secondary: "#0B2545" } },
          error: { iconTheme: { primary: "#EF4444", secondary: "#F8FAFC" } },
        }}
      />
    </SessionProvider>
  );
}
