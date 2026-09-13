"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import Header from "@/components/Header";
import Carousel from "../_components/Carousel";
import SeverityChart from "../_components/SeverityChart";
import { AceternityCard } from "@/components/ui/aceternity";
import {
	AlertTriangle,
	PlusCircle,
	ListFilter,
	Users,
	ShieldAlert,
	Megaphone,
	Building2,
	HeartHandshake,
	CircleDollarSign,
	ArrowUpRight,
	Activity,
	UserCog,
	UserPlus,
} from "lucide-react";

export default function AdminDashboardPage() {
	const router = useRouter();
	const [crises, setCrises] = useState<any[]>([]);
	const [users, setUsers] = useState<any[]>([]);
	const [adminUser, setAdminUser] = useState<any>(null);
	const [email, setEmail] = useState("");

	useEffect(() => {
		fetchDashboardData();
	}, []);

	async function fetchDashboardData() {
		setEmail(localStorage.getItem("email") || "");
		const token = localStorage.getItem("token");
		if (!token) {
			router.replace("/login");
			return;
		}

		try {
			const [crisisRes, usersRes, profileRes] = await Promise.all([
				axios.get(process.env.NEXT_PUBLIC_API_ENDPOINT + "/admin/crisis"),
				axios.get(process.env.NEXT_PUBLIC_API_ENDPOINT + "/admin/users", {
					headers: { Authorization: "Bearer " + token },
				}),
				axios.get(process.env.NEXT_PUBLIC_API_ENDPOINT + "/admin/profile", {
					headers: { Authorization: "Bearer " + token },
				}),
			]);

			setCrises(Array.isArray(crisisRes.data) ? crisisRes.data : []);
			setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
			setAdminUser(profileRes.data);
		} catch (err) {
			console.error("Failed to load dashboard metrics:", err);
		}
	}

	// Calculated Metrics
	const activeCrises = crises.filter((c) => c.status === "ACTIVE");
	const criticalCrises = crises.filter((c) => c.severity === "CRITICAL");
	const containedCrises = crises.filter((c) => c.status === "CONTAINED");
	const resolvedCrises = crises.filter((c) => c.status === "RESOLVED");

	const ngoCount = users.filter((u) => u.role === "NGO").length;
	const volunteerCount = users.filter((u) => u.role === "VOLUNTEER").length;
	const donorCount = users.filter((u) => u.role === "DONOR").length;

	const currentEmail = email || adminUser?.user?.email || "";
	const currentName = adminUser?.fullName || "Admin";

	return (
		<div className="space-y-6">
			{/* Header with Admin Dashboard title & user login details */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				<Header
					title="Admin Dashboard"
					subtitle={
						currentEmail
							? `Logged in as ${currentName} (${currentEmail})`
							: "Live incident monitoring, rapid action dispatch, and humanitarian network analytics."
					}
				/>

				<div className="flex flex-wrap items-center gap-2 mb-4 md:mb-0">
					<Link
						href="/admin/profile"
						className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 hover:bg-slate-100 dark:hover:bg-slate-800 px-3.5 py-2 font-heading text-xs font-semibold text-slate-800 dark:text-slate-200 transition shadow-sm"
					>
						<UserCog className="size-3.5 text-blue-600 dark:text-blue-400" />
						<span>Edit Profile</span>
					</Link>

					<Link
						href="/admin/new-admin"
						className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-900 text-white px-3.5 py-2 font-heading text-xs font-semibold transition shadow-sm"
					>
						<UserPlus className="size-3.5" />
						<span>Add New Admin</span>
					</Link>
				</div>
			</div>

			{/* Row 1: Clickable KPI Metric Cards */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<Link href="/admin/crises?status=ACTIVE" className="group">
					<AceternityCard className="p-4 transition-all duration-200 group-hover:-translate-y-1 group-hover:border-rose-300 dark:group-hover:border-rose-900">
						<div className="flex items-center justify-between">
							<span className="font-sans text-xs font-semibold text-slate-500 uppercase tracking-wider">
								Active Crises
							</span>
							<div className="size-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center dark:bg-rose-950/40">
								<AlertTriangle className="size-4" />
							</div>
						</div>
						<div className="mt-3 flex items-baseline justify-between">
							<span className="font-heading text-3xl font-extrabold text-slate-900 dark:text-white">
								{activeCrises.length}
							</span>
							<span className="inline-flex items-center text-[11px] font-heading font-semibold text-rose-600 group-hover:underline">
								View active <ArrowUpRight className="size-3 ml-0.5" />
							</span>
						</div>
					</AceternityCard>
				</Link>

				<Link href="/admin/crises?severity=CRITICAL" className="group">
					<AceternityCard className="p-4 transition-all duration-200 group-hover:-translate-y-1 group-hover:border-orange-300 dark:group-hover:border-orange-900">
						<div className="flex items-center justify-between">
							<span className="font-sans text-xs font-semibold text-slate-500 uppercase tracking-wider">
								Critical Severity
							</span>
							<div className="size-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center dark:bg-orange-950/40">
								<ShieldAlert className="size-4" />
							</div>
						</div>
						<div className="mt-3 flex items-baseline justify-between">
							<span className="font-heading text-3xl font-extrabold text-slate-900 dark:text-white">
								{criticalCrises.length}
							</span>
							<span className="inline-flex items-center text-[11px] font-heading font-semibold text-orange-600 group-hover:underline">
								View critical <ArrowUpRight className="size-3 ml-0.5" />
							</span>
						</div>
					</AceternityCard>
				</Link>

				<Link href="/admin/crises" className="group">
					<AceternityCard className="p-4 transition-all duration-200 group-hover:-translate-y-1 group-hover:border-blue-300 dark:group-hover:border-blue-900">
						<div className="flex items-center justify-between">
							<span className="font-sans text-xs font-semibold text-slate-500 uppercase tracking-wider">
								Total Incident Logs
							</span>
							<div className="size-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center dark:bg-blue-950/40">
								<Activity className="size-4" />
							</div>
						</div>
						<div className="mt-3 flex items-baseline justify-between">
							<span className="font-heading text-3xl font-extrabold text-slate-900 dark:text-white">
								{crises.length}
							</span>
							<span className="inline-flex items-center text-[11px] font-heading font-semibold text-blue-600 group-hover:underline">
								Explore all <ArrowUpRight className="size-3 ml-0.5" />
							</span>
						</div>
					</AceternityCard>
				</Link>

				<Link href="/admin/users" className="group">
					<AceternityCard className="p-4 transition-all duration-200 group-hover:-translate-y-1 group-hover:border-indigo-300 dark:group-hover:border-indigo-900">
						<div className="flex items-center justify-between">
							<span className="font-sans text-xs font-semibold text-slate-500 uppercase tracking-wider">
								Network Personnel
							</span>
							<div className="size-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center dark:bg-indigo-950/40">
								<Users className="size-4" />
							</div>
						</div>
						<div className="mt-3 flex items-baseline justify-between">
							<span className="font-heading text-3xl font-extrabold text-slate-900 dark:text-white">
								{users.length}
							</span>
							<span className="inline-flex items-center text-[11px] font-heading font-semibold text-indigo-600 group-hover:underline">
								Manage users <ArrowUpRight className="size-3 ml-0.5" />
							</span>
						</div>
					</AceternityCard>
				</Link>
			</div>

			{/* Row 2: Carousel & Quick Dispatch */}
			<div className="grid gap-6 lg:grid-cols-3">
				<AceternityCard className="lg:col-span-2">
					<div className="flex items-center justify-between mb-4">
						<div className="flex items-center gap-2">
							<AlertTriangle className="size-4 text-rose-600" />
							<h2 className="font-heading text-lg font-bold">
								Active Urgent Crises
							</h2>
						</div>
						<Link
							href="/admin/crises?status=ACTIVE"
							className="text-xs font-heading font-semibold text-blue-600 hover:underline flex items-center gap-1"
						>
							Browse all active <ArrowUpRight className="size-3" />
						</Link>
					</div>
					<Carousel crises={activeCrises.slice(0, 5)} />
				</AceternityCard>

				<AceternityCard className="flex flex-col justify-between">
					<div>
						<h2 className="font-heading text-lg font-bold mb-1">
							Quick Dispatch
						</h2>
						<p className="font-sans text-xs text-slate-500 dark:text-slate-400 mb-4">
							Trigger alerts, edit profile, or onboard administrators.
						</p>
					</div>

					<div className="flex flex-col gap-2 font-sans">
						<Link
							href="/admin/crises/new"
							className="flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 font-heading text-xs font-semibold shadow-sm transition"
						>
							<PlusCircle className="size-3.5" /> Declare a Crisis
						</Link>

						<Link
							href="/admin/announcements/new"
							className="flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 px-3.5 py-2 font-heading text-xs font-semibold transition"
						>
							<Megaphone className="size-3.5 text-indigo-500" /> Broadcast
							Bulletin
						</Link>

						<Link
							href="/admin/profile"
							className="flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 px-3.5 py-2 font-heading text-xs font-semibold transition"
						>
							<UserCog className="size-3.5 text-blue-500" /> Edit Admin Profile
						</Link>

						<Link
							href="/admin/new-admin"
							className="flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 px-3.5 py-2 font-heading text-xs font-semibold transition text-rose-600 dark:text-rose-400"
						>
							<UserPlus className="size-3.5 text-rose-500" /> Add New Admin
						</Link>

						<Link
							href="/admin/crises"
							className="flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 px-3.5 py-2 font-heading text-xs font-semibold transition"
						>
							<ListFilter className="size-3.5 text-slate-500" /> Browse All
							Records
						</Link>
					</div>
				</AceternityCard>
			</div>

			{/* Row 3: Visual Analytics */}
			<div className="grid gap-6 lg:grid-cols-3">
				<Link href="/admin/crises" className="group">
					<AceternityCard className="h-full transition hover:border-slate-300 dark:hover:border-slate-700">
						<div className="flex items-center justify-between mb-1">
							<h3 className="font-heading text-base font-bold group-hover:text-blue-600 transition">
								Severity Breakdown
							</h3>
							<ArrowUpRight className="size-3.5 text-slate-400 group-hover:text-blue-600" />
						</div>
						<p className="font-sans text-xs text-slate-500 mb-4">
							Click to view all incidents filtered by severity.
						</p>
						<SeverityChart crises={crises} />
					</AceternityCard>
				</Link>

				<Link href="/admin/crises" className="group">
					<AceternityCard className="h-full flex flex-col justify-between transition hover:border-slate-300 dark:hover:border-slate-700">
						<div>
							<div className="flex items-center justify-between mb-1">
								<h3 className="font-heading text-base font-bold group-hover:text-blue-600 transition">
									Lifecycle Status
								</h3>
								<ArrowUpRight className="size-3.5 text-slate-400 group-hover:text-blue-600" />
							</div>
							<p className="font-sans text-xs text-slate-500 mb-4">
								Operational status of all logged crisis events.
							</p>

							<div className="space-y-3 font-sans text-xs">
								<div>
									<div className="flex justify-between font-semibold mb-1">
										<span className="text-emerald-700 dark:text-emerald-400">
											ACTIVE
										</span>
										<span>{activeCrises.length}</span>
									</div>
									<div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
										<div
											className="h-full bg-emerald-500 rounded-full"
											style={{
												width: `${crises.length ? (activeCrises.length / crises.length) * 100 : 0}%`,
											}}
										/>
									</div>
								</div>

								<div>
									<div className="flex justify-between font-semibold mb-1">
										<span className="text-amber-700 dark:text-amber-400">
											CONTAINED
										</span>
										<span>{containedCrises.length}</span>
									</div>
									<div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
										<div
											className="h-full bg-amber-500 rounded-full"
											style={{
												width: `${crises.length ? (containedCrises.length / crises.length) * 100 : 0}%`,
											}}
										/>
									</div>
								</div>

								<div>
									<div className="flex justify-between font-semibold mb-1">
										<span className="text-slate-600 dark:text-slate-400">
											RESOLVED
										</span>
										<span>{resolvedCrises.length}</span>
									</div>
									<div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
										<div
											className="h-full bg-slate-400 rounded-full"
											style={{
												width: `${crises.length ? (resolvedCrises.length / crises.length) * 100 : 0}%`,
											}}
										/>
									</div>
								</div>
							</div>
						</div>

						<div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-4 text-[11px] text-slate-500 font-sans">
							Resolution rate:{" "}
							<strong className="text-slate-800 dark:text-slate-200">
								{crises.length
									? Math.round((resolvedCrises.length / crises.length) * 100)
									: 0}
								%
							</strong>
						</div>
					</AceternityCard>
				</Link>

				<Link href="/admin/users" className="group">
					<AceternityCard className="h-full flex flex-col justify-between transition hover:border-slate-300 dark:hover:border-slate-700">
						<div>
							<div className="flex items-center justify-between mb-1">
								<h3 className="font-heading text-base font-bold group-hover:text-blue-600 transition">
									Humanitarian Roster
								</h3>
								<ArrowUpRight className="size-3.5 text-slate-400 group-hover:text-blue-600" />
							</div>
							<p className="font-sans text-xs text-slate-500 mb-4">
								Active organizations, field staff, and capital contributors.
							</p>

							<div className="space-y-2.5 font-sans text-xs">
								<div className="flex items-center justify-between p-2 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50">
									<span className="flex items-center gap-2 font-medium text-indigo-800 dark:text-indigo-300">
										<Building2 className="size-3.5 text-indigo-600" /> Partner
										NGOs
									</span>
									<span className="font-heading font-bold">{ngoCount}</span>
								</div>

								<div className="flex items-center justify-between p-2 rounded-lg bg-sky-50/50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/50">
									<span className="flex items-center gap-2 font-medium text-sky-800 dark:text-sky-300">
										<HeartHandshake className="size-3.5 text-sky-600" /> Field
										Volunteers
									</span>
									<span className="font-heading font-bold">
										{volunteerCount}
									</span>
								</div>

								<div className="flex items-center justify-between p-2 rounded-lg bg-teal-50/50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/50">
									<span className="flex items-center gap-2 font-medium text-teal-800 dark:text-teal-300">
										<CircleDollarSign className="size-3.5 text-teal-600" /> Aid
										Donors
									</span>
									<span className="font-heading font-bold">{donorCount}</span>
								</div>
							</div>
						</div>

						<div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-4 text-[11px] text-slate-500 font-sans">
							Total registered personnel:{" "}
							<strong className="text-slate-800 dark:text-slate-200">
								{users.length}
							</strong>
						</div>
					</AceternityCard>
				</Link>
			</div>
		</div>
	);
}
