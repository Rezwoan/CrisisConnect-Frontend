"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import NotificationBell from "@/components/NotificationBell";
import axios from "axios";
import {
	NavigationMenu,
	NavigationMenuList,
	NavigationMenuItem,
	NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
	ShieldCheck,
	LogOut,
	LayoutDashboard,
	UserCog,
	PlusCircle,
	AlertTriangle,
	Users,
	Megaphone,
} from "lucide-react";

const AUTH_FLOW_PATHS = [
	"/admin/register",
	"/admin/verify-signup",
	"/admin/login",
];

const LINKS = [
	{ href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
	{ href: "/admin/crises", label: "Crises", icon: AlertTriangle },
	{ href: "/admin/crises/new", label: "Declare Crisis", icon: PlusCircle },
	{ href: "/admin/users", label: "Users", icon: Users },
	{ href: "/admin/announcements", label: "Announcements", icon: Megaphone },
];

export default function AdminNavbar() {
	const router = useRouter();
	const pathname = usePathname();
	const [profile, setProfile] = useState<any>(null);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) return;

		axios
			.get(process.env.NEXT_PUBLIC_API_ENDPOINT + "/admin/profile", {
				headers: { Authorization: "Bearer " + token },
			})
			.then((res) => setProfile(res.data))
			.catch(() => {});
	}, [pathname]);

	if (AUTH_FLOW_PATHS.includes(pathname)) {
		return null;
	}

	return (
		<header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/70 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/70">
			<div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
				<div className="flex items-center gap-6">
					<Link
						href="/admin/dashboard"
						className="flex items-center gap-2 group"
					>
						<div className="flex size-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm transition group-hover:bg-blue-700">
							<ShieldCheck className="size-4" />
						</div>
						<span className="font-heading text-base font-bold tracking-tight text-slate-900 dark:text-white">
							CrisisConnect{" "}
							<span className="text-xs text-blue-600 font-medium px-1.5 py-0.5 rounded bg-blue-50 border border-blue-100 dark:bg-blue-950 dark:border-blue-900 dark:text-blue-300 ml-1">
								Admin
							</span>
						</span>
					</Link>

					<NavigationMenu className="hidden md:flex">
						<NavigationMenuList className="gap-1 font-sans text-xs">
							{LINKS.map((link) => {
								const Icon = link.icon;
								const isActive = pathname === link.href;
								return (
									<NavigationMenuItem key={link.href}>
										<NavigationMenuLink
											render={<Link href={link.href} />}
											className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition ${
												isActive
													? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
													: "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
											}`}
										>
											<Icon className="size-3.5" />
											<span>{link.label}</span>
										</NavigationMenuLink>
									</NavigationMenuItem>
								);
							})}
						</NavigationMenuList>
					</NavigationMenu>
				</div>

				<div className="flex items-center gap-3">
					<NotificationBell />

					{/* Round Profile Photo Dropdown */}
					<DropdownMenu>
						<DropdownMenuTrigger className="rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/50 p-0.5 transition cursor-pointer flex items-center">
							{profile?.profileImage ? (
								<img
									src={
										process.env.NEXT_PUBLIC_API_ENDPOINT + profile.profileImage
									}
									alt="Admin Profile"
									className="size-8 rounded-full object-cover border-2 border-blue-600/30 shadow-sm"
								/>
							) : (
								<div className="size-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-heading font-bold text-xs shadow-sm border border-blue-400/30">
									{profile?.fullName
										? profile.fullName.charAt(0).toUpperCase()
										: "A"}
								</div>
							)}
						</DropdownMenuTrigger>

						<DropdownMenuContent
							align="end"
							className="font-sans text-xs min-w-48 p-1"
						>
							<div className="px-2.5 py-2 border-b border-slate-100 dark:border-slate-800">
								<p className="font-heading font-semibold text-slate-900 dark:text-white truncate">
									{profile?.fullName || "Administrator"}
								</p>
								<p className="font-sans text-[11px] text-slate-500 truncate mt-0.5">
									{profile?.user?.email ||
										(typeof window !== "undefined"
											? localStorage.getItem("email")
											: "")}
								</p>
							</div>

							<DropdownMenuItem
								render={<Link href="/admin/profile" />}
								className="cursor-pointer mt-1"
							>
								<UserCog className="size-3.5 mr-2 text-slate-500" />
								<span>Edit Profile</span>
							</DropdownMenuItem>

							<DropdownMenuItem
								className="cursor-pointer text-rose-600 dark:text-rose-400"
								onClick={() => {
									localStorage.removeItem("token");
									localStorage.removeItem("email");
									router.push("/login");
								}}
							>
								<LogOut className="size-3.5 mr-2 text-rose-600" />
								<span>Logout</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	);
}
