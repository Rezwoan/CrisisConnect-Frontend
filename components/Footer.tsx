import { ShieldCheck } from "lucide-react";

export default function Footer() {
	return (
		<footer className="fixed bottom-0 z-50 w-full border-t border-slate-200/80 bg-white/50 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/50 py-6 px-6">
			<div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
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
