"use client";

import { usePathname } from "next/navigation";
import { ShieldCheck } from "lucide-react";

const AUTH_FLOW_PATHS = [
	"/admin/register",
	"/admin/verify-signup",
	"/admin/login",
];

export default function AdminFooter() {
	const pathname = usePathname();

	if (AUTH_FLOW_PATHS.includes(pathname)) {
		return null;
	}

	return (
		<footer className="w-full border-t border-slate-200/80 bg-white/70 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/70 mt-auto">
			<div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6 text-center sm:text-left">
				<div className="flex items-center gap-2">
					<ShieldCheck className="size-4 text-blue-600 dark:text-blue-400" />
					<span className="font-heading text-xs font-semibold text-slate-800 dark:text-slate-200">
						CrisisConnect Network
					</span>
				</div>

				<p className="font-sans text-xs text-slate-500 dark:text-slate-400">
					© {new Date().getFullYear()} CrisisConnect. Real-time Emergency
					Response & Disaster Management Infrastructure.
				</p>
			</div>
		</footer>
	);
}
