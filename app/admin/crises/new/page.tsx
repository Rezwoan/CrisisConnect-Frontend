"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import axios from "axios";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { AceternityCard } from "@/components/ui/aceternity";
import { ArrowLeft, AlertCircle, PlusCircle } from "lucide-react";

const crisisSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().min(1, "Description is required"),
	category: z.string().min(1, "Category is required"),
	severity: z.enum(
		["LOW", "MEDIUM", "HIGH", "CRITICAL"],
		"Severity is required",
	),
	city: z.string().min(1, "City is required"),
});

export default function DeclareCrisisPage() {
	const router = useRouter();
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [category, setCategory] = useState("");
	const [severity, setSeverity] = useState("");
	const [city, setCity] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	return (
		<div className="max-w-xl mx-auto space-y-4">
			<div className="flex items-center justify-between">
				<Header
					title="Declare a Crisis"
					subtitle="Initiate a crisis escalation event and broadcast response tasks."
				/>

				<BackButton href="/admin/crises" label="Back to All Crises" />
			</div>

			<AceternityCard>
				<form
					onSubmit={async (e) => {
						e.preventDefault();
						setLoading(true);

						const result = crisisSchema.safeParse({
							title,
							description,
							category,
							severity,
							city,
						});

						if (!result.success) {
							setError(result.error.issues[0].message);
							setLoading(false);
							return;
						}

						const token = localStorage.getItem("token");
						if (!token) {
							setError("Log in as an admin first");
							setLoading(false);
							return;
						}

						try {
							const response = await axios.post(
								process.env.NEXT_PUBLIC_API_ENDPOINT + "/admin/crisis",
								{ title, description, category, severity, city },
								{ headers: { Authorization: "Bearer " + token } },
							);
							setError("");
							router.push("/admin/crises/" + response.data.id);
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
							Crisis Title
						</label>
						<input
							id="title"
							className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 p-2.5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
							placeholder="e.g. Flash Flood in Sector 4"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
						/>
					</div>

					<div>
						<label
							htmlFor="description"
							className="font-heading font-semibold text-slate-700 dark:text-slate-300 block mb-1"
						>
							Detailed Description
						</label>
						<textarea
							id="description"
							rows={4}
							className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 p-2.5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
							placeholder="Outline impact, affected zones, and initial logistical needs..."
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
					</div>

					<div className="grid gap-4 sm:grid-cols-3">
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
								placeholder="Flood, Fire, Medical"
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
								City / Location
							</label>
							<input
								id="city"
								className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 p-2.5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
								placeholder="Dhaka, Sylhet"
								value={city}
								onChange={(e) => setCity(e.target.value)}
							/>
						</div>
					</div>

					{error && (
						<div className="flex items-center gap-2 p-3 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/30 dark:border-rose-900/50">
							<AlertCircle className="size-4 shrink-0" />
							<span>{error}</span>
						</div>
					)}

					<button
						type="submit"
						disabled={loading}
						className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-heading font-semibold py-2.5 px-4 text-xs transition shadow-md shadow-rose-500/20 disabled:opacity-50"
					>
						<PlusCircle className="size-4" />
						{loading ? "Declaring..." : "Declare Crisis Escalation"}
					</button>
				</form>
			</AceternityCard>
		</div>
	);
}
