import axios from "axios";
import Link from "next/link";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import CrisisCard from "../_components/CrisisCard";
import { AceternityCard } from "@/components/ui/aceternity";
import { PlusCircle, Filter, RotateCcw } from "lucide-react";

export default async function CrisesPage({
	searchParams,
}: {
	searchParams: Promise<{
		status?: string;
		severity?: string;
		category?: string;
		city?: string;
	}>;
}) {
	const filters = await searchParams;

	const params: any = {};
	if (filters.status) params.status = filters.status;
	if (filters.severity) params.severity = filters.severity;
	if (filters.category) params.category = filters.category;
	if (filters.city) params.city = filters.city;

	const response = await axios.get(
		process.env.NEXT_PUBLIC_API_ENDPOINT + "/admin/crisis",
		{ params },
	);
	const crises = Array.isArray(response.data) ? response.data : [];

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<Header
					title="All Crises"
					subtitle="Filter and monitor city-wide incident reports."
				/>
				<Button
					className="bg-blue-600 hover:bg-blue-700 text-white font-heading text-xs font-semibold gap-1.5"
					nativeButton={false}
					render={<Link href="/admin/crises/new" />}
				>
					<PlusCircle className="size-4" /> Declare a crisis
				</Button>
			</div>

			<AceternityCard className="p-4">
				<form
					method="get"
					action="/admin/crises"
					className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 font-sans text-xs"
				>
					<div>
						<label
							htmlFor="status"
							className="font-heading font-semibold text-slate-700 dark:text-slate-300 block mb-1"
						>
							Status
						</label>
						<select
							id="status"
							name="status"
							className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 p-2 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/40"
							defaultValue={filters.status ?? ""}
						>
							<option value="">All statuses</option>
							<option value="ACTIVE">ACTIVE</option>
							<option value="CONTAINED">CONTAINED</option>
							<option value="RESOLVED">RESOLVED</option>
						</select>
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
							name="severity"
							className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 p-2 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/40"
							defaultValue={filters.severity ?? ""}
						>
							<option value="">All severities</option>
							<option value="LOW">LOW</option>
							<option value="MEDIUM">MEDIUM</option>
							<option value="HIGH">HIGH</option>
							<option value="CRITICAL">CRITICAL</option>
						</select>
					</div>

					<div>
						<label
							htmlFor="category"
							className="font-heading font-semibold text-slate-700 dark:text-slate-300 block mb-1"
						>
							Category
						</label>
						<input
							id="category"
							name="category"
							placeholder="e.g. Flood, Fire"
							className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 p-2 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/40"
							defaultValue={filters.category ?? ""}
						/>
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
							name="city"
							placeholder="e.g. Dhaka"
							className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 p-2 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/40"
							defaultValue={filters.city ?? ""}
						/>
					</div>

					<div className="sm:col-span-2 md:col-span-4 flex items-center gap-2 pt-1">
						<button
							type="submit"
							className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 font-heading text-xs font-semibold text-white shadow hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
						>
							<Filter className="size-3.5" /> Apply filters
						</button>
						<Link
							href="/admin/crises"
							className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 font-heading text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400"
						>
							<RotateCcw className="size-3" /> Clear
						</Link>
					</div>
				</form>
			</AceternityCard>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{crises.map((crisis, index) => (
					<CrisisCard key={index} crisis={crisis} />
				))}
			</div>

			{crises.length === 0 && (
				<div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm font-sans text-slate-500 dark:border-slate-800">
					No crises match the selected parameters.
				</div>
			)}
		</div>
	);
}
