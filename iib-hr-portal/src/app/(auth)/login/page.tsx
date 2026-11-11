"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Lock, Mail, ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const DEMO_ACCOUNTS = [
  { email: "admin@iibanks.com", role: "Super Admin" },
  { email: "hr@iibanks.com", role: "HR Manager" },
  { email: "manager@iibanks.com", role: "Manager" },
  { email: "employee@iibanks.com", role: "Employee" },
];
const DEMO_PASSWORD = "IIB@2026!";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError(res.error === "CredentialsSignin" ? "Invalid email or password." : res.error);
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B2545] px-4 py-10">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500 text-xl font-black text-[#0B2545] shadow-lg">
            iib
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            iib Group <span className="text-amber-500">HR Portal</span>
          </h1>
          <p className="text-sm text-slate-300">Corporate Banking · People Operations Suite</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white p-8 shadow-2xl ring-1 ring-white/10">
          <h2 className="text-lg font-semibold text-[#0B2545]">Sign in to your account</h2>
          <p className="mt-1 text-sm text-slate-500">Use your iibanks.com credentials.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-[34px] h-4 w-4 text-slate-400" />
              <Input
                type="email"
                name="email"
                placeholder="you@iibanks.com"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-[34px] h-4 w-4 text-slate-400" />
              <Input
                type="password"
                name="password"
                placeholder="••••••••"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" isLoading={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          {/* Demo box */}
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-800">
              <ShieldCheck className="h-4 w-4" /> Demo accounts
            </p>
            <div className="mt-2 space-y-1">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => {
                    setEmail(acc.email);
                    setPassword(DEMO_PASSWORD);
                  }}
                  className="flex w-full items-center justify-between rounded-md px-2 py-1 text-left text-xs hover:bg-amber-100"
                >
                  <span className="font-medium text-[#0B2545]">{acc.email}</span>
                  <span className="text-amber-700">{acc.role}</span>
                </button>
              ))}
            </div>
            <p className="mt-2 border-t border-amber-200 pt-2 text-center text-xs text-amber-800">
              Password for all demo accounts: <code className="font-semibold">{DEMO_PASSWORD}</code>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} iib Group — iibanks.com · Secure Employee Access Only
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0B2545]">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
