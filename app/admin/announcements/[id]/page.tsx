"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import Header from "@/components/Header";
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { statusColor } from "../../_components/statusColor";
import { AceternityCard } from "@/components/ui/aceternity";
import { Calendar, UserMinus, PlusCircle, AlertCircle } from "lucide-react";
import BackButton from "@/components/BackButton";

export default function AnnouncementPage() {
	const params = useParams();
	const router = useRouter();
	const [announcement, setAnnouncement] = useState<any>(null);
	const [error, setError] = useState("");

	useEffect(() => {
		fetchData();
	}, []);

	async function fetchData() {
		const token = localStorage.getItem("token");
		if (!token) {
			router.replace("/login");
			return;
		}
		try {
			const response = await axios.get(
				process.env.NEXT_PUBLIC_API_ENDPOINT +
					"/admin/announcement/" +
					params.id,
				{ headers: { Authorization: "Bearer " + token } },
			);
			setAnnouncement(response.data);
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<div className="max-w-3xl mx-auto space-y-6">
			<div className="flex items-center justify-between">
				<Header
					title="Announcement Overview"
					subtitle="Delivery details and recipient access management."
				/>
				<Button
					className="bg-blue-600 hover:bg-blue-700 text-white font-heading text-xs font-semibold gap-1"
					nativeButton={false}
					render={<Link href="/admin/announcements/new" />}
				>
					<PlusCircle className="size-3.5" /> New announcement
				</Button>
				<BackButton href="/admin/announcements" label="Back to Announcements" />
			</div>

			{error && (
				<div className="flex items-center gap-2 p-3 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 text-xs font-sans">
					<AlertCircle className="size-4 shrink-0" />
					<span>{error}</span>
				</div>
			)}

			{announcement != null && (
				<AceternityCard>
					<div className="flex items-start justify-between gap-4">
						<h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white">
							{announcement.title}
						</h2>
						{announcement.isUrgent && (
							<Badge
								className={`border font-heading text-[10px] ${statusColor("URGENT")}`}
							>
								URGENT
							</Badge>
						)}
					</div>
					<div className="flex items-center gap-1.5 font-sans text-xs text-slate-400 mt-1">
						<Calendar className="size-3" />
						<span>{new Date(announcement.createdAt).toLocaleString()}</span>
					</div>
					<p className="font-sans text-sm text-slate-700 dark:text-slate-300 mt-4 leading-relaxed">
						{announcement.body}
					</p>
				</AceternityCard>
			)}

			{announcement != null && (
				<div className="space-y-3">
					<h3 className="font-heading text-base font-bold text-slate-800 dark:text-slate-200">
						Assigned Recipients ({announcement.recipients?.length || 0})
					</h3>
					<div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 font-sans">
						{announcement.recipients.map((recipient: any, index: number) => (
							<Card
								key={index}
								className="border border-slate-200/80 bg-white/70 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/60"
							>
								<CardHeader className="pb-2">
									<CardTitle className="font-sans text-xs font-semibold truncate">
										{recipient.email}
									</CardTitle>
								</CardHeader>
								<CardContent className="pb-2">
									<Badge
										className={`border font-heading text-[10px] ${statusColor(recipient.role)}`}
									>
										{recipient.role}
									</Badge>
								</CardContent>
								<CardFooter className="pt-0">
									<Button
										variant="destructive"
										size="xs"
										className="w-full font-heading text-[11px] font-semibold gap-1"
										onClick={async () => {
											try {
												const token = localStorage.getItem("token");
												await axios.delete(
													process.env.NEXT_PUBLIC_API_ENDPOINT +
														"/admin/announcement/" +
														params.id +
														"/recipient/" +
														recipient.id,
													{ headers: { Authorization: "Bearer " + token } },
												);
												setError("");
												fetchData();
											} catch (err: any) {
												const message =
													err.response &&
													err.response.data &&
													err.response.data.message;
												setError(
													Array.isArray(message)
														? message[0]
														: message || "Something went wrong",
												);
											}
										}}
									>
										<UserMinus className="size-3" /> Remove
									</Button>
								</CardFooter>
							</Card>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
