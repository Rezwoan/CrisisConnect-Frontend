"use client";

import React from "react";
import { cn } from "@/lib/utils";

export function BackgroundGrid({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"relative min-h-screen w-full bg-background bg-grid-pattern overflow-x-hidden",
				className,
			)}
		>
			{/* Ambient Radial Spotlight */}
			<div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] bg-background" />
			<div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[700px] rounded-full bg-gradient-to-tr from-blue-600/15 to-indigo-600/20 blur-[120px]" />
			<div className="relative z-10">{children}</div>
		</div>
	);
}

export function AceternityCard({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"group relative rounded-2xl border border-slate-200/80 bg-white/70 p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-slate-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-slate-700",
				className,
			)}
		>
			<div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-blue-500/[0.03] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
			<div className="relative z-10">{children}</div>
		</div>
	);
}
