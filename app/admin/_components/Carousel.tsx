import Link from "next/link";
import {
	Carousel as UICarousel,
	CarouselContent,
	CarouselItem,
	CarouselPrevious,
	CarouselNext,
} from "@/components/ui/carousel";
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
import { MapPin, AlertCircle, ArrowUpRight } from "lucide-react";

export default function Carousel(props: {
	crises: {
		id: number;
		title: string;
		category: string;
		city: string;
		severity: string;
	}[];
}) {
	const { crises } = props;

	if (crises.length === 0) {
		return (
			<div className="flex items-center gap-2 p-4 rounded-xl border border-slate-200 bg-white/50 text-slate-600 dark:border-slate-800 dark:bg-slate-900/50">
				<AlertCircle className="size-4" />
				<p className="text-sm font-sans">No active crises right now.</p>
			</div>
		);
	}

	return (
		<UICarousel className="w-full max-w-md mx-auto sm:mx-0">
			<CarouselContent>
				{crises.map((crisis, index) => (
					<CarouselItem key={index}>
						<Card className="border border-slate-200/80 bg-white/70 shadow-md backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/60">
							<CardHeader>
								<div className="flex items-start justify-between">
									<Badge
										className={`border font-heading text-[10px] ${statusColor(crisis.severity)}`}
									>
										{crisis.severity} PRIORITY
									</Badge>
									<span className="font-sans text-xs text-slate-400">
										#{crisis.id}
									</span>
								</div>
								<CardTitle className="font-heading text-lg font-bold mt-2">
									{crisis.title}
								</CardTitle>
								<CardDescription className="flex items-center gap-2 font-sans text-xs text-slate-500">
									<span>{crisis.category}</span>
									<span>•</span>
									<span className="inline-flex items-center gap-1">
										<MapPin className="size-3" /> {crisis.city}
									</span>
								</CardDescription>
							</CardHeader>
							<CardFooter className="border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40">
								<Button
									variant="link"
									className="px-0 font-heading text-xs font-semibold text-blue-600 hover:text-blue-700"
									nativeButton={false}
									render={<Link href={"/admin/crises/" + crisis.id} />}
								>
									Inspect crisis <ArrowUpRight className="size-3.5 ml-1" />
								</Button>
							</CardFooter>
						</Card>
					</CarouselItem>
				))}
			</CarouselContent>
			<div className="flex justify-end gap-2 mt-3 pr-1">
				<CarouselPrevious className="static translate-y-0" />
				<CarouselNext className="static translate-y-0" />
			</div>
		</UICarousel>
	);
}
