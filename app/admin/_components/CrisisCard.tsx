import Link from "next/link";
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
import { statusColor } from "./statusColor";
import { MapPin, Tag, ExternalLink, Pencil } from "lucide-react";

export default function CrisisCard(props: {
	crisis: {
		id: number;
		title: string;
		category: string;
		severity: string;
		status: string;
		city: string;
	};
}) {
	const { crisis } = props;

	return (
		<Card className="border border-slate-200/80 bg-white/70 shadow-sm backdrop-blur-sm transition hover:shadow-md hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/60 flex flex-col justify-between">
			<CardHeader>
				<div className="flex items-start justify-between gap-2">
					<CardTitle className="font-heading text-lg font-bold leading-snug">
						{crisis.title}
					</CardTitle>
				</div>
				<CardDescription className="flex items-center gap-3 font-sans text-xs text-slate-500 mt-1">
					<span className="inline-flex items-center gap-1">
						<Tag className="size-3" /> {crisis.category}
					</span>
					<span className="inline-flex items-center gap-1">
						<MapPin className="size-3" /> {crisis.city}
					</span>
				</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-wrap gap-2 pt-0 font-sans">
				<Badge
					className={`border font-heading text-[11px] ${statusColor(crisis.severity)}`}
				>
					{crisis.severity}
				</Badge>
				<Badge
					className={`border font-heading text-[11px] ${statusColor(crisis.status)}`}
				>
					{crisis.status}
				</Badge>
			</CardContent>
			<CardFooter className="gap-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 px-4 py-2.5">
				<Button
					variant="link"
					size="sm"
					className="px-0 font-heading text-xs font-semibold text-blue-600 hover:text-blue-700"
					nativeButton={false}
					render={<Link href={"/admin/crises/" + crisis.id} />}
				>
					<ExternalLink className="size-3 mr-1" /> View details
				</Button>
				<Button
					variant="link"
					size="sm"
					className="ml-auto px-0 font-heading text-xs font-semibold text-slate-600 hover:text-slate-800 dark:text-slate-400"
					nativeButton={false}
					render={<Link href={"/admin/crises/" + crisis.id + "/edit"} />}
				>
					<Pencil className="size-3 mr-1" /> Edit
				</Button>
			</CardFooter>
		</Card>
	);
}
