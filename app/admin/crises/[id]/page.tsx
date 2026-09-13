import axios from "axios";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { statusColor } from "../../_components/statusColor";
import CrisisActions from "./CrisisActions";
import { AceternityCard } from "@/components/ui/aceternity";
import {
	MapPin,
	Calendar,
	UserCheck,
	ArrowLeft,
	Building2,
} from "lucide-react";
import BackButton from "@/components/BackButton";

export default async function CrisisDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	let crisis: any = null;
	try {
		const response = await axios.get(
			process.env.NEXT_PUBLIC_API_ENDPOINT + "/admin/crisis/" + id,
		);
		crisis = response.data;
	} catch (error) {
		crisis = null;
	}

	if (!crisis) {
		notFound();
	}

	const ngos = Array.isArray(crisis.ngos) ? crisis.ngos : [];

	return (
		<div className="max-w-4xl mx-auto space-y-6">
			<div className="flex items-center justify-between">
				<BackButton href="/admin/crises" label="Back to Crises" />
			</div>

			<AceternityCard>
				<div className="flex flex-wrap items-center gap-2 mb-2">
					<Badge
						className={`border font-heading text-[11px] ${statusColor(crisis.severity)}`}
					>
						{crisis.severity} SEVERITY
					</Badge>
					<Badge
						className={`border font-heading text-[11px] ${statusColor(crisis.status)}`}
					>
						{crisis.status}
					</Badge>
				</div>

				<Header title={crisis.title} />
				<p className="font-sans text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl mt-2">
					{crisis.description}
				</p>

				<div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/50 font-sans">
					<div>
						<span className="font-heading text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
							Category
						</span>
						<span className="font-sans text-sm font-medium text-slate-800 dark:text-slate-200">
							{crisis.category}
						</span>
					</div>
					<div>
						<span className="font-heading text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
							Location
						</span>
						<span className="font-sans text-sm font-medium text-slate-800 dark:text-slate-200 inline-flex items-center gap-1">
							<MapPin className="size-3.5 text-blue-500" /> {crisis.city}
						</span>
					</div>
					<div className="col-span-2 sm:col-span-2">
						<span className="font-heading text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
							Declared At
						</span>
						<span className="font-sans text-sm font-medium text-slate-800 dark:text-slate-200 inline-flex items-center gap-1">
							<Calendar className="size-3.5 text-slate-400" />{" "}
							{new Date(crisis.declaredAt).toLocaleString()}
						</span>
					</div>
				</div>

				{crisis.declaredByAdmin && (
					<div className="mt-4 flex items-center gap-2 font-sans text-xs text-slate-500">
						<UserCheck className="size-3.5 text-blue-600" />
						<span>
							Declared by authorized admin:{" "}
							<strong className="font-semibold text-slate-700 dark:text-slate-300">
								{crisis.declaredByAdmin.fullName}
							</strong>
						</span>
					</div>
				)}

				<CrisisActions crisisId={crisis.id} />
			</AceternityCard>

			<div className="space-y-3">
				<h2 className="font-heading text-lg font-bold">
					Participating NGOs ({ngos.length})
				</h2>
				{ngos.length > 0 ? (
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{ngos.map((ngo: any, index: number) => (
							<Card
								key={index}
								className="border border-slate-200/80 bg-white/70 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/60"
							>
								<CardHeader>
									<div className="flex items-center gap-2">
										<Building2 className="size-4 text-indigo-500" />
										<CardTitle className="font-heading text-base font-bold">
											{ngo.orgName}
										</CardTitle>
									</div>
									<CardDescription className="font-sans text-xs">
										{ngo.city}
									</CardDescription>
								</CardHeader>
							</Card>
						))}
					</div>
				) : (
					<div className="rounded-xl border border-slate-200/80 bg-white/40 p-4 font-sans text-xs text-slate-500 dark:border-slate-800">
						No NGOs have deployed relief units yet.
					</div>
				)}
			</div>
		</div>
	);
}
