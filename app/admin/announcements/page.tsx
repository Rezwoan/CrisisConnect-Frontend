"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import { Badge } from "@/components/ui/badge";
import { AceternityCard } from "@/components/ui/aceternity";
import { statusColor } from "../_components/statusColor";
import {
	Megaphone,
	PlusCircle,
	Trash2,
	ExternalLink,
	Users,
	Calendar,
	AlertCircle,
	CheckCircle2,
} from "lucide-react";

export default function AllAnnouncementsPage() {
	const router = useRouter();
	const [announcements, setAnnouncements] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [message, setMessage] = useState("");

	useEffect(() => {
		fetchAnnouncements();
	}, []);

	async function fetchAnnouncements() {
		const token = localStorage.getItem("token");
		if (!token) {
			router.replace("/login");
			return;
		}

		try {
			const response = await axios.get(
				process.env.NEXT_PUBLIC_API_ENDPOINT + "/admin/announcement",
				{ headers: { Authorization: "Bearer " + token } },
			);
			setAnnouncements(Array.isArray(response.data) ? response.data : []);
		} catch (err: any) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	}

	async function handleDelete(id: number) {
		if (
			!window.confirm(`Are you sure you want to delete Announcement #${id}?`)
		) {
			return;
		}

		const token = localStorage.getItem("token");
		if (!token) return;

		try {
			await axios.delete(
				process.env.NEXT_PUBLIC_API_ENDPOINT + "/admin/announcement/" + id,
				{ headers: { Authorization: "Bearer " + token } },
			);
			setMessage(`Announcement #${id} removed successfully.`);
			setError("");
			fetchAnnouncements();
		} catch (err: any) {
			const msg = err.response?.data?.message;
			setError(
				Array.isArray(msg) ? msg[0] : msg || "Failed to remove announcement",
			);
			setMessage("");
		}
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<Header
						title="Broadcast Bulletin Records"
						subtitle="Archive of all urgent notifications and responder announcements."
					/>
				</div>
				<div className="flex items-center gap-2">
					<Link
						href="/admin/announcements/new"
						className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 font-heading text-xs font-semibold shadow-sm transition"
					>
						<PlusCircle className="size-3.5" /> New announcement
					</Link>
					<BackButton href="/admin/dashboard" label="Dashboard" />
				</div>
			</div>

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

			{loading ? (
				<div className="p-8 text-center text-sm font-sans text-slate-500">
					Loading announcements archive...
				</div>
			) : announcements.length === 0 ? (
				<AceternityCard className="p-8 text-center text-slate-500 font-sans text-sm">
					No announcements broadcasted yet. Click "Broadcast New" to transmit
					alerts.
				</AceternityCard>
			) : (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{announcements.map((announcement) => (
						<AceternityCard
							key={announcement.id}
							className="flex flex-col justify-between p-5 border border-slate-200/80 dark:border-slate-800"
						>
							<div>
								<div className="flex items-start justify-between gap-2">
									<div className="flex items-center gap-2">
										<Megaphone className="size-4 text-blue-600 dark:text-blue-400 shrink-0" />
										<h3 className="font-heading text-base font-bold text-slate-900 dark:text-white line-clamp-1">
											{announcement.title}
										</h3>
									</div>
									{announcement.isUrgent && (
										<Badge
											className={`border font-heading text-[10px] shrink-0 ${statusColor("URGENT")}`}
										>
											URGENT
										</Badge>
									)}
								</div>

								<p className="font-sans text-xs text-slate-600 dark:text-slate-300 mt-2.5 line-clamp-3 leading-relaxed">
									{announcement.body}
								</p>

								<div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5 font-sans text-[11px] text-slate-500">
									<div className="flex items-center justify-between">
										<span className="inline-flex items-center gap-1.5">
											<Calendar className="size-3 text-slate-400" />
											{new Date(
												announcement.createdAt,
											).toLocaleDateString()} at{" "}
											{new Date(announcement.createdAt).toLocaleTimeString([], {
												hour: "2-digit",
												minute: "2-digit",
											})}
										</span>
										<span className="inline-flex items-center gap-1">
											<Users className="size-3 text-slate-400" />
											{announcement.recipients?.length || 0} recipients
										</span>
									</div>
									{announcement.admin && (
										<p className="text-[10px] text-slate-400">
											Dispatched by:{" "}
											<strong className="text-slate-600 dark:text-slate-300">
												{announcement.admin.fullName}
											</strong>
										</p>
									)}
								</div>
							</div>

							<div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
								<Link
									href={"/admin/announcements/" + announcement.id}
									className="font-heading text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
								>
									<ExternalLink className="size-3" /> View & Recipients
								</Link>

								<button
									type="button"
									onClick={() => handleDelete(announcement.id)}
									className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-heading font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
								>
									<Trash2 className="size-3" /> Remove
								</button>
							</div>
						</AceternityCard>
					))}
				</div>
			)}
		</div>
	);
}
