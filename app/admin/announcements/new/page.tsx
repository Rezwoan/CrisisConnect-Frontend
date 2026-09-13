"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import axios from "axios";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/BackButton";
import { Badge } from "@/components/ui/badge";
import { statusColor } from "../../_components/statusColor";
import { AceternityCard } from "@/components/ui/aceternity";
import { Send, AlertCircle, ArrowLeft, Bell } from "lucide-react";

const announcementSchema = z.object({
	title: z.string().min(1, "Title is required"),
	body: z.string().min(1, "Body is required"),
	recipientUserIds: z.array(z.number()).min(1, "Select at least one recipient"),
});

export default function NewAnnouncementPage() {
	const router = useRouter();
	const [users, setUsers] = useState<any[]>([]);
	const [title, setTitle] = useState("");
	const [body, setBody] = useState("");
	const [isUrgent, setIsUrgent] = useState(false);
	const [recipientUserIds, setRecipientUserIds] = useState<number[]>([]);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		fetchUsers();
	}, []);

	async function fetchUsers() {
		const token = localStorage.getItem("token");
		if (!token) {
			router.replace("/login");
			return;
		}
		try {
			const response = await axios.get(
				process.env.NEXT_PUBLIC_API_ENDPOINT + "/admin/users",
				{ headers: { Authorization: "Bearer " + token } },
			);
			setUsers(response.data);
		} catch (error) {
			console.error(error);
		}
	}

	function toggleRecipient(id: number) {
		if (recipientUserIds.includes(id)) {
			setRecipientUserIds(recipientUserIds.filter((value) => value !== id));
		} else {
			setRecipientUserIds(recipientUserIds.concat(id));
		}
	}

	return (
		<div className="max-w-xl mx-auto space-y-6">
			<div className="flex items-center justify-between">
				<Header
					title="Broadcast Bulletin"
					subtitle="Transmit critical updates directly to responder network channels."
				/>
				<BackButton href="/admin/announcements" label="Back to Announcements" />
			</div>

			<AceternityCard>
				<form
					onSubmit={async (e) => {
						e.preventDefault();
						setLoading(true);

						const result = announcementSchema.safeParse({
							title,
							body,
							recipientUserIds,
						});

						if (!result.success) {
							setError(result.error.issues[0].message);
							setLoading(false);
							return;
						}

						try {
							const token = localStorage.getItem("token");
							const response = await axios.post(
								process.env.NEXT_PUBLIC_API_ENDPOINT + "/admin/announcement",
								{ title, body, isUrgent, recipientUserIds },
								{ headers: { Authorization: "Bearer " + token } },
							);
							setError("");
							router.push("/admin/announcements/" + response.data.id);
						} catch (err: any) {
							const message =
								err.response && err.response.data && err.response.data.message;
							setError(
								Array.isArray(message)
									? message[0]
									: message || "Something went wrong",
							);
						} finally {
							setLoading(false);
						}
					}}
					className="flex flex-col gap-4 font-sans text-xs"
				>
					<div>
						<label
							htmlFor="title"
							className="font-heading font-semibold text-slate-700 dark:text-slate-300 block mb-1"
						>
							Announcement Title
						</label>
						<input
							id="title"
							className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 p-2.5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
							placeholder="e.g. Urgent Evacuation Advisory"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
						/>
					</div>

					<div>
						<label
							htmlFor="body"
							className="font-heading font-semibold text-slate-700 dark:text-slate-300 block mb-1"
						>
							Body Message
						</label>
						<textarea
							id="body"
							rows={4}
							className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 p-2.5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
							placeholder="Write the full broadcast update..."
							value={body}
							onChange={(e) => setBody(e.target.value)}
						/>
					</div>

					<div className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/40">
						<input
							id="isUrgent"
							type="checkbox"
							className="size-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
							checked={isUrgent}
							onChange={(e) => setIsUrgent(e.target.checked)}
						/>
						<div>
							<label
								htmlFor="isUrgent"
								className="font-heading font-semibold text-xs text-slate-900 dark:text-white cursor-pointer"
							>
								Mark as high-priority urgent
							</label>
							<p className="text-[11px] text-slate-500">
								Urgent announcements trigger immediate automated email blasts.
							</p>
						</div>
					</div>

					<div>
						<label className="font-heading font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
							Select Recipients ({recipientUserIds.length} selected)
						</label>
						<div className="max-h-48 overflow-y-auto rounded-lg border border-slate-200/80 bg-white/40 dark:border-slate-800 dark:bg-slate-900/40 divide-y divide-slate-100 dark:divide-slate-800/60 p-1">
							{users.map((user, index) => (
								<div
									key={index}
									className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded transition"
								>
									<div className="flex items-center gap-2">
										<input
											id={"user-" + user.id}
											type="checkbox"
											className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
											checked={recipientUserIds.includes(user.id)}
											onChange={() => toggleRecipient(user.id)}
										/>
										<label
											htmlFor={"user-" + user.id}
											className="text-xs font-medium cursor-pointer"
										>
											{user.email}
										</label>
									</div>
									<Badge
										className={`border font-heading text-[10px] ${statusColor(user.role)}`}
									>
										{user.role}
									</Badge>
								</div>
							))}
						</div>
					</div>

					{error && (
						<div className="flex items-center gap-2 p-3 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 text-xs">
							<AlertCircle className="size-4 shrink-0" />
							<span>{error}</span>
						</div>
					)}

					<button
						type="submit"
						disabled={loading}
						className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-heading font-semibold py-2.5 px-4 text-xs transition shadow-md shadow-blue-500/20 disabled:opacity-50"
					>
						<Send className="size-3.5" />
						{loading ? "Transmitting..." : "Send Announcement"}
					</button>
				</form>
			</AceternityCard>
		</div>
	);
}
