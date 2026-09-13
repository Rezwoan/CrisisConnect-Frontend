// components/TopBar.tsx
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function TopBar() {
	return (
		<header className="sticky top-0 z-30 w-full border-b border-slate-200/80 bg-white/70 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/70">
			<div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
				<Link href="/" className="flex items-center gap-2.5 group">
					<div className="flex size-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm transition group-hover:bg-blue-700">
						<ShieldCheck className="size-4.5" />
					</div>
					<span className="font-heading text-lg font-bold tracking-tight text-slate-900 dark:text-white">
						CrisisConnect
					</span>
				</Link>
				<span className="hidden sm:inline-block font-sans text-xs text-slate-500 dark:text-slate-400">
					Emergency Response & Aid Coordination
				</span>
			</div>
		</header>
	);
}
