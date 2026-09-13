"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import axios from "axios";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { statusColor } from "../../../_components/statusColor";
import { AceternityCard } from "@/components/ui/aceternity";
import { ArrowLeft, CheckCircle2, AlertCircle, Save } from "lucide-react";

const detailsSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().min(1, "Description is required"),
	category: z.string().min(1, "Category is required"),
	severity: z.enum(
		["LOW", "MEDIUM", "HIGH", "CRITICAL"],
		"Severity is required",
	),
	city: z.string().min(1, "City is required"),
});

const statusSchema = z.object({
	status: z.enum(["ACTIVE", "CONTAINED", "RESOLVED"], "Status is required"),
});

export default function EditCrisisPage() {
	const params = useParams();
	const router = useRouter();
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [category, setCategory] = useState("");
	const [severity, setSeverity] = useState("");
	const [city, setCity] = useState("");
	const [status, setStatus] = useState("");
	const [currentStatus, setCurrentStatus] = useState("");
	const [error, setError] = useState("");
	const [message, setMessage] = useState("");

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
				process.env.NEXT_PUBLIC_API_ENDPOINT + "/admin/crisis/" + params.id,
			);
			setTitle(response.data.title);
			setDescription(response.data.description);
			setCategory(response.data.category);
			setSeverity(response.data.severity);
			setCity(response.data.city);
			setStatus(response.data.status);
			setCurrentStatus(response.data.status);
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<div className="max-w-2xl mx-auto space-y-6">
			<div className="flex items-center justify-between">
				<Header
					title="Edit Crisis Details"
					subtitle={"Modifying registry incident #" + params.id}
				/>
				{currentStatus && (
					<Badge
						className={`border font-heading text-xs ${statusColor(currentStatus)}`}
					>
						{currentStatus}
					</Badge>
				)}
				<BackButton href="/admin/crises" label="Back to All Crises" />
			</div>

			{error && (
				<div className="flex items-center gap-2 p-3 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/30 text-xs font-sans">
					<AlertCircle className="size-4 shrink-0" />
					<span>{error}</span>
				</div>
			)}
			{message && (
				<div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/30 text-xs font-sans">
					<CheckCircle2 className="size-4 shrink-0" />
					<span>{message}</span>
				</div>
			)}

			{/* Details Update */}
			<AceternityCard>
				<h2 className="font-heading text-base font-bold mb-4">
					Core Incident Record
				</h2>
				<form
					onSubmit={async (e) => {
						e.preventDefault();

						const result = detailsSchema.safeParse({
							title,
							description,
							category,
							severity,
							city,
						});

						if (!result.success) {
							setMessage("");
							setError(result.error.issues[0].message);
							return;
						}

						const token = localStorage.getItem("token");
						if (!token) {
							setMessage("");
							setError("Log in as an admin first");
							return;
						}

						try {
							const response = await axios.put(
								process.env.NEXT_PUBLIC_API_ENDPOINT +
									"/admin/crisis/" +
									params.id,
								{ title, description, category, severity, city },
								{ headers: { Authorization: "Bearer " + token } },
							);
							setTitle(response.data.title);
							setDescription(response.data.description);
							setCategory(response.data.category);
							setSeverity(response.data.severity);
							setCity(response.data.city);
							setStatus(response.data.status);
							setCurrentStatus(response.data.status);
							setError("");
							setMessage("Crisis updated");
						} catch (err: any) {
							const message =
								err.response && err.response.data && err.response.data.message;
							setMessage("");
							setError(
								Array.isArray(message)
									? message[0]
									: message || "Something went wrong",
							);
						}
					}}
					className="flex flex-col gap-3 font-sans text-xs"
				>
					<div>
						<label
							htmlFor="title"
							className="font-heading font-semibold text-slate-700 dark:text-slate-300 block mb-1"
						>
							Title
						</label>
						<input
							id="title"
							className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 p-2.5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
						/>
					</div>

					<div>
						<label
							htmlFor="description"
							className="font-heading font-semibold text-slate-700 dark:text-slate-300 block mb-1"
						>
							Description
						</label>
						<textarea
							id="description"
							rows={4}
							className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 p-2.5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
					</div>

					<div className="grid gap-3 sm:grid-cols-3">
						<div>
							<label
								htmlFor="category"
								className="font-heading font-semibold text-slate-700 dark:text-slate-300 block mb-1"
							>
								Category
							</label>
							<input
								id="category"
								className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 p-2.5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
								value={category}
								onChange={(e) => setCategory(e.target.value)}
							/>
						</div>

						<div>
							<label
								htmlFor="severity"
								className="font-heading font-semibold text-slate-700 dark:text-slate-300 block mb-1"
							>
								Severity
							</label>
							<select
								id="severity"
								className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 p-2.5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
								value={severity}
								onChange={(e) => setSeverity(e.target.value)}
							>
								<option value="">Select severity</option>
								<option value="LOW">LOW</option>
								<option value="MEDIUM">MEDIUM</option>
								<option value="HIGH">HIGH</option>
								<option value="CRITICAL">CRITICAL</option>
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
								className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 p-2.5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
								value={city}
								onChange={(e) => setCity(e.target.value)}
							/>
						</div>
					</div>

					<button
						type="submit"
						className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-heading font-semibold py-2 px-4 text-xs transition"
					>
						<Save className="size-3.5" /> Save Changes
					</button>
				</form>
			</AceternityCard>

			{/* Status Workflow */}
			<AceternityCard>
				<h2 className="font-heading text-base font-bold mb-2">
					Lifecycle State
				</h2>
				<form
					onSubmit={async (e) => {
						e.preventDefault();

						const result = statusSchema.safeParse({ status });
						if (!result.success) {
							setMessage("");
							setError(result.error.issues[0].message);
							return;
						}

						const token = localStorage.getItem("token");
						if (!token) {
							setMessage("");
							setError("Log in as an admin first");
							return;
						}

						try {
							const response = await axios.patch(
								process.env.NEXT_PUBLIC_API_ENDPOINT +
									"/admin/crisis/" +
									params.id +
									"/status",
								{ status },
								{ headers: { Authorization: "Bearer " + token } },
							);
							setStatus(response.data.status);
							setCurrentStatus(response.data.status);
							setError("");
							setMessage("Status updated");
						} catch (err: any) {
							const message =
								err.response && err.response.data && err.response.data.message;
							setMessage("");
							setError(
								Array.isArray(message)
									? message[0]
									: message || "Something went wrong",
							);
						}
					}}
					className="flex flex-col gap-3 font-sans text-xs"
				>
					<div>
						<label
							htmlFor="status"
							className="font-heading font-semibold text-slate-700 dark:text-slate-300 block mb-1"
						>
							Select Current Operational Status
						</label>
						<select
							id="status"
							className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 p-2.5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
							value={status}
							onChange={(e) => setStatus(e.target.value)}
						>
							<option value="">Select status</option>
							<option value="ACTIVE">ACTIVE</option>
							<option value="CONTAINED">CONTAINED</option>
							<option value="RESOLVED">RESOLVED</option>
						</select>
					</div>

					<button
						type="submit"
						className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-heading font-semibold py-2 px-4 text-xs transition"
					>
						Update Status
					</button>
				</form>
			</AceternityCard>
		</div>
	);
}
