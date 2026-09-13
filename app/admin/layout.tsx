"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import AdminNavbar from "./_components/AdminNavbar";
import Footer from "@/components/Footer";
import { BackgroundGrid } from "@/components/ui/aceternity";

const AUTH_FLOW_PATHS = [
	"/admin/register",
	"/admin/verify-signup",
	"/admin/login",
];

export default function AdminLayout({ children }: { children: ReactNode }) {
	const pathname = usePathname();

	if (AUTH_FLOW_PATHS.includes(pathname)) {
		return <>{children}</>;
	}

	return (
		<BackgroundGrid className="flex min-h-screen flex-col">
			<AdminNavbar />
			<main className="mx-auto max-w-7xl flex-1 p-4 sm:p-6 lg:p-8 font-sans w-full">
				{children}
			</main>
			<Footer />
		</BackgroundGrid>
	);
}
