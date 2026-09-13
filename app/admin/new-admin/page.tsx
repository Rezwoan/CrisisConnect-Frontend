"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { AceternityCard } from "@/components/ui/aceternity";
import { AlertTriangle, LogOut, ArrowLeft, ShieldAlert } from "lucide-react";

export default function AddAdminIntermediatePage() {
  const router = useRouter();

  function handleConfirmAndProceed() {
    // Remove all saved credentials and session data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("accessToken");
    localStorage.clear();

    // Route directly to Admin Registration
    router.push("/admin/register");
  }

  return (
    <div className="max-w-xl mx-auto py-8">
      <Link
        href="/admin/dashboard"
        className="inline-flex items-center gap-1.5 font-heading text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-6 transition"
      >
        <ArrowLeft className="size-3.5" /> Cancel & Return to Dashboard
      </Link>

      <AceternityCard className="p-6 sm:p-8">
        <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400 mb-4">
          <div className="size-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex items-center justify-center shrink-0">
            <AlertTriangle className="size-6" />
          </div>
          <div>
            <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Security Checkpoint
            </span>
            <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white">
              Administrator Handover Notice
            </h2>
          </div>
        </div>

        <div className="space-y-3 font-sans text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-y border-slate-100 dark:border-slate-800 py-4 my-4">
          <p>
            You are about to enter the <strong>Admin Registration Portal</strong> to onboard a new administrator.
          </p>
          <div className="p-3.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-400 text-xs flex items-start gap-2.5">
            <ShieldAlert className="size-4 shrink-0 mt-0.5" />
            <span>
              <strong>Warning:</strong> To maintain strict access integrity, your current session will be <strong>terminated</strong> and all authorization tokens stored in your browser will be completely cleared.
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Are you sure you want to log out and proceed to register the new admin?
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleConfirmAndProceed}
            className="w-full sm:flex-1 flex items-center justify-center gap-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-heading font-semibold py-2.5 px-4 text-xs transition shadow-md shadow-rose-500/20"
          >
            <LogOut className="size-4" />
            Yes, Log Out & Continue
          </button>

          <Link
            href="/admin/dashboard"
            className="w-full sm:w-auto text-center rounded-lg border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-heading font-semibold py-2.5 px-4 text-xs transition"
          >
            Cancel
          </Link>
        </div>
      </AceternityCard>
    </div>
  );
}