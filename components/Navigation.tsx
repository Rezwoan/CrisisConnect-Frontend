"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LogIn, UserPlus } from "lucide-react";

export default function Navigation() {
	const pathname = usePathname();

	const isHome = pathname === "/";
	const isLogin = pathname === "/login";
	const isRegister = pathname === "/register";

	return (
		<nav className="mb-8 flex items-center justify-center gap-1.5 p-1.5 rounded-xl border border-slate-200/80 bg-white/70 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/70 mx-auto max-w-fit">
			<Link
				href="/"
				className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 font-heading text-xs font-semibold transition-all duration-200 ${
					isHome
						? "bg-blue-600 text-white shadow-sm"
						: "text-slate-700 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
				}`}
			>
				<Home
					className={`size-3.5 ${isHome ? "text-white" : "text-blue-600 dark:text-blue-400"}`}
				/>
				<span>Home</span>
			</Link>

			<Link
				href="/login"
				className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 font-heading text-xs font-semibold transition-all duration-200 ${
					isLogin
						? "bg-blue-600 text-white shadow-sm"
						: "text-slate-700 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
				}`}
			>
				<LogIn
					className={`size-3.5 ${isLogin ? "text-white" : "text-blue-600 dark:text-blue-400"}`}
				/>
				<span>Login</span>
			</Link>

			<Link
				href="/register"
				className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 font-heading text-xs font-semibold transition-all duration-200 ${
					isRegister
						? "bg-blue-600 text-white shadow-sm"
						: "text-slate-700 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
				}`}
			>
				<UserPlus
					className={`size-3.5 ${isRegister ? "text-white" : "text-blue-600 dark:text-blue-400"}`}
				/>
				<span>Register</span>
			</Link>
		</nav>
	);
}
