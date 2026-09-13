"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Pusher from "pusher-js";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { statusColor } from "../_components/statusColor";
import { AceternityCard } from "@/components/ui/aceternity";
import {
	Filter,
	RotateCcw,
	UserX,
	UserCheck,
	CheckCircle2,
	AlertCircle,
	Radio,
} from "lucide-react";

export default function UsersPage() {
	const router = useRouter();
	const [users, setUsers] = useState<any[]>([]);
	const [role, setRole] = useState("");
	const [isActive, setIsActive] = useState("");
	const [city, setCity] = useState("");
	const [search, setSearch] = useState("");
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");

	useEffect(() => {
		fetchData();

		// 🔔 Pusher real-time reactive sync when any user's status is toggled
		const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
		const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

		if (pusherKey && pusherCluster) {
			const pusher = new Pusher(pusherKey, { cluster: pusherCluster });
			const channel = pusher.subscribe("crisis-channel");

			channel.bind("user-status-changed", (data: any) => {
				setUsers((prev) =>
					prev.map((u) =>
						u.id === data.id ? { ...u, isActive: data.isActive } : u,
					),
				);
			});

			return () => {
				channel.unbind_all();
				channel.unsubscribe();
				pusher.disconnect();
			};
		}
	}, []);

	async function fetchData(clearFilters?: boolean, overrideIsActive?: string) {
		const token = localStorage.getItem("token");
		if (!token) {
			router.replace("/login");
			return;
		}

		const params: any = {};
		if (!clearFilters) {
			if (role) params.role = role;
			const activeState =
				overrideIsActive !== undefined ? overrideIsActive : isActive;
			if (activeState) params.isActive = activeState;
			if (city) params.city = city;
			if (search) params.search = search;
		}

		try {
			const response = await axios.get(
				process.env.NEXT_PUBLIC_API_ENDPOINT + "/admin/users",
				{ params, headers: { Authorization: "Bearer " + token } },
			);
			setUsers(Array.isArray(response.data) ? response.data : []);
		} catch (error) {
			console.error(error);
		}
	}

	// Action: Deactivate User
	async function handleDeactivate(id: number) {
		const token = localStorage.getItem("token");
		if (!token) return;

		try {
			const response = await axios.patch(
				process.env.NEXT_PUBLIC_API_ENDPOINT +
					"/admin/users/" +
					id +
					"/deactivate",
				{},
				{ headers: { Authorization: "Bearer " + token } },
			);
			setError("");
			setMessage(response.data.message || "User deactivated successfully");
			fetchData();
		} catch (err: any) {
			const msg = err.response?.data?.message;
			setError(Array.isArray(msg) ? msg[0] : msg || "Something went wrong");
		}
	}

	// Action: Reactivate User
	async function handleReactivate(id: number) {
		const token = localStorage.getItem("token");
		if (!token) return;

		try {
			const response = await axios.patch(
				process.env.NEXT_PUBLIC_API_ENDPOINT +
					"/admin/users/" +
					id +
					"/activate",
				{},
				{ headers: { Authorization: "Bearer " + token } },
			);
			setError("");
			setMessage(response.data.message || "User reactivated successfully");
			fetchData();
		} catch (err: any) {
			const msg = err.response?.data?.message;
			setError(Array.isArray(msg) ? msg[0] : msg || "Something went wrong");
		}
	}

	const inactiveUsersCount = users.filter((u) => !u.isActive).length;

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<Header
						title="User Access Directory"
						subtitle="Manage personnel permissions, audit responder accounts, and toggle activation states."
					/>
				</div>
				<div className="flex items-center gap-2">
					{/* Quick Filter for Inactive Users */}
					<button
						type="button"
						onClick={() => {
							setIsActive("false");
							fetchData(false, "false");
						}}
						className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 px-3 py-1.5 font-heading text-xs font-semibold transition hover:bg-amber-100"
					>
						<Radio className="size-3.5" />
						<span>Show Inactive ({inactiveUsersCount})</span>
					</button>
					<BackButton href="/admin/dashboard" label="Dashboard" />
				</div>
			</div>

			<AceternityCard className="p-4">
				<form
					onSubmit={(e) => {
						e.preventDefault();
						fetchData();
					}}
					className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 font-sans text-xs"
				>
					<div>
						<label
							htmlFor="role"
							className="font-heading font-semibold text-slate-700 dark:text-slate-300 block mb-1"
						>
							Role
						</label>
						<select
							id="role"
							className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 p-2 text-foreground focus:ring-2 focus:ring-blue-500/40"
							value={role}
							onChange={(e) => setRole(e.target.value)}
						>
							<option value="">All roles</option>
							<option value="ADMIN">ADMIN</option>
							<option value="NGO">NGO</option>
							<option value="VOLUNTEER">VOLUNTEER</option>
							<option value="DONOR">DONOR</option>
						</select>
					</div>

					<div>
						<label
							htmlFor="isActive"
							className="font-heading font-semibold text-slate-700 dark:text-slate-300 block mb-1"
						>
							Account State
						</label>
						<select
							id="isActive"
							className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 p-2 text-foreground focus:ring-2 focus:ring-blue-500/40"
							value={isActive}
							onChange={(e) => setIsActive(e.target.value)}
						>
							<option value="">All accounts</option>
							<option value="true">Active Only</option>
							<option value="false">Inactive Only</option>
						</select>
					</div>

					<div>
						<label
							htmlFor="city"
							className="font-heading font-semibold text-slate-700 dark:text-slate-300 block mb-1"
						>
							City
						</label>
						<input
							id="city"
							placeholder="e.g. Dhaka"
							className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 p-2 text-foreground focus:ring-2 focus:ring-blue-500/40"
							value={city}
							onChange={(e) => setCity(e.target.value)}
						/>
					</div>

					<div>
						<label
							htmlFor="search"
							className="font-heading font-semibold text-slate-700 dark:text-slate-300 block mb-1"
						>
							Search Email / Name
						</label>
						<input
							id="search"
							placeholder="Search..."
							className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 p-2 text-foreground focus:ring-2 focus:ring-blue-500/40"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</div>

					<div className="sm:col-span-2 md:col-span-4 flex items-center gap-2 pt-1">
						<button
							type="submit"
							className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 font-heading text-xs font-semibold text-white shadow hover:bg-blue-700 transition"
						>
							<Filter className="size-3.5" /> Apply filters
						</button>
						<button
							type="button"
							className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 font-heading text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 transition"
							onClick={() => {
								setRole("");
								setIsActive("");
								setCity("");
								setSearch("");
								fetchData(true);
							}}
						>
							<RotateCcw className="size-3" /> Reset
						</button>
					</div>
				</form>
			</AceternityCard>

			{message && (
				<div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-sans">
					<CheckCircle2 className="size-4 shrink-0" />
					<span>{message}</span>
				</div>
			)}

			{error && (
				<div className="flex items-center gap-2 p-3 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 text-xs font-sans">
					<AlertCircle className="size-4 shrink-0" />
					<span>{error}</span>
				</div>
			)}

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 font-sans">
				{users.map((user) => (
					<Card
						key={user.id}
						className={`border bg-white/70 shadow-sm backdrop-blur-sm flex flex-col justify-between dark:bg-slate-900/60 ${
							user.isActive
								? "border-slate-200/80 dark:border-slate-800"
								: "border-amber-200/80 bg-amber-50/20 dark:border-amber-900/40"
						}`}
					>
						<CardHeader>
							<div className="flex items-start justify-between gap-2">
								<CardTitle className="font-heading text-base font-bold truncate">
									{user.email}
								</CardTitle>
							</div>
							<CardDescription className="text-xs font-sans text-slate-500 truncate">
								{user.admin && user.admin.fullName
									? user.admin.fullName
									: "No profile name registered"}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex flex-wrap gap-1.5">
								<Badge
									className={`border font-heading text-[10px] ${statusColor(user.role)}`}
								>
									{user.role}
								</Badge>
								<Badge
									className={`border font-heading text-[10px] ${statusColor(
										user.isActive ? "ACTIVE" : "INACTIVE",
									)}`}
								>
									{user.isActive ? "ACTIVE" : "INACTIVE"}
								</Badge>
								<Badge
									className={`border font-heading text-[10px] ${statusColor(
										user.isVerified ? "VERIFIED" : "UNVERIFIED",
									)}`}
								>
									{user.isVerified ? "VERIFIED" : "UNVERIFIED"}
								</Badge>
							</div>
							<p className="mt-3 font-sans text-[11px] text-slate-400">
								Joined: {new Date(user.createdAt).toLocaleDateString()}
							</p>
						</CardContent>

						{/* Action Footer: Shows Deactivate if Active, or Reactivate if Inactive */}
						<CardFooter className="border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 py-2 px-4 flex justify-end">
							{user.isActive ? (
								<Button
									variant="destructive"
									size="sm"
									className="font-heading text-xs font-semibold gap-1"
									onClick={() => handleDeactivate(user.id)}
								>
									<UserX className="size-3.5" /> Deactivate
								</Button>
							) : (
								<Button
									variant="default"
									size="sm"
									className="bg-emerald-600 hover:bg-emerald-700 text-white font-heading text-xs font-semibold gap-1 shadow-sm"
									onClick={() => handleReactivate(user.id)}
								>
									<UserCheck className="size-3.5" /> Reactivate
								</Button>
							)}
						</CardFooter>
					</Card>
				))}
			</div>

			{users.length === 0 && (
				<div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm font-sans text-slate-500 dark:border-slate-800">
					No user accounts found matching current query.
				</div>
			)}
		</div>
	);
}
