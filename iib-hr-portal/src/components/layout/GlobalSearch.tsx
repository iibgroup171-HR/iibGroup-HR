"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { User, CalendarDays, FileText, Loader2, Search } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";

interface SearchResult {
  employees: { id: string; name: string; email: string; jobTitle?: string | null }[];
  leaveRequests: { id: string; type: string; status: string; startDate: string; endDate: string }[];
  documents: { id: string; title: string; category: string }[];
}

export interface GlobalSearchProps {
  open: boolean;
  onClose: () => void;
}

export function GlobalSearch({ open, onClose }: GlobalSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);

  // Cmd+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setQuery("");
        setResults(null);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (!open) return;
    if (query.trim().length < 2) {
      setResults(null);
      return;
    }
    const controller = new AbortController();
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`, {
          signal: controller.signal,
        });
        if (res.ok) setResults((await res.json()) as SearchResult);
      } catch {
        /* aborted */
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [query, open]);

  const go = useCallback(
    (href: string) => {
      onClose();
      router.push(href);
    },
    [onClose, router]
  );

  const hasResults =
    results &&
    (results.employees.length > 0 || results.leaveRequests.length > 0 || results.documents.length > 0);

  return (
    <Modal open={open} onClose={onClose} title="Global Search" description="Find people, requests and documents" size="md">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type at least 2 characters…"
          className="h-11 w-full rounded-lg border border-slate-300 pl-9 pr-3 text-sm focus:border-[#0B2545] focus:outline-none focus:ring-2 focus:ring-[#0B2545]/20"
        />
        {loading && <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-amber-500" />}
      </div>

      {!results && query.trim().length < 2 && (
        <p className="py-6 text-center text-sm text-slate-400">Start typing to search across the portal.</p>
      )}

      {results && !hasResults && !loading && (
        <p className="py-6 text-center text-sm text-slate-400">No matches for “{query}”.</p>
      )}

      {hasResults && (
        <div className="space-y-4">
          {results.employees.length > 0 && (
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">Employees</p>
              {results.employees.map((emp) => (
                <button
                  key={emp.id}
                  onClick={() => go("/employees")}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-50"
                  )}
                >
                  <span className="rounded-md bg-[#0B2545]/10 p-1.5 text-[#0B2545]">
                    <User className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="font-medium text-[#0B2545]">{emp.name}</span>
                    <span className="block text-xs text-slate-400">
                      {emp.email}
                      {emp.jobTitle ? ` · ${emp.jobTitle}` : ""}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          )}

          {results.leaveRequests.length > 0 && (
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">Leave Requests</p>
              {results.leaveRequests.map((lr) => (
                <button
                  key={lr.id}
                  onClick={() => go("/leave")}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-50"
                >
                  <span className="rounded-md bg-amber-500/15 p-1.5 text-amber-600">
                    <CalendarDays className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="font-medium text-[#0B2545]">{lr.type.replace(/_/g, " ")} leave</span>
                    <span className="block text-xs text-slate-400">
                      {new Date(lr.startDate).toLocaleDateString()} → {new Date(lr.endDate).toLocaleDateString()} ·{" "}
                      {lr.status}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          )}

          {results.documents.length > 0 && (
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">Documents</p>
              {results.documents.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => go("/documents")}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-50"
                >
                  <span className="rounded-md bg-sky-50 p-1.5 text-sky-600">
                    <FileText className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="font-medium text-[#0B2545]">{doc.title}</span>
                    <span className="block text-xs text-slate-400">{doc.category.replace(/_/g, " ")}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
