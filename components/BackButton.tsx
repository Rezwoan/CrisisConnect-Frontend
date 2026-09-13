import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BackButton({
  href,
  label = "Back",
  className,
}: {
  href: string;
  label?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border border-slate-200/90 bg-white/80 px-3.5 py-1.5 font-heading text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white dark:hover:border-slate-700",
        className
      )}
    >
      <ArrowLeft className="size-3.5" />
      <span>{label}</span>
    </Link>
  );
}